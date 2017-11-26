import tensorflow as tf
from keras.layers import Input
from keras.models import Model
from keras import layers

from darknet19 import darknet19, yolo_preprocess_input

MODEL_ZOO    = {'yolov2':    darknet19}
preprocessor = {'yolov2':    yolo_preprocess_input}


class FeatureExtractor(object):
    def __init__(self,
                 is_training,
                 img_size,
                 model='yolov2'):
        self._is_training   = is_training
        self.name           = model
        self.img_size       = img_size
        self.preprocess_fn  = preprocessor[model]

        # Build a new model
        if model not in MODEL_ZOO:
            raise ValueError("Model is not available in zoo.")

        self.model = self._construct_feature_extractor(model)

    def _construct_feature_extractor(self, model):
        """
        Build a Feature Extractor with Preprocessing Function embedded as a Layer
        :param model:
        :return:
        """
        # A hack to force keras model to accept preprocessing func as a layer.
        inputs = Input(shape=(None, None, 3))
        x      = Preprocessor(self.img_size, self.preprocess_fn)(inputs)
        x      = MODEL_ZOO[model](x)

        return Model(inputs=inputs, outputs=x)


class Preprocessor(layers.Layer):
    def __init__(self, img_size, processor_func, **kwargs):
        self.img_size        = img_size
        self.preprocess_func = processor_func
        super(Preprocessor, self).__init__(**kwargs)

    def build(self, input_shape):
        super(Preprocessor, self).build(input_shape)

    def call(self, inputs, **kwargs):
        x = tf.image.resize_images(inputs, size=(self.img_size, self.img_size))
        x = self.preprocess_func(x)

        return x

    def compute_output_shape(self, input_shape):
        input_shape = list(input_shape)
        input_shape[1] = self.img_size
        input_shape[2] = self.img_size

        return tuple(input_shape)
