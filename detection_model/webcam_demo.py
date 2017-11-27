import cv2
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from Queue import Queue
from collections import deque
from threading import Thread

from utils.webcam import WebcamVideoStream, FPS
from utils.map_idx_to_label import map_idx_to_labels, map_idx
from client import ObjectDetectionServer
from cfg import CATEGORIES

detection_model = 'ssd'
detector = ObjectDetectionServer(server='localhost:9000', detection_model=detection_model)


def _main_():

    video_capture = WebcamVideoStream(src=0).start()
    fps = FPS().start()

    if detection_model is 'yolov2':
        label_dict = map_idx_to_labels(CATEGORIES)
    else:
        label_dict = map_idx('./assets/coco_ssd.txt')
        print(label_dict)

    width = 640
    height = 480

    input_q  = Queue(10)
    output_q = deque(maxlen=5)

    for i in range(1):
        t = Thread(target=worker, args=(input_q, output_q))
        t.daemon = True
        t.start()

    while True:
        frame = video_capture.read()
        input_q.put(frame)
        if len(output_q):
            data = output_q.popleft()
            boxes, classes, scores = filter_out(threshold=0.5, data=data)
            frame = draw(frame, (width, height), label_dict, boxes, classes, scores)
            output_q.clear()

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
    global detector
    fps = FPS().start()
    while True:
        fps.update()
        frame = input_q.get()
        output_q.append(detector.predict(frame))
    fps.stop()


def draw(img, img_shape, label_dict, bboxes, classes, scores):
    """
    Drawing Bounding Box on Image
    :param img:
    :param boxes:
    :return:
    """
    width, height = img_shape
    stretch = width / float(height)
    image = Image.fromarray(img)
    font = ImageFont.truetype(
        font='./assets/FiraMono-Medium.otf',
        size=np.floor(3e-2 * image.size[1] + 0.4).astype('int32'))

    thickness = (image.size[0] + image.size[1]) // 300
    draw = ImageDraw.Draw(image)

    for box, category, score in zip(bboxes, classes, scores):
        name = label_dict[int(category)]
        box = box * np.array([width*(1/stretch), height*stretch, width*(1/stretch), height*stretch])
        y1, x1, y2, x2 = [int(i) for i in box]

        p1 = (x1, y1)
        p2 = (x2, y2)

        label       = '{} {:.2f} %   '.format(name, score * 100)
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