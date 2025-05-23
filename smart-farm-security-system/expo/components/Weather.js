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

          <Text style={styles.labelText}>Temperature (°C):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.temperature}
              onChangeText={(temperature) => this.setState({ temperature })}
              placeholder={'Temperature'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <Text style={styles.labelText}>Rain (mm):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.rain}
              onChangeText={(rain) => this.setState({ rain })}
              placeholder={'Rain'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <Text style={styles.labelText}>Windspeed (km/h):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.windspeed}
              onChangeText={(windspeed) => this.setState({ windspeed })}
              placeholder={'Windspeed'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <Text style={styles.labelText}>Humidity (%):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.humidity}
              onChangeText={(humidity) => this.setState({ humidity })}
              placeholder={'Humidity'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <Text style={styles.labelText}>Soil Moisture (%):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.soilMoisture}
              onChangeText={(soilMoisture) => this.setState({ soilMoisture })}
              placeholder={'Soil Moisture'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <View style={styles.center}>
            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={this.onInsert}>
              {!this.state.loader ? (
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Submit</Text>
              ) : null}
              {this.state.loader ? (
                <ActivityIndicator size="large" color={"#ffffff"} />
              ) : null}
            </TouchableOpacity>
          </View>

          {this.state.result == true ? (
            <View style={styles.center}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.resultTxt}</Text>
            </View>
          ) : null}

          <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#AEDEF4"
            onCancelPressed={() => {
              this.hideAlert();
            }}
          />

        </View>
      </ScrollView>
    );
  }
};

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
  pickerContainer: {
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#c4c4c4',
    color: '#000000',
  },
  picker: {
    width: '100%',
    height: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 45,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: '#1875bb',
  },
});
