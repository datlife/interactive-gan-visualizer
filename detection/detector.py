import sys
import re
import cStringIO

import numpy as np
from PIL import Image


def detect_objects(image_base64, detector):
    # Format image
    image = re.sub('^data:image/.+;base64,', '', image_base64).decode('base64')
    image = np.asarray(Image.open(cStringIO.StringIO(image)))

    data = detector.predict(image) 
    boxes, classes, scores = filter_out(threshold=0.5, data=data)

    # Due to the fixed size of canvas in front-end. (400, 400) is fixed
    rects = covert_to_fabric_rect((400, 400, 3), boxes, scores, classes)
    return rects


def covert_to_fabric_rect(img_shape, boxes, scores, classes):
    width, height, _ = img_shape
    stretch = width / float(height)
    rects = []
    for box, score, category in zip(boxes, scores, classes):
        box = box * np.array([width*(1/stretch), height*stretch, width*(1/stretch), height*stretch])
        y1, x1, y2, x2 = [int(i) for i in box]
        rect = {
            'top':    y1,
            'left':   x1,
            'width':  x2 - x1,
            'height': y2 - y1,
            'class': category,
            'probabilities': score
        }
        rects.append(rect)
    return rects


def filter_out(threshold, data):
    boxes, classes, scores = data
    new_boxes   = []
    new_classes = []
    new_scores  = []
    for b, c, s in zip(boxes, classes, scores):
        if s > threshold:
            new_boxes.append(b)
            new_classes.append(c)
            new_scores.append(s)
    return new_boxes, new_classes, new_scores

