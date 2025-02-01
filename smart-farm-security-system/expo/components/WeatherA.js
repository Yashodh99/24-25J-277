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