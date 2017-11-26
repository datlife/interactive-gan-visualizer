import argparse
import os
import re
import cv2

from cfg import ANCHORS, IMG_INPUT_SIZE, FEATURE_EXTRACTOR, N_CLASSES, CATEGORIES

parser = argparse.ArgumentParser("Over-fit model to validate loss function")

parser.add_argument('-p', '--path',
                    help="Path to image file", type=str, default='example.jpg')

parser.add_argument('-w', '--weights',
                    help="Path to pre-trained weight files", type=str, default='coco_yolov2.weights')

parser.add_argument('-o', '--output-path',
                    help="Save image to output directory", type=str, default=None)

parser.add_argument('-i', '--iou',
                    help="IoU value for Non-max suppression", type=float, default=0.5)

parser.add_argument('-t', '--threshold',
                    help="Threshold value to display box", type=float, default=0.6)


import numpy as np
import tensorflow as tf
import keras.backend as K
from models.YOLOv2 import YOLOv2
from models.FeatureExtractor import FeatureExtractor

from utils.draw_boxes import DrawingBox
from utils.visualize import draw_bboxes


def _main_():
    # ###############
    # Parse Config  #
    # ###############
    args = parser.parse_args()
    IMG_PATH  = args.path
    WEIGHTS   = args.weights
    OUTPUT    = args.output_path
    IOU       = args.iou
    THRESHOLD = args.threshold

    anchors, class_names = config_prediction()

    with tf.Session() as sess:

        # #################
        # Construct Graph #
        # #################
        darknet = FeatureExtractor(is_training=False, img_size=IMG_INPUT_SIZE, model=FEATURE_EXTRACTOR)
        yolo = YOLOv2(
            is_training=False,
            num_classes      = N_CLASSES,
            img_size         = IMG_INPUT_SIZE,
            anchors          = np.array(anchors),
            feature_extractor= darknet,
            detector         = FEATURE_EXTRACTOR)

        yolov2 = yolo.model
        yolov2.load_weights(WEIGHTS)

        # #####################
        # Process Image Input #
        # #####################
        image = cv2.cvtColor(cv2.imread(IMG_PATH), cv2.COLOR_BGR2RGB)
        height, width, _ = image.shape

        # #################
        # Make Prediction #
        # #################
        prediction             = yolov2.output
        boxes, classes, scores = yolo.post_process(prediction,
                                                   iou_threshold  = IOU,
                                                   score_threshold= THRESHOLD)

        # #################
        # Start a session #
        # #################
        pred_bboxes, pred_classes, pred_scores = sess.run([boxes, classes, scores],
                                                          feed_dict={
                                                              K.learning_phase(): 0,
                                                              yolov2.input: np.expand_dims(image, axis=0),
                                                          })
        # #################
        # Display Result  #
        # #################
        bboxes = []
        for box, cls, score in zip(pred_bboxes, pred_classes, pred_scores):
            # Scale boxes back to original image shape.
            box = box * np.array([height, width, height, width])
            y1, x1, y2, x2 = box

            bboxes.append(DrawingBox(x1, y1, x2, y2, class_names[cls], score))
            print("Found {} with {:2.1f}% on {}".format(class_names[cls], score*100, IMG_PATH.split('/')[-1]))

        # Save image to evaluation dir
        if OUTPUT is not None:
            result = draw_bboxes(image, bboxes)
            result.save(os.path.join(OUTPUT, IMG_PATH.split('/')[-1].split('.')[0] + '_result.jpg'))


def config_prediction():
    # Config Anchors
    anchors = []
    with open(ANCHORS, 'r') as f:
        data = f.read().splitlines()
        for line in data:
            numbers = re.findall('\d+.\d+', line)
            anchors.append((float(numbers[0]), float(numbers[1])))
    # Load class names
    with open(CATEGORIES, mode='r') as txt_file:
        class_names = [c.strip() for c in txt_file.readlines()]
    return anchors, class_names


if __name__ == "__main__":
    _main_()
    print("Done!")
