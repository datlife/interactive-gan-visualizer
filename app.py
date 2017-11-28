"""
Main application
"""
import json
from flask import Flask
from flask import jsonify, request, Response

from detector import detect_objects
app    = Flask(__name__)


@app.route('/detect/', methods=["POST"])
def detect():
    data = json.dumps(request.form.to_dict())
    data = json.loads(data)

    try:
        detections    = detect_objects(data['image'])
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
if __name__ == "__main__":
    app.run(debug=True)
