"""
Main application
"""
import os
import sys
import signal  # to caught Ctrl+C
import json
import optparse

from flask import Flask
from flask import jsonify, request, Response, render_template

from detection.client import ObjectDetectionClient
from detection.server import ObjectDetectionServer
from detection.detector import detect_objects


app       = Flask(__name__, template_folder='dist', static_folder='dist')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/detect/', methods=["POST"])
def detect():
    global detector
    data = json.dumps(request.form.to_dict())
    data = json.loads(data)

    try:
        detections    = detect_objects(data['image'], detector)
    except Exception as e:
        print(e)
        return Response(jsonify({'msg': 'TensorFlow Serving not available'}), status=503)

    response = jsonify(detections)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/debug/', methods=["GET"])
def update_debug():
    data = None

    data_url = _debug_mask(data)
    response = jsonify(data_url)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def _debug_mask(bboxes):
    import base64
    import numpy as np
    from cStringIO import StringIO
    from PIL import Image

    mask = np.zeros((400, 400), np.uint8)
    img_mask = Image.fromarray(mask)
    output = StringIO()
    img_mask.save(output, format='JPEG')

    data_url = base64.b64encode(output.getvalue())
    return data_url


def clean_up(signum, frame):
    global ml_server
    # restore the original signal handler as otherwise evil things will happen
    signal.signal(signal.SIGINT, original_sigint)
    print("Serving is shutting down")
    ml_server.stop()

    sys.exit(1)


if __name__ == "__main__":
    # ##########################
    # APP CONFIGURATIONS
    # ##########################

    parser = optparse.OptionParser()
    parser.add_option("-m", "--model", default='ssd', help="Detection model [default ssd]")
    parser.add_option("-H", "--host", default="127.0.0.1", help="Hostname of the Flask app [default 127.0.0.1")
    parser.add_option("-P", "--port", default="5000", help="Port for the Flask app [default 5000]")
    args, _ = parser.parse_args()

    # ##########################
    # LAUNCH TF SERVING SERVER
    # ##########################
    model_path = os.path.join(sys.path[0], 'detection/serving_models/%s' % args.model)
    if not os.path.isdir(model_path):
        raise IOError('Model is not supported yet. We only support yolov2, fasterrcnn, ssd')
    ml_server = ObjectDetectionServer(args.model, model_path, port=9000)

    original_sigint = signal.getsignal(signal.SIGINT)
    signal.signal(signal.SIGINT, clean_up)

    # ##############
    # START WEB APP
    # ##############
    detector = ObjectDetectionClient('localhost:9000', args.model)
    ml_server.start()
    app.run(debug=True, host=args.host, port=int(args.port), use_reloader=False)


