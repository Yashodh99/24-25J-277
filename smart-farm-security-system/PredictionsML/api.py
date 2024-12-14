from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import pickle
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
model = load_model("animal_prediction_model.keras")
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array([[data["Frequency"], data["Amplitude"], data["Duration"], data["Hour"]]])
        features_scaled = scaler.transform(features)
        features_reshaped = features_scaled.reshape((1, 1, 4))
        prediction = model.predict(features_reshaped)
        animal_idx = np.argmax(prediction)
        animal = le.inverse_transform([animal_idx])[0]
        confidence = float(prediction[0][animal_idx]) * 100  # Convert to percentage
        
        # Generate a timestamp for the next day at the same hour
        now = datetime.now(timezone.utc)
        next_day = now + timedelta(days=1)
        next_day_hour = next_day.replace(hour=data["Hour"] % 24, minute=0, second=0, microsecond=0)
        timestamp = next_day_hour.isoformat() + "Z"
        
        return jsonify({
            "animal": animal,
            "timestamp": timestamp,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)