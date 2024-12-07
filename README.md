# Smart Farm Security System

The **Smart Farm Security System** is an innovative solution designed to enhance agricultural security using advanced technologies. This project focuses on preventing crop damage and improving farm management by integrating vibration sensors, machine learning, and real-time data analytics.

---

## Project Components

### 1. Vibration-Based Animal Detection and Identification  
**Author:** W.Y.M. Fernando (IT21276996)  
**Objective:**  
This component leverages vibration sensors to detect and identify animal movements, ensuring timely interventions.  

**Key Features:**  
- Detect animal presence using vibration patterns.  
- Classify animal species with machine learning models.  
- Measure animal distance from farm boundaries.  
- Send real-time alerts to farmers via a mobile app.  

**Technologies Used:**  
- **Hardware:** Raspberry Pi, Piezoelectric Vibration Sensors.  
- **Software:** Python, TensorFlow, PostgreSQL, SciPy.

---

### 2. Predictive Animal Movement Modeling and Early Warning System  
**Author:** C. S. Weerasinghe (IT21281082)  
**Objective:**  
This component predicts animal behavior using historical and real-time data to provide proactive warnings.  

**Key Features:**  
- Use RNN and LSTM models for accurate animal behavior predictions.  
- Combine historical and real-time vibration data.  
- Send timely alerts through Telegram bots (30 minutes in advance).  
- Integrate with farm management systems for comprehensive monitoring.  

**Technologies Used:**  
- **Machine Learning:** TensorFlow (RNN, LSTM).  
- **Database:** PostgreSQL.  
- **Notification Service:** Telegram Bot API.

---

### 3. Adaptive Sensitivity Calibration  
**Author:** T.L. Hapuarachci (IT21281846)  
**Objective:**  
Improve detection accuracy by dynamically adjusting sensor sensitivity based on environmental factors.  

**Key Features:**  
- Integrate environmental sensors like soil moisture and rain detectors.  
- Adjust sensor sensitivity in real-time using machine learning.  
- Reduce false positives from environmental noise.  
- Continuously refine models with a feedback loop.  

**Technologies Used:**  
- **Sensors:** Soil moisture and rain sensors.  
- **Machine Learning:** TensorFlow for calibration.  
- **Hardware:** Raspberry Pi.

---

### 4. Optimizing Deterrent Strategies Using Machine Learning
**Author:** T.D. Akmeemana (IT21282386)  
**Objective:**  
Develop intelligent systems to tailor animal deterrent strategies based on behavioral analysis.

#### Key Features:
- Use IoT sensors like geophones and acoustic devices for data collection.
- Predict animal behaviors using ML.
- Deploy species-specific deterrents.
- Minimize human-animal conflicts while reducing harm to non-target species.

#### Technologies Used:
- **Hardware:** IoT sensors (vibration, geophones, acoustic).
- **Software:** TensorFlow, Python.
- **Methodologies:** Reinforcement learning, adaptive algorithms.

---



## System Objectives

1. Detect and classify animal intrusions before they reach crop fields.
2. Predict animal movements to enable proactive measures.
3. Reduce false positives using adaptive sensor sensitivity.
4. Provide real-time notifications and an intuitive interface for farmers.

---

## Benefits

- **Enhanced Security:** Proactively prevent damage to crops and livestock.  
- **Cost Efficiency:** Minimize resource wastage through automation.  
- **Sustainability:** Reduce environmental impact by optimizing resources.  
- **Scalability:** Adaptable for farms of all sizes and varying environmental conditions.

---

## Future Enhancements

The Smart Farm Security System can expand into:
- Multi-modal detection using additional sensors (e.g., acoustic or visual).
- Advanced deterrence mechanisms tailored to specific animal behaviors.

---

**Contributors:**  
- **W.Y.M. Fernando:** Vibration-Based Animal Detection and Identification.  
- **C. S. Weerasinghe:** Predictive Animal Movement Modeling.  
- **T.L. Hapuarachci:** Adaptive Sensitivity Calibration.
- **T.D. Akmeemana:** Optimizing Deterrent Strategies Using Machine Learning.


**Institution:** Sri Lanka Institute of Information Technology (SLIIT).

---

