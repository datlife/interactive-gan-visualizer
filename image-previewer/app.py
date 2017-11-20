import sys, path
from flask import Flask, render_template
from models import load_model

app = Flask(__name__)

MODEL = './assest/car_detection.mb'

@app.route('/')
def load_main_page():
    return render_template('./index.html')

@app.route('/predict')
def predict():
    # If car detection is enabled

    # else

    return 0.0

@app.route('/generate')
def generate_img():
    """
    Use gan to create a new image
    """
    # If car is not selected:
    # raise Error() and pass alert

    # else
    # generate new image
    return 0.0

if __name__ == "-__main__":
    app.run(host="localhost", host="8080", debug=True)
