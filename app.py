"""
Main application
"""
import re
import json
import urllib2
import numpy as np 
from PIL import Image
from flask import Flask, jsonify, request

from detection_model.client import ObjectDetectionServer

app      = Flask(__name__)
detector = ObjectDetectionServer(server="locahost:9000", detection_model="ssd")

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/detect/', methods=["POST"])
def predict():
    data = json.dumps(request.form.to_dict())
    data = json.loads(data)
    image_url = data["image"]
    image_id  = data["id"]

    # Read blob into array
    result = read_blob(image_url)
    print(type(result))
    # image = np.array(Image.open())
    # print(image.shape)
    response = jsonify({'some': 'data'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

    # Format image
    # bboxes, scores, classes = detector.predict(image)

    # # Convert index into true label
    # classes = [labels_map[idx] for idx in classes]

    # # TODO: Only need car objects -- filter out everything else

    # # Convert detections into Fabric Rect Object for rendering
    # rects = format_detetections(image.shape, bboxes, scores, classes)

    # return jsonify(rects)


def format_detetections(img_shape, bboxes, scores, classes):

    width, height, _ = img_shape 
    stretch = width / float(height)
    Rects = []
    for box, score, category in zip(bboxes, scores, classes):
        box = box * np.array([width*(1/stretch), height*stretch, width*(1/stretch), height*stretch])
        y1, x1, y2, x2 = [int(i) for i in box]
        rect = {
            top:  y1,        left: x1,
            width: y2 - y1, height: x2 - x1,
            hasBorder: true,
            stroke: 'yellow',
            strokeWidth: 3,
            fill:'transparent'
        }
        Rects.append(rect)

    return Rects

def read_blob(image_url):
    # fake user agent of safari
    url = re.search(r'blob:(.*)', image_url.encode('utf-8'))
    url = url.group(1)
    fake_useragent = 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25'
    r = urllib2.Request(url, headers={'User-Agent': fake_useragent})
    f = urllib2.urlopen(r)
    return f.read()

if __name__ == "__main__":
    app.run(debug=True)
    print("Server is started")