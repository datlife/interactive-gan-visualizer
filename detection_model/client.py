from __future__ import print_function
from __future__ import absolute_import

# Communication to TensorFlow server via gRPC
from grpc.beta import implementations

import cv2
import numpy as np
import tensorflow as tf

# TensorFlow serving stuff to send messages
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2

# Command line arguments
tf.app.flags.DEFINE_string('server', 'localhost:9000', 'PredictionService host:port')
tf.app.flags.DEFINE_string('image', '', 'path to image in JPEG format')
FLAGS = tf.app.flags.FLAGS


class ObjectDetectionServer(object):

    def __init__(self, server, detection_model):
        self.host, self.port = server.split(':')
        self.model = detection_model

        channel = implementations.insecure_channel(self.host, int(self.port))
        self.stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)

    def predict(self, image):
        request = predict_pb2.PredictRequest()

        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_np_expanded = np.expand_dims(image, axis=0).astype(np.uint8)

        request.model_spec.name = self.model
        request.model_spec.signature_name = 'predict_images'
        request.inputs['inputs'].CopyFrom(tf.contrib.util.make_tensor_proto(image_np_expanded))

        result = self.stub.Predict(request, 60.0)  # 60 secs timeout

        if self.model == 'yolov2':
            num_detections = -1
        else:
            num_detections = int(result.outputs['num_detections'].float_val[0])

        classes = result.outputs['detection_classes'].float_val[:num_detections]
        scores = result.outputs['detection_scores'].float_val[:num_detections]
        boxes = result.outputs['detection_boxes'].float_val[:num_detections * 4]

        # split to evenly size of 4
        boxes = [boxes[i:i + 4] for i in range(0, len(boxes), 4)]

        # if self.model in ['ssd', 'fasterrcnn']:
        #     classes = [c - 1 for c in classes]

        return boxes, classes, scores


if __name__ == '__main__':
    import timeit
    setup = "from __main__ import predict_from"
    print(timeit.timeit("predict_from('localhost:9000','yolov2', './assets/example.jpg')", setup=setup))
    # predict()
