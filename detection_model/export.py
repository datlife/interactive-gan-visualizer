"""
Export trained Model in Keras into TF Serving
"""
from __future__ import print_function

import os
import re
import tensorflow as tf

from keras import backend as K
K.set_learning_phase(0)

from keras.models import Model
from keras.layers import Input

from models.YOLOv2 import YOLOv2
from models.preprocess import yolov2_preprocess_func
from models.custom_layers import ImageResizer
from cfg import *

from tensorflow.python.saved_model import signature_constants
from tensorflow.python.client import session
from tensorflow.python.framework import graph_util
from tensorflow.core.protobuf import rewriter_config_pb2
from tensorflow.tools.graph_transforms import TransformGraph


import argparse


def _main_():
    # ###############
    # Parse Config  #
    # ###############
    args = parser.parse_args()
    WEIGHTS   = args.weights
    IOU       = args.iou
    THRESHOLD = args.threshold
    EXPORT_PATH = args.output
    VERSION     = args.version
    if not os.path.isfile(WEIGHTS):
        raise IOError("Weight file is invalid")

    anchors, class_names = config_prediction()

    # Interference Pipeline for object detection Model

    # Inputs--->Resized---> Preprocessor--->Feature Extractor--> Object Detector---> Prediction ---> PostProcessor

    with K.get_session() as sess:

        # #################
        # Construct Graph #
        # #################
        yolov2 = YOLOv2(anchors, N_CLASSES, yolov2_preprocess_func)

        inputs                 = Input(shape=(None, None, 3), name='image_input')
        resized_inputs         = ImageResizer(IMG_INPUT_SIZE, name="ImageResizer")(inputs)

        prediction             = yolov2.predict(resized_inputs)
        boxes, classes, scores = yolov2.post_process(prediction, iou_threshold=IOU, score_threshold=THRESHOLD)

        model = Model(inputs=inputs, outputs=[boxes, classes, scores])
        model.load_weights(WEIGHTS)
        model.summary()

        # ########################
        # Configure output Tensors
        # #######################

        postprocessed_tensors = {
            'detection_boxes':   model.output[0],
            'detection_classes': model.output[1],
            'detection_scores':  model.output[2],
        }
        outputs = _add_output_tensor_nodes(postprocessed_tensors, 'interference_op')
        output_node_names = ','.join(outputs.keys())

        # ###############################
        # Freeze the model into pb format
        # ###############################
        from tensorflow.python.framework import graph_io

        frozen_graph_def = graph_util.convert_variables_to_constants(
                                     sess,
                                     sess.graph.as_graph_def(),
                                     output_node_names.split(','))

        # f = 'only_the_graph_def.pb.ascii'
        # tf.train.write_graph(sess.graph.as_graph_def(), './', f, as_text=True)
        # graph_io.write_graph(frozen_graph_def, './', 'frozen_graph.pb', as_text=False)

        transforms = ["add_default_attributes",
                      "quantize_weights", "round_weights",
                      "fold_batch_norms", "fold_old_batch_norms"]

        quantized_graph = TransformGraph(frozen_graph_def,
                                         inputs="image_input",
                                         outputs=output_node_names.split(','),
                                         transforms=transforms)
        graph_io.write_graph(quantized_graph, './', 'frozen_graph.pb', as_text=False)

    # #####################
    # Export to TF Serving#
    # #####################
    export_path = os.path.join(EXPORT_PATH, VERSION)

    with tf.Graph().as_default():
        tf.import_graph_def(quantized_graph, name='')

        # Optimizing graph
        rewrite_options = rewriter_config_pb2.RewriterConfig(optimize_tensor_layout=True)
        rewrite_options.optimizers.append('pruning')
        rewrite_options.optimizers.append('constfold')
        rewrite_options.optimizers.append('layout')
        graph_options = tf.GraphOptions(rewrite_options=rewrite_options, infer_shapes=True)

        config = tf.ConfigProto(graph_options=graph_options)
        with session.Session(config=config) as sess:

            builder = tf.saved_model.builder.SavedModelBuilder(export_path)

            tensor_info_inputs = {
                'inputs': tf.saved_model.utils.build_tensor_info(inputs)}
            tensor_info_outputs = {}
            for k, v in outputs.items():
                tensor_info_outputs[k] = tf.saved_model.utils.build_tensor_info(v)

            detection_signature = (
                    tf.saved_model.signature_def_utils.build_signature_def(
                            inputs     = tensor_info_inputs,
                            outputs    = tensor_info_outputs,
                            method_name= signature_constants.PREDICT_METHOD_NAME))

            builder.add_meta_graph_and_variables(
                    sess, [tf.saved_model.tag_constants.SERVING],
                    signature_def_map={
                        'predict_images': detection_signature,
                        signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY:
                            detection_signature,
                    },
            )
            builder.save()


def _add_output_tensor_nodes(postprocessed_tensors,
                             output_collection_name='inference_op'):
  """
  Reference: https://github.com/tensorflow/models/tree/master/research/object_detection

  Adds output nodes for detection boxes and scores.

  Args:
    postprocessed_tensors: a dictionary containing the following fields
      'detection_boxes': [batch, max_detections, 4]
      'detection_scores': [batch, max_detections]
      'detection_classes': [batch, max_detections]

    output_collection_name: Name of collection to add output tensors to.

  Returns:
    A tensor dict containing the added output tensor nodes.
  """
  boxes   = postprocessed_tensors.get('detection_boxes')
  scores  = postprocessed_tensors.get('detection_scores')
  classes = postprocessed_tensors.get('detection_classes')

  outputs = dict()
  outputs['detection_boxes']   = tf.identity(boxes, name='detection_boxes')
  outputs['detection_scores']  = tf.identity(scores, name='detection_scores')
  outputs['detection_classes'] = tf.identity(classes, name='detection_classes')

  for output_key in outputs:
    tf.add_to_collection(output_collection_name, outputs[output_key])

  return outputs


def config_prediction():
    # Config Anchors
    anchors = []
    with open(ANCHORS, 'r') as f:
        data = f.read().splitlines()
        for line in data:
            numbers = re.findall('\d+.\d+', line)
            anchors.append((float(numbers[0]), float(numbers[1])))
    # Load class names
    with open(CATEGORIES, mode='r') as txt_file:
        class_names = [c.strip() for c in txt_file.readlines()]
    return anchors, class_names


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Export Keras Model to TensorFlow Serving")

    parser.add_argument('-o', '--output',
                        help="Export path", type=str, default='/tmp/yolov2')

    parser.add_argument('-v', '--version',
                        help="Model Version", type=str, default='1')

    parser.add_argument('-w', '--weights',
                        help="Path to pre-trained weight files", type=str, default='coco_yolov2.weights')

    parser.add_argument('-i', '--iou',
                        help="IoU value for Non-max suppression", type=float, default=0.5)

    parser.add_argument('-t', '--threshold',
                        help="Threshold value to display box", type=float, default=0.6)

    _main_()
