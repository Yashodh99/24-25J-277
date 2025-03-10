import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from "axios";
import LocalIP from "./localIPAddress";
import ESP32IP from "./ESP32IP";

export default class AnimalA extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false,
            message: '',
            showAlert: false,
            title: '',
            resultTxt: '',
            distanceValue: '',  // Added distanceValue to state
            vibrationValue: '',
            buzzer: '0',
            x1: 0,
            x2: 0,
            x3: 0,
            x4: 0,
            x5: 0,
            x6: 0,
            x7: 0,
            x8: 0,
            x9: 0,
            x10: 0,
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Animal Detect',
        headerStyle: {
            backgroundColor: '#1875bb',
            elevation: 0
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
        },
        headerLeft: false
    });

    componentDidMount = async () => {
        this.setState({ loader: true });
        this.interval = setInterval(async () => {
            const url = "http://" + ESP32IP + "/data";
            await axios.get(url, {
                headers: { "Content-Type": "application/json" },
                timeout: 20000
            }).then(async (res) => {
                console.log(res.data);
                // Update state with distanceValue on every fetch
                this.setState({ distanceValue: res.data.distanceValue + "" });

                // Fill vibration values sequentially
                if (this.state.x1 === 0) {
                    this.setState({ x1: res.data.vibrationValue + "" });
                } else if (this.state.x2 === 0) {
                    this.setState({ x2: res.data.vibrationValue + "" });
                } else if (this.state.x3 === 0) {
                    this.setState({ x3: res.data.vibrationValue + "" });
                } else if (this.state.x4 === 0) {
                    this.setState({ x4: res.data.vibrationValue + "" });
                } else if (this.state.x5 === 0) {
                    this.setState({ x5: res.data.vibrationValue + "" });
                } else if (this.state.x6 === 0) {
                    this.setState({ x6: res.data.vibrationValue + "" });
                } else if (this.state.x7 === 0) {
                    this.setState({ x7: res.data.vibrationValue + "" });
                } else if (this.state.x8 === 0) {
                    this.setState({ x8: res.data.vibrationValue + "" });
                } else if (this.state.x9 === 0) {
                    this.setState({ x9: res.data.vibrationValue + "" });
                } else if (this.state.x10 === 0) {
                    this.setState({
                        loader: false,
                        x10: res.data.vibrationValue + ""
                    });
                }

                // Once all vibration values are collected, make the motion prediction
                if (this.state.x10 !== 0) {
                    const url = "http://" + LocalIP + ":2222/motion";
                    const data = JSON.stringify({
                        x1: this.state.x1,
                        x2: this.state.x2,
                        x3: this.state.x3,
                        x4: this.state.x4,
                        x5: this.state.x5,
                        x6: this.state.x6,
                        x7: this.state.x7,
                        x8: this.state.x8,
                        x9: this.state.x9,
                        x10: this.state.x10
                    });
                    await axios.post(url, data, {
                        headers: { "Content-Type": "application/json" }
                    }).then(async (res) => {
                        this.setState({ resultTxt: "Detected Animal: " + res.data.res });
                        console.log(res.data);
                    }).catch((error) => {
                        console.log("Motion Error:", error.response ? error.response.data : error.message);
                    });
                }
            }).catch((error) => {
                console.log("ESP32 Error:", error.response ? error.response.data : error.message);
                this.setState({
                    loader: false,
                    title: "Fetch Error",
                    message: "Failed to fetch data from ESP32",
                    showAlert: true
                });
            });
        }, 2000);
    }

    componentWillUnmount() {
        // Clear the interval when the component unmounts to prevent memory leaks
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    hideAlert = () => {
        this.setState({ showAlert: false, message: "", title: "" });
    };

    render() {
        const { showAlert } = this.state;
        return (
            <View style={styles.container}>
                <Image source={require('./../assets/logo2.jpg')}
                    style={{ width: 200, height: 200, marginBottom: 40, borderRadius: 100 }} />

                <View style={styles.center}>
                    {!this.state.loader ? (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultText}>
                                {this.state.resultTxt} {this.state.distanceValue && `- Distance: ${this.state.distanceValue}`}
                            </Text>
                        </View>
                    ) : null}
                    {this.state.loader ? (
                        <ActivityIndicator size="large" color={"#000000"} />
                    ) : null}
                </View>

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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    center: {
        marginBottom: 20,
    },
    resultContainer: {
        flexDirection: 'row',  // Align text horizontally
        alignItems: 'center',
    },
    resultText: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
    dashboardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 30,
    },
    card: {
        width: '40%',
        height: 120,
        margin: 10,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});