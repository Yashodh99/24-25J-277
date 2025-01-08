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

# Load models
animal_model = tf.keras.models.load_model(
    'models/animal.h5',
    custom_objects={'KerasLayer': hub.KerasLayer}
)

with open('models/w_model.dat', 'rb') as f:
    w_model = pickle.load(f)

#added motion data set
with open('models/motion_model.dat', 'rb') as f:
    motion_model = pickle.load(f)