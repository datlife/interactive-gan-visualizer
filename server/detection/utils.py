import sys
import re
import json
import base64
import cStringIO

import numpy as np
from PIL import Image


def make_detection_request(image_base64, detector):
	# Decode string into np.array
	image = re.sub('^data:image/.+;base64,', '', image_base64).decode('base64')
	image = Image.open(cStringIO.StringIO(image)).convert('RGB')
	image = np.array(image)
	h, w, _ = image.shape
	boxes, classes, scores = detector.predict(image, img_dtype=np.uint8) 
	filtered_outputs = [(box, idx, score) for box, idx, score in zip(boxes, classes, scores)
								if score > 0.5]
	if zip(*filtered_outputs):
		boxes, classes, scores = zip(*filtered_outputs)
		boxes = [box * np.array([h, w, h, w]) for box in boxes]
	else:  # no detection
		boxes, classes, scores = [], [], []
		
	# Due to the fixed size of canvas in front-end. (400, 400) is fixed
	rects = covert_to_fabric_rect(boxes, scores, classes)
	return rects

def _debug_mask(bboxes):
	mask = np.zeros((400, 400), np.uint8)
	print(bboxes)
	try:
		for i, box in enumerate(bboxes):
			b = json.loads(json.dumps(box))
			top, left, width, height = int(b['top']), int(
					b['left']), int(b['width']), int(b['height'])
			mask[top:top+height, left:left+width] = 255 - 122*i
	except:
		pass
	output = cStringIO.StringIO()
	img_mask = Image.fromarray(mask)
	img_mask.save(output, format='JPEG')
	data_url = base64.b64encode(output.getvalue())
	return data_url

def covert_to_fabric_rect(boxes, scores, classes):
	rects = []
	for box, score, category in zip(boxes, scores, classes):
		y1, x1, y2, x2 = [int(i) for i in box]
		rect = {
			'top':    y1,
			'left':   x1,
			'width':  x2 - x1,
			'height': y2 - y1,
			'class': category,
			'probabilities': score
		}
		rects.append(rect)
	return rects


def parse_label_map(label_map_path):
	"""Parse label map file into a dictionary
	Args:
	  label_map_path:

	Returns:
	  a dictionary : key: obj_id value: obj-name
	"""
	# match any group having language of {id:[number] .. name:'name'}
	parser = re.compile(r'id:[^\d]*(?P<id>[0-9]+)\s+name:[^\']*\'(?P<name>[\w_-]+)\'')

	with open(label_map_path, 'r') as f:
		lines = f.read().splitlines()
		lines = ''.join(lines)

		# a tuple (id, name)
		result = parser.findall(lines)
		label_map_dict = {int(item[0]): item[1] for item in result}
		return label_map_dict