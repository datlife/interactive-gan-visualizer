import cv2
import time
import numpy as np
import tensorflow as tf

from multiprocessing import Queue, Pool
from PIL import Image, ImageDraw, ImageFont

from client import ObjectDetectionClient
from detection.src.utils.label_map import get_labels
from detection.src.utils.webcam import WebcamVideoStream

# Command line arguments
tf.app.flags.DEFINE_string('server', 'localhost:9000', 'PredictionService host:port')
tf.app.flags.DEFINE_string('model', 'ssd', 'tf serving model (yolov2, ssd, fasterrcnn')
FLAGS = tf.app.flags.FLAGS

model = FLAGS.model
detector = ObjectDetectionClient('localhost:9000', model, get_labels(model))


def main(_):
    video_capture = WebcamVideoStream(0).start()

    input_q = Queue(maxsize=3)
    output_q = Queue(maxsize=1)
    pool = Pool(1, worker, (input_q, output_q))

    boxes   = []
    classes = []
    scores  = []

    num_frames       = 0
    detection_fps    = 0
    detection_frames = 0

    start = time.time()
    while True:
        frame = video_capture.read()

        if input_q.full():
            input_q.get()

        input_q.put(frame)

        if not output_q.empty():
            boxes, classes, scores = output_q.get()
            detection_frames += 1
            detection_fps = detection_frames / (time.time() - start)

        num_frames += 1
        camera_fps = num_frames / (time.time() - start)

        cv2.imshow('Video', draw(frame, boxes, classes, scores, camera_fps, detection_fps))

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    elapsed = (time.time() - start)
    print('[INFO] elapsed time (total): {:.2f}'.format(elapsed))
    print('[INFO] approx. FPS: {:.2f}'.format(num_frames / elapsed))
    print('[INFO] approx. detection FPS: {:.2f}'.format(detection_frames / elapsed))
    video_capture.stop()
    cv2.destroyAllWindows()


def worker(input_q, output_q):
    while True:
        frame = input_q.get()
        output_q.put(detect_objects_in(frame))


def detect_objects_in(frame):
    global detector
    data = detector.predict(frame)
    boxes, classes, scores = filter_out(threshold=0.5, data=data)
    return boxes, classes, scores


def draw(img, bboxes, classes, scores, fps, detection_fps):
    """
        Drawing Bounding Box on Image

    :param img:
    :param bboxes:
    :param classes:
    :param scores:
    :param fps:
    :param detection_fps:
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
        box = box * np.array([width * (1 / stretch), height * stretch, width * (1 / stretch), height * stretch])
        y1, x1, y2, x2 = [int(i) for i in box]
        p1 = (x1, y1)
        p2 = (x2, y2)
        label = '{} {:.2f} %   '.format(category, score * 100)
        label_size = draw.textsize(label)
        text_origin = np.array([p1[0], p1[1] + 1])

        color = np.array([0, 255, 0])
        for i in range(thickness):
            draw.rectangle([p1[0] + i, p1[1] + i, p2[0] - i, p2[1] - i], outline=tuple(color))

        draw.rectangle([tuple(text_origin), tuple(text_origin + label_size)], fill=tuple(color))
        draw.text(tuple(text_origin), label, fill=(0, 0, 0), label_size=2, font=font)

    draw.text((10, height - 20), "Camera FPS: {:.2f} fps".format(fps), fill=(0, 255, 0), label_size=3, font=font)
    draw.text((width - 200, height - 20), "Detection FPS: {:.2f} fps".format(detection_fps), fill=(0, 255, 0),
              label_size=3, font=font)
    del draw
    return np.array(image)


def filter_out(threshold, data):
    boxes, classes, scores = data
    new_boxes = []
    new_classes = []
    new_scores = []
    for b, c, s in zip(boxes, classes, scores):
        if s > threshold:
            new_boxes.append(b)
            new_classes.append(c)
            new_scores.append(s)
    return new_boxes, new_classes, new_scores


if __name__ == "__main__":
    tf.app.run()
