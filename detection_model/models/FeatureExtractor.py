from keras.models import Model
from .darknet19 import darknet19, yolo_preprocess_input
from .custom_layers import Preprocessor

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

        # Build a new model
        if model not in MODEL_ZOO:
            raise ValueError("Model is not available in zoo.")
        self.preprocess_fn = preprocessor[model]
        self.extractor = MODEL_ZOO[model]
        self.model = None

    def extract_features(self, inputs):

        preprocessed_inputs               = Preprocessor(self.img_size, self.preprocess_fn)(inputs)
        feature_map, fined_grained_layer = self.extractor(preprocessed_inputs)

        return feature_map, fined_grained_layer


