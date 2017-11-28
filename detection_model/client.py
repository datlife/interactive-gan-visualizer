from __future__ import print_function
from __future__ import absolute_import

import time
import cv2
import numpy as np
import tensorflow as tf

# TensorFlow serving stuff to send messages
from grpc.beta import implementations
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2


class ObjectDetectionServer(object):

    def __init__(self, server, detection_model, verbose=False):
        self.host, self.port = server.split(':')
        self.model = detection_model
        self.verbose = verbose
        if detection_model is 'yolov2':
            self.label_dict = map_idx_to_labels('./assets/coco_categories.txt')
        else:
            self.label_dict = map_idx('./assets/coco_ssd.txt')

        channel   = implementations.insecure_channel(self.host, int(self.port))
        self.stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)

    def predict(self, image):
        request = predict_pb2.PredictRequest()

        start = time.time()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = np.expand_dims(image, axis=0).astype(np.uint8)

        request.model_spec.name           = self.model
        request.model_spec.signature_name = 'predict_images'
        request.inputs['inputs'].CopyFrom(tf.contrib.util.make_tensor_proto(image))

        pred  = time.time()
        result = self.stub.Predict(request, 10.0)  # 5 secs timeout

        if self.model == 'yolov2':
            num_detections = -1
        else:
            num_detections = int(result.outputs['num_detections'].float_val[0])

        classes = result.outputs['detection_classes'].float_val[:num_detections]
        scores  = result.outputs['detection_scores'].float_val[:num_detections]
        boxes   = result.outputs['detection_boxes'].float_val[:num_detections * 4]
        classes = [self.label_dict[idx] for idx in classes]
        # split to evenly size of 4
        boxes   = [boxes[i:i + 4] for i in range(0, len(boxes), 4)]
        # classes = [self.label_dict[idx] for idx in classes]

        if self.verbose:
            print("Server Prediction in {:.3f} sec || Total {:.3} sec".format(time.time() - pred, time.time() - start))

        return boxes, classes, scores


def map_idx_to_labels(categories_file):
    with open(categories_file, mode='r') as txt_file:
        class_names = [c.strip() for c in txt_file.readlines()]
    class_names = {v: k for v, k in enumerate(class_names)}
    return class_names


def map_idx(categories_file):
    with open(categories_file, mode='r') as txt_file:
        values = [c.strip() for c in txt_file.readlines()]
    class_names = dict()
    for s in values:
        id, key = s.split(':')
        class_names[int(id)] = key
    return class_names

if __name__ == '__main__':
    import timeit
    setup = "from __main__ import ObjectDetectionServer, cv2"
    command = "ObjectDetectionServer('localhost:9000','ssd', verbose=True).predict(cv2.imread('./assets/example.jpg'))"
    print(timeit.timeit(command, setup=setup))
