"""
Main application
"""
import os
import sys
import re
import signal  # to caught Ctrl+C
import json
import optparse

from flask import Flask
from flask import jsonify, request, Response, render_template

from server.tfserving import DetectionClient, DetectionServer
from server.utils import detect_objects, parse_label_map, _debug_mask

ZOO_ADDRESS = 'server/trained_models/%s'
DEFAULT_LABEL_MAP = 'server/assets/mscoco.pbtxt'
app = Flask(__name__, template_folder='dist', static_folder='dist')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/detect/', methods=["POST"])
def send_detection_request():
	global detector
	data = json.loads(json.dumps(request.form.to_dict()))
	try:
		detections = detect_objects(data['image'], detector)
	except Exception as e:
		print(e)
		return Response(jsonify({'msg': 'TensorFlow Serving not available'}), status=503)

	response = jsonify(detections)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response


@app.route('/debug/', methods=["POST"])
def update_debug():
	data_url = _debug_mask(json.loads(request.form.to_dict()['bboxes']))
	response = jsonify(data_url)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

def clean_up(signum, frame):
	global ml_server
	signal.signal(signal.SIGINT, original_sigint)
	print("Serving is shutting down")
	ml_server.stop()
	sys.exit(1)

if __name__ == "__main__":
	# ##########################
	# APP CONFIGURATIONS
	# ##########################
	parser = optparse.OptionParser()
	parser.add_option("-m", "--model", default='ssd',
										help="Detection model [default ssd]")
	parser.add_option("-H", "--host", default="127.0.0.1",
										help="Hostname of the Flask app [default 127.0.0.1")
	parser.add_option("-P", "--port", default="5000",
										help="Port for the Flask app [default 5000]")
	args, _ = parser.parse_args()

	ML_SERVER_PORT = 9000
	# ##########################
	# LAUNCH TF SERVING SERVER
	# ##########################
	model_path = os.path.join(sys.path[0], ZOO_ADDRESS % args.model)
	if not os.path.isdir(model_path):
		raise IOError(
			'Model is not supported yet. We only support yolov2, fasterrcnn, ssd')

	ml_server = DetectionServer(args.model, model_path, port=ML_SERVER_PORT)
	original_sigint = signal.getsignal(signal.SIGINT)
	signal.signal(signal.SIGINT, clean_up)

	# ##############
	# START WEB APP
	# ##############
	label_map  = parse_label_map(DEFAULT_LABEL_MAP)
	detector = DetectionClient('localhost:%s'%ML_SERVER_PORT, args.model,label_map)
	ml_server.start()
	app.run(debug=True, host=args.host, port=int(args.port), use_reloader=True)
