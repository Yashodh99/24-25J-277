import json
import time
import os
import uuid
import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow.keras.preprocessing import image
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pickle
from tensorflow.keras.utils import custom_object_scope

with open('models/w_model.dat', 'rb') as f:
    w_model = pickle.load(f)

# Ensure temp directory exists
UPLOAD_FOLDER = "temp/"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__)
CORS(app)  # Enable CORS globally

@app.route('/weather', methods=['POST'])
def weather_predict():
    """Predict weather-related outcome."""
    try:
        request_data = request.get_json()
        if not request_data:
            return jsonify({"error": "No JSON data provided"}), 400

        temperature = float(request_data['temperature'])
        rain = float(request_data['rain'])
        windspeed = float(request_data['windspeed'])
        humidity = float(request_data['humidity'])
        soil_moisture = float(request_data['soilMoisture'])

        results = w_model.predict([[temperature, rain, windspeed, humidity, soil_moisture]])[0]
        return jsonify({"res": str(results), "success": True}), 200
    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}", "success": False}), 400
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500