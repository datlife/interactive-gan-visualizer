import cv2
import time
import numpy as np
import tensorflow as tf

from collections import deque 
from multiprocessing import Queue, Pool

from PIL import Image, ImageDraw, ImageFont
from client import ObjectDetectionServer
from src.utils.label_map import get_labels
from src.utils.webcam import WebcamVideoStream, FPS

# Command line arguments
tf.app.flags.DEFINE_string('server', 'localhost:9000', 'PredictionService host:port')
tf.app.flags.DEFINE_string('model', 'ssd', 'tf serving model (yolov2, ssd, fasterrcnn')
FLAGS = tf.app.flags.FLAGS

model = FLAGS.model
detector = ObjectDetectionServer('localhost:9000', model, get_labels(model))

def main(_):
    video_capture = WebcamVideoStream(0).start()
    fps = FPS().start()

    input_q  = Queue(maxsize=5)
    output_q = Queue(maxsize=2)
    pool     = Pool(1, worker, (input_q, output_q))

    boxes   = []
    classes = []
    scores  = []
    while True:
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        frame = video_capture.read()

	if input_q.full():
	  input_q.get()
        input_q.put(frame)

        if not output_q.empty():
           boxes, classes, scores = output_q.get()

        frame = draw(frame, boxes, classes, scores)
        print("Running...", input_q.qsize())
        cv2.imshow('Video', frame)
        fps.update()

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


def detect_objects_in(frame):
    global detector

    predict = time.time()
    data = detector.predict(frame)
    print("Prediction in {}".format(time.time()-predict))
    # boxes, classes, scores = filter_out(threshold=0.5, data=data)
    boxes, classes, scores = data
    return boxes, classes, scores


def draw(img, bboxes, classes, scores):
    """
    Drawing Bounding Box on Image
    :param img:
    :param boxes:
    :return:
    """
    if not bboxes:
	return img
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
    new_boxes   = []
    new_classes = []
    new_scores  = []
    for b, c, s in zip(boxes, classes, scores):
        if s > threshold:
            new_boxes.append(b)
            new_classes.append(c)
            new_scores.append(s)
    return new_boxes, new_classes, new_scores

if __name__ == "__main__":
    tf.app.run()
