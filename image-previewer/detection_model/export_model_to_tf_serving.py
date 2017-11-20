from models.YOLOv2 import YOLOv2
from models.FeatureExtractor import FeatureExtractor

from cfg import ANCHORS, IMG_INPUT_SIZE, N_CLASSES, CATEGORIES


def construct_graph():

    # #################
    # Construct Graph #
    # #################
    darknet = FeatureExtractor(is_training=False, img_size=None, model='yolov2')
    yolo = YOLOv2(num_classes=N_CLASSES,
                  anchors=np.array(anchors),
                  is_training=False,
                  feature_extractor=darknet,
                  detector='yolov2')

    return yolo