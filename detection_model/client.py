from __future__ import print_function
from __future__ import absolute_import

# Communication to TensorFlow server via gRPC
from grpc.beta import implementations

import tensorflow as tf
import numpy as np
from PIL import Image

# TensorFlow serving stuff to send messages
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2

# Command line arguments
tf.app.flags.DEFINE_string('server', 'localhost:9000', 'PredictionService host:port')
tf.app.flags.DEFINE_string('image', '', 'path to image in JPEG format')
FLAGS = tf.app.flags.FLAGS


def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.float32)


def main(_):
    host, port = FLAGS.server.split(':')

    channel = implementations.insecure_channel(host, int(port))
    stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)

    # Send request
    request = predict_pb2.PredictRequest()
    try:
        image = Image.open(FLAGS.image)
    except Exception as e:
        print(e)
        print("Cannot load image")
    image_np = load_image_into_numpy_array(image)
    image_np_expanded = np.expand_dims(image_np, axis=0)

    request.model_spec.name = 'yolov2'
    request.model_spec.signature_name = 'predict_images'
    request.inputs['inputs'].CopyFrom(tf.contrib.util.make_tensor_proto(image_np_expanded))

    result = stub.Predict(request, 60.0)  # 60 secs timeout
    print(result)


if __name__ == '__main__':
    tf.app.run()
