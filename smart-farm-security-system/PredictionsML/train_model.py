import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, LSTM, Dense, Dropout
from tensorflow.keras.utils import to_categorical
import pickle

print("Loading datasets...")
wild_boar = pd.read_csv("wild_boar_2020.csv")
wild_boar["Animal_Category"] = "Wild Boar"
deer = pd.read_csv("deer_2019.csv")
deer["Animal_Category"] = "Deer"
elephant = pd.read_csv("elephant_2022.csv")
elephant["Animal_Category"] = "Elephant"

df = pd.concat([wild_boar, deer, elephant], ignore_index=True)
print("Datasets combined. Total rows:", len(df))

print("Preparing data...")
features = ["Frequency", "Amplitude", "Duration"]
df["Hour"] = pd.to_datetime(df["Timestamp"]).dt.hour
X = df[features + ["Hour"]].values
y = df["Animal_Category"].values

le = LabelEncoder()
y_encoded = le.fit_transform(y)
y_onehot = to_categorical(y_encoded)
print("Labels encoded. Classes:", le.classes_)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
print("Features scaled and reshaped.")

X_train, X_test, y_train, y_test = train_test_split(X_reshaped, y_onehot, test_size=0.2, random_state=42)
print("Data split. Training samples:", len(X_train), "Test samples:", len(X_test))

model = Sequential()
model.add(Input(shape=(1, X_scaled.shape[1])))
model.add(LSTM(128, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(64))
model.add(Dropout(0.2))
model.add(Dense(32, activation="relu"))
model.add(Dense(3, activation="softmax"))

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
print("Model compiled.")

print("Training model... This may take a few minutes.")
history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=1)

loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy * 100:.2f}%")

model.save("animal_prediction_model.keras")  # Save as .keras
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)
print("Model and preprocessing objects saved.")

sample = np.array([[60, 30, 10, 18]])
sample_scaled = scaler.transform(sample)
sample_reshaped = sample_scaled.reshape((1, 1, 4))
pred = model.predict(sample_reshaped)
animal = le.inverse_transform([np.argmax(pred)])[0]
print("Predicted animal:", animal)