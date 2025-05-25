import React from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from 'axios';
import LocalIP from './localIPAddress';
import AwesomeAlert from 'react-native-awesome-alerts';
import ESP32IP from "./ESP32IP";
import store from './GlobalStore';

export default class Weather_Code extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Weather Code (A)',
    headerStyle: {
      backgroundColor: '#1875bb',
      elevation: 0,
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
    },
    headerLeft: () => (
      <View style={{ marginLeft: 10, marginTop: 5 }}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <MaterialCommunityIcons name="menu" color="#ffffff" size={30} />
        </TouchableOpacity>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      temperature: '',
      rain: '',
      windspeed: '',
      humidity: '',
      soilMoisture: '',
      vibration: '',
      message: '',
      resultTxt: '',
      result: false,
      showAlert: false,
      title: '',
      latitude: '',
      longitude: '',
      actualvibration: '',
      lastUpdated: null,
      manualRain: null,
      latestCondition: 'Normal',
    };
    this.interval = null;
    this.sensorInterval = null;
  }

  componentDidMount() {
    this.requestLocationPermission();
    this.interval = setInterval(this.refreshWeatherAndInsert, 5000);
    this.sensorInterval = setInterval(this.fetchSensorData, 2000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
    if (this.sensorInterval) clearInterval(this.sensorInterval);
  }

  requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return this.setError("Location permission not granted.");
    }

    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      await this.fetchWeatherData();
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  fetchWeatherData = async () => {
    try {
      const { latitude, longitude } = this.state;
      if (!latitude || !longitude) return;

      const apiKey = 'dd622b9622486c70fdaa0f2543e09cbb';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      const response = await axios.get(url);
      const data = response.data;
      const rainValue = data.rain && (data.rain["1h"] || data.rain["3h"]) ? (data.rain["1h"] || data.rain["3h"]) : "0";

      this.setState(prevState => ({
        humidity: data.main.humidity.toString(),
        temperature: data.main.temp.toString(),
        windspeed: data.wind.speed.toString(),
        rain: prevState.manualRain !== null ? prevState.manualRain : rainValue.toString()
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  fetchSensorData = async () => {
    const url = "http://" + ESP32IP + "/data";

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });

      const vibrationRaw = response.data.vibrationValue + "";
      const vibration = parseFloat(vibrationRaw);
      const soilMoisture = response.data.soilMoistureValue + "";

      this.setState({
        soilMoisture,
        vibration: vibrationRaw
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  refreshWeatherAndInsert = async () => {
    await this.fetchWeatherData();
    this.onInsert();
  };

  showAlert = () => {
    this.setState({ showAlert: true });
  };

  hideAlert = () => {
    this.setState({ showAlert: false, message: '', title: '' });
  };

  onInsert = async () => {
    const {
      temperature, windspeed, humidity, soilMoisture,
      vibration, rain, manualRain
    } = this.state;

    if (!temperature || !rain || !windspeed || !humidity || !soilMoisture || !vibration) {
      return this.setError("Missing data. Ensure all fields are available.");
    }

    const rainToUse = manualRain !== null ? manualRain : rain;

    const requestData = JSON.stringify({
      temperature,
      rain: rainToUse,
      windspeed,
      humidity,
      soilMoisture,
      vibration
    });

    try {
      const res = await axios.post(`http://${LocalIP}:2222/weather`, requestData, {
        headers: { "Content-Type": "application/json" }
      });

     
      if (res.data.res >= 0 && res.data.res <= 10) weatherCondition = "Dry";
      else if (res.data.res >= 11 && res.data.res <= 19) weatherCondition = "Normal";
      else if (res.data.res >= 20 && res.data.res <= 40) weatherCondition = "Wet";

      const vib = parseFloat(vibration);
      let actualVibration = 0;
      if (!isNaN(vib)) {
        if (weatherCondition === "Dry") actualVibration = vib * 0.99;
        else if (weatherCondition === "Normal") actualVibration = vib;
        else if (weatherCondition === "Wet") actualVibration = vib * 1.01;
      }

      this.setState({
        result: true,
        resultTxt: `Weather Condition: ${weatherCondition}`,
        actualvibration: `Actual Vibration: ${actualVibration.toFixed(2)}`,
        lastUpdated: new Date().toLocaleTimeString(),
        latestCondition: weatherCondition,
        manualRain: null // ✅ clear after using once
      });

      store.setWeatherCondition(weatherCondition);
    } catch (err) {
      console.error("Insert Error:", err);
      this.setError("Failed to submit data.");
    }
  };

  setError(message) {
    this.setState({ title: "Error!", message });
    this.showAlert();
  }

  renderInput(label, stateKey, readOnly = false, onManualOverride = false) {
    return (
      <>
        <Text style={styles.labelText}>{label}</Text>
        <View style={styles.center}>
          <TextInput
            value={this.state[stateKey].toString()}
            editable={!readOnly}
            onChangeText={(val) => {
              if (onManualOverride && stateKey === 'rain') {
                this.setState({ [stateKey]: val, manualRain: val });
              } else {
                this.setState({ [stateKey]: val });
              }
            }}
            placeholder={label}
            keyboardType='numeric'
            style={styles.input}
          />
        </View>
      </>
    );
  }

  render() {
    const { showAlert } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.center}>
            <Image
              source={require("./../assets/logo2.jpg")}
              style={{ width: 150, height: 150, marginBottom: 20, marginTop: 10, borderRadius: 100 }}
            />
          </View>

          {this.renderInput("Temperature (°C):", "temperature")}
          {this.renderInput("Rain (mm):", "rain", false, true)}
          {this.renderInput("Windspeed (km/h):", "windspeed")}
          {this.renderInput("Humidity (%):", "humidity")}
          {this.renderInput("Soil Moisture (%):", "soilMoisture", true)}
          {this.renderInput("Vibration:", "vibration", true)}

          {this.state.result && (
            <View style={styles.center}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.resultTxt}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.actualvibration}</Text>
              <Text style={{ fontStyle: 'italic', fontSize: 14, marginTop: 5 }}>
                Last Updated: {this.state.lastUpdated}
              </Text>
            </View>
          )}

          <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#AEDEF4"
            onCancelPressed={this.hideAlert}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    alignItems: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: '10%',
  },
  input: {
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
    borderBottomColor: '#c4c4c4',
    color: '#000000',
  },
});
