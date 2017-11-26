"""
YOLOv2 Meta-Architecture

        images --> feature extractor --> feature map --> detector --> output feature map

In this file, we define three different detector:
   * Original YOLOv2 Detector

"""
import numpy as np
import tensorflow as tf
import keras.backend as K

from keras.layers import Lambda
from keras.models import Model

from .detector import yolov2_detector
from .custom_layers import PostProcessor
from .utils import interpret_prediction

FINE_GRAINED_LAYERS = {'yolov2': 'leaky_re_lu_13'}
DETECTOR = {'yolov2': yolov2_detector}


class YOLOv2(object):
    def __init__(self,
                 is_training,
                 img_size,
                 num_classes,
                 anchors,
                 feature_extractor,
                 detector
                 ):
        """
        YOLOv2 Meta-Architecture

        images --> feature extractor --> feature map --> detector --> output feature map

        :param num_classes:
        :param img_size
        :param anchors:
        :param is_training:
        :param feature_extractor:
        :param detector:
        """
        self._is_training      = is_training

        self.num_classes       = num_classes
        self.anchors           = anchors
        self.img_size          = img_size

        self.feature_extractor = feature_extractor
        self.fine_grained_layers = FINE_GRAINED_LAYERS[feature_extractor.name]
        self.detector = DETECTOR[detector](feature_extractor, num_classes, len(anchors), self.fine_grained_layers)

        # YOLOv2 Model
        self.model = Model(inputs=feature_extractor.model.input,
                           outputs=self.detector)

    def post_process(self, prediction, iou_threshold=0.5, score_threshold=0.6):
        """
        Input: out feature map from network

        Output:
           Bounding Boxes - Classes - Probabilities
        """
        outputs = PostProcessor(score_threshold, iou_threshold, interpret_prediction,
                                self.anchors, self.num_classes,
                                name="non_max_suppression")(prediction)
        boxes   = Lambda(lambda x: x[..., :4], name="boxes")(outputs)
        scores  = Lambda(lambda x: x[..., 4],  name="scores")(outputs)
        classes = Lambda(lambda x: K.cast(x[..., 5], tf.int8),  name="classes")(outputs)

        return boxes,  classes, scores

    def loss_func(self, y_true, y_pred):
        """
        YOLOv2 Loss Function Implementation

        Input: out feature map from network

        Output:
           A scalar - loss value for back propagation

        """
        N_ANCHORS = len(self.anchors)
        N_CLASSES = self.num_classes

        pred_shape = K.shape(y_pred)[1:3]
        GRID_H     = tf.cast(pred_shape[0], tf.int32)  # shape of output feature map
        GRID_W     = tf.cast(pred_shape[1], tf.int32)

        output_size = tf.cast(tf.reshape([GRID_W, GRID_H], [1, 1, 1, 1, 2]), tf.float32)
        y_pred = tf.reshape(y_pred, [-1, pred_shape[0], pred_shape[1], N_ANCHORS, N_CLASSES + 5])

        # Create off set map
        cx = tf.cast((K.arange(0, stop=GRID_W)), dtype=tf.float32)
        cx = K.tile(cx, [GRID_H])
        cx = K.reshape(cx, [-1, GRID_H, GRID_W, 1])

        cy = K.cast((K.arange(0, stop=GRID_H)), dtype=tf.float32)
        cy = K.reshape(cy, [-1, 1])
        cy = K.tile(cy, [1, GRID_W])
        cy = K.reshape(cy, [-1])
        cy = K.reshape(cy, [-1, GRID_H, GRID_W, 1])

        c_xy = tf.stack([cx, cy], -1)
        c_xy = tf.to_float(c_xy)

        # Scale anchors to correct aspect ratio
        pred_box_xy   = (tf.sigmoid(y_pred[:, :, :, :, :2]) + c_xy) / output_size
        pred_box_wh   = tf.exp(y_pred[:, :, :, :, 2:4]) * np.reshape(self.anchors, [1, 1, 1, N_ANCHORS, 2]) / output_size
        pred_box_wh   = tf.sqrt(pred_box_wh)
        pred_box_conf = tf.sigmoid(y_pred[:, :, :, :, 4:5])
        pred_box_prob = tf.nn.softmax(y_pred[:, :, :, :, 5:])

        # Adjust ground truth
        gt_shape   = K.shape(y_true)  # shape of ground truth value
        y_true = tf.reshape(y_true, [-1, gt_shape[1], gt_shape[2], N_ANCHORS, N_CLASSES + 5])

        true_box_xy = y_true[:, :, :, :, 0:2]
        true_box_wh = tf.sqrt(y_true[:, :, :, :, 2:4])

        # adjust confidence
        pred_tem_wh   = tf.pow(pred_box_wh, 2) * output_size
        pred_box_ul   = pred_box_xy - 0.5 * pred_tem_wh
        pred_box_bd   = pred_box_xy + 0.5 * pred_tem_wh
        pred_box_area = pred_tem_wh[:, :, :, :, 0] * pred_tem_wh[:, :, :, :, 1]

        true_tem_wh   = tf.pow(true_box_wh, 2) * output_size
        true_box_ul   = true_box_xy - 0.5 * true_tem_wh
        true_box_bd   = true_box_xy + 0.5 * true_tem_wh
        true_box_area = true_tem_wh[:, :, :, :, 0] * true_tem_wh[:, :, :, :, 1]

        intersect_ul   = tf.maximum(pred_box_ul, true_box_ul)
        intersect_br   = tf.minimum(pred_box_bd, true_box_bd)
        intersect_wh   = tf.maximum(intersect_br - intersect_ul, 0.0)
        intersect_area = intersect_wh[..., 0] * intersect_wh[..., 1]

        iou = tf.truediv(intersect_area, true_box_area + pred_box_area - intersect_area)
        best_box = tf.equal(iou, tf.reduce_max(iou, [3], True))
        best_box = tf.to_float(best_box)
        true_box_conf = tf.expand_dims(best_box * y_true[:, :, :, :, 4], -1)
        true_box_prob = y_true[:, :, :, :, 5:]

        # Localization Loss
        weight_coor = 5.0 * tf.concat(4 * [true_box_conf], 4)
        true_boxes = tf.concat([true_box_xy, true_box_wh], 4)
        pred_boxes = tf.concat([pred_box_xy, pred_box_wh], 4)
        loc_loss = tf.pow(true_boxes - pred_boxes, 2) * weight_coor
        loc_loss = tf.reshape(loc_loss, [-1, tf.cast(GRID_W * GRID_H, tf.int32) * N_ANCHORS * 4])
        loc_loss = tf.reduce_mean(tf.reduce_sum(loc_loss, 1))

        # NOTE: YOLOv2 does not use cross-entropy loss.
        # Object Confidence Loss
        weight_conf = 0.5 * (1. - true_box_conf) + 5.0 * true_box_conf
        obj_conf_loss = tf.pow(true_box_conf - pred_box_conf, 2) * weight_conf
        obj_conf_loss = tf.reshape(obj_conf_loss, [-1, tf.cast(GRID_W * GRID_H, tf.int32) * N_ANCHORS])
        obj_conf_loss = tf.reduce_mean(tf.reduce_sum(obj_conf_loss, 1))

        # Category Loss
        weight_prob = 1.0 * tf.concat(N_CLASSES * [true_box_conf], 4)
        category_loss = tf.pow(true_box_prob - pred_box_prob, 2) * weight_prob
        category_loss = tf.reshape(category_loss, [-1, tf.cast(GRID_W * GRID_H, tf.int32) * N_ANCHORS * N_CLASSES])
        category_loss = tf.reduce_mean(tf.reduce_sum(category_loss, 1))

        loss = 0.5 * (loc_loss + obj_conf_loss + category_loss)

        return loss