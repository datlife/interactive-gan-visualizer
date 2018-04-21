"""Main Flask application
"""
import os
import sys
import re
import signal 
import json
import optparse

from flask import Flask
from flask import jsonify, request, Response, render_template
from server.detection import DetectionClient, DetectionServer
from server.detection.utils import  make_detection_request, parse_label_map, _debug_mask

app = Flask(__name__)

@app.route('/detect/', methods=["POST"])
def detect_object():
  """Send images to Object detection server

  Returns:
    response - HTTP response with list of bounding boxes, probabilities
  """
  global detector
  data = json.loads(json.dumps(request.form.to_dict()))
  try:
    detection_result = make_detection_request(data['image'], detector)
  except Exception as e:
    print(e)
    return Response(jsonify({'msg': 'TensorFlow Serving not available'}), status=503)

  response = jsonify(detection_result)
  print(detection_result)
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response


@app.route('/debug/', methods=["POST"])
def update_debug():
  data_url = _debug_mask(json.loads(request.form.to_dict()['bboxes']))
  response = jsonify(data_url)
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

def clean_up(signum, frame):
  global detection_server
  signal.signal(signal.SIGINT, original_sigint)
  print("Serving is shutting down")
  detection_server.stop()
  sys.exit(1)

def parse_args():
  # ##########################
  # APP CONFIGURATIONS
  # ##########################
  parser = optparse.OptionParser()
  parser.add_option("-m", "--model", default='ssd', help="Detection model [default ssd]")
  parser.add_option("-H", "--host", default="127.0.0.1", help="Hostname of the Flask app [default 127.0.0.1")
  parser.add_option("-P", "--port", default="5000", help="Port for the Flask app [default 5000]")
  args, _ = parser.parse_args()

  ### DEFAULT ARGS
  args.ML_SERVER_PORT = 9000
  args.ZOO_PATH       = 'assets/trained_models/%s'
  args.DEFAULT_LABEL_MAP ='assets/mscoco.pbtxt'
  return args

if __name__ == "__main__":
  args = parse_args()
  # ##########################
  # LAUNCH TF SERVING SERVER
  # ##########################
  model_path = os.path.join(sys.path[0], args.ZOO_PATH % args.model)
  if not os.path.isdir(model_path):
    raise IOError(
      'Model is not supported yet. We only support yolov2, fasterrcnn, ssd')

  detection_server = DetectionServer(args.model, model_path, port= args.ML_SERVER_PORT)
  original_sigint = signal.getsignal(signal.SIGINT)
  signal.signal(signal.SIGINT, clean_up)

  # ##############
  # START WEB APP
  # ##############
  label_map  = parse_label_map(args.DEFAULT_LABEL_MAP)
  detector = DetectionClient(
    'localhost:%s'% args.ML_SERVER_PORT, args.model,label_map)
  detection_server.start()
  app.run(debug=True, host=args.host, port=int(args.port), use_reloader=True)
