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
  