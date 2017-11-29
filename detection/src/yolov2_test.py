import argparse
import os
import re
import cv2

import numpy as np
import tensorflow as tf
import keras.backend as K

from models.YOLOv2 import YOLOv2, yolov2_preprocess_func
from models.custom_layers import ImageResizer
from webcam_demo import draw
from utils.map_idx_to_label import map_idx_to_labels

from cfg import ANCHORS, IMG_INPUT_SIZE, N_CLASSES, CATEGORIES

parser = argparse.ArgumentParser("Over-fit model to validate loss function")

parser.add_argument('-p', '--path',
                    help="Path to image file", type=str, default='./assets/example.jpg')

parser.add_argument('-w', '--weights',
                    help="Path to pre-trained weight files", type=str, default='./assets/coco_yolov2.weights')

parser.add_argument('-o', '--output-path',
                    help="Save image to output directory", type=str, default=None)

parser.add_argument('-i', '--iou',
                    help="IoU value for Non-max suppression", type=float, default=0.5)

parser.add_argument('-t', '--threshold',
                    help="Threshold value to display box", type=float, default=0.6)


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
    image = cv2.cvtColor(cv2.imread(IMG_PATH), cv2.COLOR_BGR2RGB)
    height, width, _ = image.shape

    with tf.Session() as sess:
        from keras.models import Model
        from keras.layers import Input

        # #################
        # Construct Graph #
        # #################
        yolov2 = YOLOv2(anchors, N_CLASSES, yolov2_preprocess_func)

        inputs                 = Input(shape=(None, None, 3), name='image_input', dtype=tf.uint8)
        resized_inputs         = ImageResizer(IMG_INPUT_SIZE, name="ImageResizer")(inputs)

        prediction             = yolov2.predict(resized_inputs)
        boxes, classes, scores = yolov2.post_process(prediction, iou_threshold=IOU, score_threshold=THRESHOLD)

        model = Model(inputs=inputs, outputs=[boxes, classes, scores])
        model.load_weights(WEIGHTS)

        model.summary()

        # ######################################
        # Run a session to make one prediction #
        # ######################################
        pred_bboxes, pred_classes, pred_scores = sess.run([boxes, classes, scores],
                                                          feed_dict={
                                                              K.learning_phase(): 0,
                                                              inputs: np.expand_dims(image, axis=0),
                                                          })

        # #################
        # Display Result  #
        # #################
        label_dict = map_idx_to_labels(CATEGORIES)

        h, w, _ =  image.shape
        if OUTPUT is not None:
            result = draw(image, (w, h),label_dict, pred_bboxes, pred_classes, pred_scores)
            cv2.imwrite(os.path.join(OUTPUT, IMG_PATH.split('/')[-1].split('.')[0] + '_result.jpg'), result)


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
    return np.array(anchors), class_names


if __name__ == "__main__":
    _main_()
    print("Done!")
