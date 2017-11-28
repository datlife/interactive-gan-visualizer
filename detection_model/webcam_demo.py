import cv2
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from threading import Thread
from multiprocessing import Queue, Pool

from utils.webcam import WebcamVideoStream, FPS
from utils.map_idx_to_label import map_idx_to_labels, map_idx
from client import ObjectDetectionServer
from cfg import CATEGORIES

detection_model = 'ssd'
detector = ObjectDetectionServer(server='localhost:9000', detection_model=detection_model)

if detection_model is 'yolov2':
    label_dict = map_idx_to_labels(CATEGORIES)
else:
    label_dict = map_idx('./assets/coco_ssd.txt')

def _main_():

    width  = 300
    height = 300

    video_capture = WebcamVideoStream(0).start()
    fps = FPS().start()

    input_q  = Queue(maxsize=5)
    output_q = Queue(maxsize=5)
    pool     = Pool(2, worker, (input_q, output_q))

    while True:
        frame = video_capture.read()
        frame = cv2.resize(frame, (300, 300)) 
        input_q.put(frame)
        
        frame = output_q.get()
        cv2.imshow('Video', frame)
        fps.update()
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    fps.stop()
    video_capture.stop()
    cv2.destroyAllWindows()
    print('[INFO] elapsed time (total): {:.2f}'.format(fps.elapsed()))
    print('[INFO] approx. FPS: {:.2f}'.format(fps.fps()))


def worker(input_q, output_q):
    fps = FPS().start()
    while True:
        fps.update()
        frame = input_q.get()
        output_q.put(detect_objects_in(frame))
    fps.stop()

import time
def detect_objects_in(frame):
    global detector
    global label_dict
    
    predict = time.time()
    data = detector.predict(frame)

    # boxes, classes, scores = filter_out(threshold=0.5, data=data)
    boxes, classes, scores = data
    classes = [label_dict[int(c)] for c in classes]
    
    drawing = time.time()
    frame = draw(frame, boxes, classes, scores)
    print("Prediction in {} || Drawing in {}".format(time.time()-predict, time.time()-drawing))
    return frame

def draw(img, bboxes, classes, scores):
    """
    Drawing Bounding Box on Image
    :param img:
    :param boxes:
    :return:
    """
    height, width, _ = img.shape
    stretch = width / float(height)
    image = Image.fromarray(img)
    font = ImageFont.truetype(
        font='./assets/FiraMono-Medium.otf',
        size=np.floor(3e-2 * image.size[1] + 0.4).astype('int32'))

    thickness = (image.size[0] + image.size[1]) // 300
    draw = ImageDraw.Draw(image)

    for box, category, score in zip(bboxes, classes, scores):
        box = box * np.array([width*(1/stretch), height*stretch, width*(1/stretch), height*stretch])
        y1, x1, y2, x2 = [int(i) for i in box]

        p1 = (x1, y1)
        p2 = (x2, y2)

        label       = '{} {:.2f} %   '.format(category, score * 100)
        label_size  = draw.textsize(label)
        text_origin = np.array([p1[0], p1[1] + 1])

        color       = np.array([0, 255, 0])
        for i in range(thickness):
            draw.rectangle([p1[0] + i, p1[1] + i, p2[0] - i, p2[1] - i], outline=tuple(color))

        draw.rectangle([tuple(text_origin), tuple(text_origin + label_size)], fill=tuple(color))
        draw.text(tuple(text_origin), label, fill=(0, 0, 0), label_size=2, font=font)

    del draw
    return np.array(image)


def filter_out(threshold, data):
    boxes, classes, scores = data

    new_boxes =[]
    new_classes = []
    new_scores =[]
    for b,c,s in zip(boxes, classes, scores):
        if s > threshold:
            new_boxes.append(b)
            new_classes.append(c)
            new_scores.append(s)

    return new_boxes, new_classes, new_scores

if __name__ == "__main__":
    _main_()
