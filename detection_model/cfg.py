"""
Main configuration file for YOLOv2 detection model
"""

# Configuration for COCO dataset
IMG_INPUT_SIZE = 448
N_CLASSES = 80
N_ANCHORS = 5

# Map indices to actual label names - absolute path required
CATEGORIES = "coco_categories.txt"
ANCHORS    = "coco_anchors.txt"


# Type of Feature Extractor.
FEATURE_EXTRACTOR     = 'yolov2'

# Image resolution being reduced 2^5 = 32 times
SHRINK_FACTOR  = 32
