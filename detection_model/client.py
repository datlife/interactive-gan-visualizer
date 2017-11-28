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

import time
# Command line arguments
tf.app.flags.DEFINE_string('server', 'localhost:9000', 'PredictionService host:port')
tf.app.flags.DEFINE_string('image', '', 'path to image in JPEG format')
FLAGS = tf.app.flags.FLAGS


class ObjectDetectionServer(object):

    def __init__(self, server, detection_model, verbose=False):
        self.host, self.port = server.split(':')
        self.model = detection_model
        self.verbose = verbose

        channel   = implementations.insecure_channel(self.host, int(self.port))
        self.stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)

    def predict(self, image):
        request = predict_pb2.PredictRequest()

        start = time.time()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = np.expand_dims(image, axis=0).astype(np.uint8)

        request.model_spec.name = self.model
        request.model_spec.signature_name = 'predict_images'
        request.inputs['inputs'].CopyFrom(tf.contrib.util.make_tensor_proto(image))

        pred  = time.time()
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

        if self.verbose:
            print("Server Prediction in {:.3f} sec || Total {:.3} sec".format(time.time() - pred, time.time() - start))

        return boxes, classes, scores


if __name__ == '__main__':
    import timeit
    setup = "from __main__ import ObjectDetectionServer, cv2"
    command = "ObjectDetectionServer('localhost:9000','ssd', verbose=True).predict(cv2.imread('./assets/example.jpg'))"
    print(timeit.timeit(command, setup=setup))
    # predict()
