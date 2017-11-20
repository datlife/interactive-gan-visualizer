from darknet19 import darknet19, yolo_preprocess_input

MODEL_ZOO    = {'yolov2':    darknet19}
preprocessor = {'yolov2':    yolo_preprocess_input}


class FeatureExtractor(object):
    def __init__(self,
                 is_training,
                 img_size,
                 model='yolov2'):
        self.name           = model
        self._is_training   = is_training
        self.img_size       = img_size
        self._preprocess_fn = preprocessor[model]
        self.model          = self._get_feature_extractor_from_zoo(model)

    def _get_feature_extractor_from_zoo(self, model):
        """
        """
        global MODEL_ZOO

        if model not in MODEL_ZOO:
            raise ValueError("Model is not available in zoo.")
        else:
            return MODEL_ZOO[model](include_top=False)

    def preprocess(self, resized_inputs):
        return self._preprocess_fn(resized_inputs)

    def extract_features(self, preprocessed_inputs):
        pass