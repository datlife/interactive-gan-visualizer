"""YOLOv2 Model Definition"""
import tensorflow as tf
import keras.backend as K

from keras.layers import Conv2D
from keras.layers import MaxPool2D
from keras.layers import BatchNormalization
from keras.layers import Lambda, concatenate
from keras.layers.advanced_activations import LeakyReLU
from keras.regularizers import l2

from .custom_layers import PostProcessor


class YOLOv2(object):
    def __init__(self, anchors, num_classes, preprocess_func):
        self.anchors     = anchors
        self.num_classes = num_classes
        self.preprocess_func = preprocess_func

    def predict(self, resized_inputs):

        anchors, num_classes = self.anchors, self.num_classes
        preprocess_func = self.preprocess_func

        # ##################
        # Feature Extractor
        # ##################
        x = Lambda(lambda x: preprocess_func(x), name='preprocess_inputs')(resized_inputs)

        x = conv_block(x, 32, (3, 3))  # << --- Start feature extraction
        x = MaxPool2D(strides=2)(x)

        x = conv_block(x, 64, (3, 3))
        x = MaxPool2D(strides=2)(x)

        x = conv_block(x, 128, (3, 3))
        x = conv_block(x, 64, (1, 1))
        x = conv_block(x, 128, (3, 3))
        x = MaxPool2D(strides=2)(x)

        x = conv_block(x, 256, (3, 3))
        x = conv_block(x, 128, (1, 1))
        x = conv_block(x, 256, (3, 3))
        x = MaxPool2D(strides=2)(x)

        x = conv_block(x, 512, (3, 3))
        x = conv_block(x, 256, (1, 1))
        x = conv_block(x, 512, (3, 3))
        x = conv_block(x, 256, (1, 1))
        x = conv_block(x, 512, (3, 3))
        fine_grained_layer = x
        x = MaxPool2D(strides=2)(x)

        x = conv_block(x, 1024, (3, 3))
        x = conv_block(x, 512, (1, 1))
        x = conv_block(x, 1024, (3, 3))
        x = conv_block(x, 512, (1, 1))
        feature_map = conv_block(x, 1024, (3, 3))  # ---> feature extraction ends here

        # ################
        # Object Detector
        # ################
        x = conv_block(feature_map, 1024, (3, 3))
        x = conv_block(x, 1024, (3, 3))
        x2 = x

        # Reroute
        x = conv_block(fine_grained_layer, 64, (1, 1))
        x = Lambda(space_to_depth, determine_reroute_shape, name='space_to_depth_x2')(x)

        x = concatenate([x, x2])
        x = conv_block(x, 1024, (3, 3))

        prediction = Conv2D(len(anchors) * (num_classes + 5), (1, 1), name='yolov2')(x)

        return prediction

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
        classes = Lambda(lambda x: K.cast(x[..., 5], tf.float32),  name="classes")(outputs)

        return boxes,  classes, scores


# ##############
# HELPER METHODS
# ##############


def space_to_depth(x, block_size=2):
    import tensorflow as tf
    return tf.space_to_depth(x, block_size)


def determine_reroute_shape(shape):
    if shape[1]:
        return [shape[0], shape[1] / 2, shape[2] / 2, 2 * 2 * shape[-1]]
    else:
        return [shape[0], None, None, 2 * 2 * shape[-1]]


def conv_block(x, filters, kernel_size, name=None):
    """
    Standard YOLOv2 Convolutional Block as suggested in YOLO9000 paper
    """
    x = Conv2D(filters     = filters,
               kernel_size = kernel_size,
               padding     = 'same',
               use_bias    = False, name=name)(x)
    x = BatchNormalization(name=name if name is None else 'batch_norm_%s' % name)(x)
    x = LeakyReLU(alpha=0.1, name=name if name is None else 'leaky_relu_%s' % name)(x)
    return x


def interpret_prediction(prediction, anchors, num_classes):
    N_CLASSES = num_classes
    N_ANCHORS = len(anchors)
    ANCHORS = anchors

    pred_shape = tf.shape(prediction)
    GRID_H, GRID_W = pred_shape[1], pred_shape[2]

    prediction = K.reshape(prediction, [-1, pred_shape[1], pred_shape[2], N_ANCHORS, N_CLASSES + 5])

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

    anchors_tensor = tf.to_float(K.reshape(ANCHORS, [1, 1, 1, N_ANCHORS, 2]))
    netout_size = tf.to_float(K.reshape([GRID_W, GRID_H], [1, 1, 1, 1, 2]))

    box_xy = K.sigmoid(prediction[..., :2])
    box_wh = K.exp(prediction[..., 2:4])
    box_confidence = K.sigmoid(prediction[..., 4:5])
    box_class_probs = K.softmax(prediction[..., 5:])

    # Shift center points to its grid cell accordingly (Ref: YOLO-9000 loss function)
    box_xy = (box_xy + c_xy) / netout_size
    box_wh = (box_wh * anchors_tensor) / netout_size

    return box_xy, box_wh, box_confidence, box_class_probs
