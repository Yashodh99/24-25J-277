import React from 'react';
import { ActivityIndicator, TextInput, View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Weather_Code extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Weather Code (M)',
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
      message: '',
      resultTxt: '',
      result: false,
      showAlert: false,
      title: '',
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: ''
    });
  };

  onInsert = async (e) => {
      if (this.state.temperature != "") {
        if (this.state.rain != "") {
          if (this.state.windspeed != "") {
            if (this.state.humidity != "") {
              if (this.state.soilMoisture != "") {
                this.setState({ loader: true });
                const url = "http://" + LocalIP + ":2222/weather";
                const data = JSON.stringify({ 
                  temperature: this.state.temperature, 
                  rain: this.state.rain, 
                  windspeed: this.state.windspeed, 
                  humidity: this.state.humidity, 
                  soilMoisture: this.state.soilMoisture 
                });
                await axios.post(url, data, {
                  headers: { "Content-Type": "application/json" }
                }).then(async (res) => {
                  this.setState({ loader: false, result: true ,resultTxt:"Weather Code : "+res.data.res});
                  console.log(res.data);
                });
              } else {
                this.setState({ title: "Error!", message: "Please enter Soil Moisture!" });
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
  }

