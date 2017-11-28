import re
import cStringIO

import numpy as np
from PIL import Image
from detection_model.client import ObjectDetectionServer

detection_model = 'ssd'
detector = ObjectDetectionServer(server='localhost:9000', detection_model=detection_model)


def detect_objects_in(image_base64):
    global detector

    # Format image
    image = re.sub('^data:image/.+;base64,', '', image_base64).decode('base64')
    image = Image.open(cStringIO.StringIO(image))
    image = np.asarray(image.resize((400, 400)))

    data = detector.predict(image)

    # boxes, classes, scores = filter_out(threshold=0.5, data=data)
    boxes, classes, scores = data

    rects = covert_to_fabric_rect(image.shape, boxes, scores, classes)

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
