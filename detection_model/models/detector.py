from darknet19 import conv_block

from keras.regularizers import l2
from keras.layers.merge import concatenate
from keras.layers import Lambda, Conv2D


def yolov2_detector(feature_extractor, num_classes, num_anchors, fine_grained_layers):
    """
    Original YOLOv2 Implementation
    :param feature_extractor:
    :param num_classes:
    :param num_anchors:

    :return:
    """
    inputs = feature_extractor.model.output
    i = feature_extractor.model.get_layer(fine_grained_layers).output

    x = conv_block(inputs, 1024, (3, 3))
    x = conv_block(x, 1024, (3, 3))
    x2 = x

    # Reroute
    x = conv_block(i, 64, (1, 1))
    x = Lambda(space_to_depth,
               determine_shape,
               name='space_to_depth_x2')(x)

    x = concatenate([x, x2])
    x = conv_block(x, 1024, (3, 3))
    x = Conv2D(num_anchors * (num_classes + 5), (1, 1), name='yolov2', kernel_regularizer=l2(5e-4))(x)

    return x


def space_to_depth(x, block_size=2):
    import tensorflow as tf
    return tf.space_to_depth(x, block_size)


def determine_shape(shape):
    if shape[1]:
        return [shape[0], shape[1] / 2, shape[2] / 2, 2 * 2 * shape[-1]]
    else:
        return [shape[0], None, None, 2 * 2 * shape[-1]]

