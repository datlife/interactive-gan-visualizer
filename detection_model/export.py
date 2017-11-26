"""
Export trained Model in Keras into TF Serving
"""
from __future__ import print_function
from keras import backend as K
K.set_learning_phase(0)

import tensorflow as tf
from tensorflow.python.saved_model import signature_constants
from tensorflow.python.client import session
from tensorflow.python import pywrap_tensorflow
from tensorflow.python.framework import graph_util
from tensorflow.core.protobuf import rewriter_config_pb2
from tensorflow.python.training import saver as saver_lib

import os
import re
import numpy as np


from models.YOLOv2 import YOLOv2
from models.FeatureExtractor import FeatureExtractor
from cfg import ANCHORS, IMG_INPUT_SIZE, FEATURE_EXTRACTOR, N_CLASSES, CATEGORIES

import argparse
parser = argparse.ArgumentParser("Export Keras Model to TensorFlow Serving")

parser.add_argument('-w', '--weights',
                    help="Path to pre-trained weight files", type=str, default='coco_yolov2.weights')

parser.add_argument('-i', '--iou',
                    help="IoU value for Non-max suppression", type=float, default=0.5)

parser.add_argument('-t', '--threshold',
                    help="Threshold value to display box", type=float, default=0.6)


def _main_():
    # ###############
    # Parse Config  #
    # ###############
    args = parser.parse_args()
    WEIGHTS   = args.weights
    IOU       = args.iou
    THRESHOLD = args.threshold

    if not os.path.isfile(WEIGHTS):
        raise IOError("Weight file is invalid")

    anchors, class_names = config_prediction()

    # #################
    # Construct Graph #
    # #################
    darknet = FeatureExtractor(is_training=False, img_size=IMG_INPUT_SIZE, model=FEATURE_EXTRACTOR)
    yolo = YOLOv2(
        is_training = False,
        num_classes = N_CLASSES,
        img_size    = IMG_INPUT_SIZE,
        anchors     = np.array(anchors),
        feature_extractor=darknet,
        detector    = FEATURE_EXTRACTOR)

    model = yolo.model

    # TODO: add lambda func -- yayy!
    boxes, classes, scores = yolo.post_process(model.output,
                                               iou_threshold=IOU,
                                               score_threshold=THRESHOLD)
    from keras.models import Model
    new_model = Model(inputs=model.input, outputs=[boxes, classes, scores])
    new_model.load_weights(WEIGHTS)

    new_model.save('test.h5')
    K.clear_session()

    with tf.Session() as sess:
        K.set_learning_phase(0)

        from keras.models import load_model
        from models.FeatureExtractor import Preprocessor
        from models.YOLOv2 import PostProcessor
        model = load_model('test.h5', custom_objects={'Preprocessor': Preprocessor,
                                                      'PostProcessor': PostProcessor})

        model.summary()

        # ########################
        # Configure output Tensors
        # #######################
        postprocessed_tensors = {
            'detection_boxes': model.output[0],
            'detection_classes': model.output[1],
            'detection_scores': model.output[2],
        }
        outputs = _add_output_tensor_nodes(postprocessed_tensors, 'interference_op')
        output_node_names = ','.join(outputs.keys())

        # #####################
        # Freeze the model
        # #####################
        from tensorflow.python.framework import graph_util

        frozen_graph_def = graph_util.convert_variables_to_constants(sess,
                                                                     sess.graph.as_default(),
                                                                     output_node_names)

    # # #####################
    # # Export to TF Serving#
    # # #####################
    # export_path = "frozen_graph/1"
    # with tf.Graph().as_default():
    #     with session.Session() as sess:
    #
    #         tf.import_graph_def(frozen_graph_def, name='')
    #         builder = tf.saved_model.builder.SavedModelBuilder(export_path)
    #         a = tf.get_default_graph().as_graph_def().node
    #         # print(a)
    #         tensor_info_inputs = {'inputs': tf.saved_model.utils.build_tensor_info(a)}
    #         tensor_info_outputs = {}
    #         for k, v in outputs.items():
    #             tensor_info_outputs[k] = tf.saved_model.utils.build_tensor_info(v)
    #
    #         detection_signature = (
    #             tf.saved_model.signature_def_utils.build_signature_def(
    #                 inputs=tensor_info_inputs,
    #                 outputs=tensor_info_outputs,
    #                 method_name=signature_constants.PREDICT_METHOD_NAME))
    #
    #         builder.add_meta_graph_and_variables(sess,
    #                                              [tf.saved_model.tag_constants.SERVING],
    #                                              signature_def_map={
    #                                                  signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY:
    #                                                      detection_signature,
    #                                              })
    #         builder.save()


def _add_output_tensor_nodes(postprocessed_tensors,
                             output_collection_name='inference_op'):
  """Adds output nodes for detection boxes and scores.

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


def freeze_graph_with_def_protos(
    input_graph_def,
    input_saver_def,
    input_checkpoint,
    output_node_names,
    restore_op_name,
    filename_tensor_name,
    clear_devices,
    initializer_nodes,
    optimize_graph=True,
    variable_names_blacklist=''):
  """Converts all variables in a graph and checkpoint into constants."""
  del restore_op_name, filename_tensor_name  # Unused by updated loading code.

  # 'input_checkpoint' may be a prefix if we're using Saver V2 format
  if not saver_lib.checkpoint_exists(input_checkpoint):
    raise ValueError(
        'Input checkpoint "' + input_checkpoint + '" does not exist!')

  # Remove all the explicit device specifications for this node. This helps to
  if clear_devices:
    for node in input_graph_def.node:
      node.device = ''

  with tf.Graph().as_default():
    tf.import_graph_def(input_graph_def, name='')

    if optimize_graph:
      rewrite_options = rewriter_config_pb2.RewriterConfig(
          optimize_tensor_layout=True)
      rewrite_options.optimizers.append('pruning')
      rewrite_options.optimizers.append('constfold')
      rewrite_options.optimizers.append('layout')
      graph_options = tf.GraphOptions(
          rewrite_options=rewrite_options, infer_shapes=True)
    else:
      graph_options = tf.GraphOptions()
    config = tf.ConfigProto(graph_options=graph_options)
    with session.Session(config=config) as sess:
      if input_saver_def:
        saver = saver_lib.Saver(saver_def=input_saver_def)
        saver.restore(sess, input_checkpoint)
      else:
        var_list = {}
        reader = pywrap_tensorflow.NewCheckpointReader(input_checkpoint)
        var_to_shape_map = reader.get_variable_to_shape_map()
        for key in var_to_shape_map:
          try:
            tensor = sess.graph.get_tensor_by_name(key + ':0')
          except KeyError:
            # This tensor doesn't exist in the graph (for example it's
            # 'global_step' or a similar housekeeping element) so skip it.
            continue
          var_list[key] = tensor
        saver = saver_lib.Saver(var_list=var_list)
        saver.restore(sess, input_checkpoint)
        if initializer_nodes:
          sess.run(initializer_nodes)

      variable_names_blacklist = (variable_names_blacklist.split(',') if
                                  variable_names_blacklist else None)
      output_graph_def = graph_util.convert_variables_to_constants(
          sess,
          input_graph_def,
          output_node_names.split(','),
          variable_names_blacklist=variable_names_blacklist)

  return output_graph_def


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
    _main_()
