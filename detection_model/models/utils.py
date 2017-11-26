"""
Helper Methods
"""
import keras.backend as K
import tensorflow as tf


def _interpret_prediction(self, prediction):
    N_CLASSES = self.num_classes
    N_ANCHORS = len(self.anchors)
    ANCHORS = self.anchors

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
