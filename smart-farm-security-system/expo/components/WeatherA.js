import React from 'react';
import { ActivityIndicator, TextInput, View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import ESP32IP from "./ESP32IP";

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
          <MaterialCommunityIcons name="menu" color='#ffffff' size={30} />
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
      vibration: '', // Added vibration state
      message: '',
      resultTxt: '',
      result: false,
      showAlert: false,
      title: '',
      latitude: '',
      longitude: '',
      actualvibration:'',
      loader: false,
    };
  }

  componentDidMount() {
    this.requestLocationPermission();
    this.fetchSensorData(); // Renamed to fetchSensorData for clarity
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    const apiKey = 'dd622b9622486c70fdaa0f2543e09cbb';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      const rainValue = data.rain && (data.rain["1h"] || data.rain["3h"]) ? 
                    (data.rain["1h"] || data.rain["3h"]) : 
                    "0";
      await this.setState({ humidity: data.main.humidity, temperature: data.main.temp, windspeed: data.wind.speed, rain: rainValue.toString() });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  fetchSensorData = async () => {
    this.setState({ loader: true });
    this.interval = setInterval(async () => {
      const url = "http://" + ESP32IP + "/data";
      try {
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
          timeout: 20000,
        });
        console.log(response.data);
        this.setState({
          loader: false,
          soilMoisture: response.data.soilMoistureValue + "",
          vibration: response.data.vibrationValue + "", 
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        this.setState({ loader: false });
      }
    }, 2000);
  };

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: '',
    });
  };

  onInsert = async (e) => {
    if (this.state.temperature !== "") {
      if (this.state.rain !== "") {
        if (this.state.windspeed !== "") {
          if (this.state.humidity !== "") {
            if (this.state.soilMoisture !== "") {
              if (this.state.vibration !== "") { 
                this.setState({ loader: true });
                const url = "http://" + LocalIP + ":2222/weather";
                const data = JSON.stringify({
                  temperature: this.state.temperature,
                  rain: this.state.rain,
                  windspeed: this.state.windspeed,
                  humidity: this.state.humidity,
                  soilMoisture: this.state.soilMoisture,
                  vibration: this.state.vibration, 
                });
                await axios.post(url, data, {
                  headers: { "Content-Type": "application/json" },
                }).then(async (res) => {
                  let weatherCondition = "";
                  if (res.data.res >= 0 && res.data.res < 50) {
                    weatherCondition = "Dry";
                  }  else if (res.data.res >= 50 && res.data.res < 60) {
                    weatherCondition = "Normal";
                  } else if (res.data.res >= 60 && res.data.res < 70) {
                    weatherCondition = "Wet";
                  } else {
                    weatherCondition = "Unidentified";
                  }
                  let actualVibration;
                const vibration = parseFloat(this.state.vibration); 
                if (weatherCondition === "Dry") {
                  actualVibration = vibration * 0.99;
                } else if (weatherCondition === "Normal") {
                  actualVibration = vibration * 1;
                } else if (weatherCondition === "Wet") {
                  actualVibration = vibration * 1.01;
                } else {
                  actualVibration = vibration; 
                }
                  this.setState({
                    loader: false,
                    result: true,
                    resultTxt: `Weather Condition: ${weatherCondition}`,
                    actualvibration: `Actual Vibration:${actualVibration}`
                    
                  });
                  console.log(res.data);
                });
              } else {
                this.setState({ title: "Error!", message: "Vibration data is not available!" });
                this.showAlert();
              }
            } else {
              this.setState({ title: "Error!", message: "Soil Moisture data is not available!" });
              this.showAlert();
            }
          } else {
            this.setState({ title: "Error!", message: "Please enter Humidity!" });
            this.showAlert();
          }
        } else {
          this.setState({ title: "Error!", message: "Please enter Windspeed!" });
          this.showAlert();
        }
      } else {
        this.setState({ title: "Error!", message: "Please enter Rain!" });
        this.showAlert();
      }
    } else {
      this.setState({ title: "Error!", message: "Please enter Temperature!" });
      this.showAlert();
    }
  };