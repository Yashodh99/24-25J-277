import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import ESP32IP from "./ESP32IP";
import store from './GlobalStore';

export default class AnimalA extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false,
            message: '',
            showAlert: false,
            title: '',
            resultTxt: '',
            distanceValue: '',
            vibrationValue: '',
            buzzer: '0',
            weatherCondition: store.weatherCondition || 'Loading...',
            x1: null,
            x2: null,
            x3: null,
            x4: null,
            x5: null,
            x6: null,
            x7: null,
            x8: null,
            x9: null,
            x10: null,
        };
    }

    static navigationOptions = () => ({
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
        store.subscribe(this.handleWeatherChange);

        this.setState({ loader: true });

        this.interval = setInterval(async () => {
            const url = "http://" + ESP32IP + "/data";

            try {
                const res = await axios.get(url, {
                    headers: { "Content-Type": "application/json" },
                    timeout: 20000
                });

                const vib = parseFloat(res.data.vibrationValue);
                let adjustedVibration = vib;

                // Weather-based adjustment
                const { weatherCondition } = this.state;
                if (weatherCondition === "Dry") adjustedVibration = vib * 0.99;
                else if (weatherCondition === "Wet") adjustedVibration = vib * 1.01;

                adjustedVibration = Number(adjustedVibration); // ensure it's a number
                this.setState({ distanceValue: res.data.distanceValue + "" });

                // Fill next available x1 - x10
                for (let i = 1; i <= 10; i++) {
                    if (this.state[`x${i}`] === null) {
                        this.setState({ [`x${i}`]: adjustedVibration });
                        break;
                    }
                }

                // If all values are filled, send for prediction
                if (this.state.x10 !== null) {
                    const motionUrl = "http://" + LocalIP + ":2222/motion";
                    const data = {
                        x1: this.state.x1, x2: this.state.x2, x3: this.state.x3,
                        x4: this.state.x4, x5: this.state.x5, x6: this.state.x6,
                        x7: this.state.x7, x8: this.state.x8, x9: this.state.x9,
                        x10: this.state.x10
                    };

                    try {
                        const motionRes = await axios.post(motionUrl, data, {
                            headers: { "Content-Type": "application/json" }
                        });

                        this.setState({
                            resultTxt: "Detected Animal: " + motionRes.data.res,
                            loader: false
                        });
                    } catch (motionErr) {
                        console.log("Motion Error:", motionErr.response ? motionErr.response.data : motionErr.message);
                    }
                }
            } catch (error) {
                console.log("ESP32 Error:", error.response ? error.response.data : error.message);
                this.setState({
                    loader: false,
                    title: "Fetch Error",
                    message: "Failed to fetch data from ESP32",
                    showAlert: true
                });
            }
        }, 2000);
    };

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
        store.unsubscribe(this.handleWeatherChange);
    }

    handleWeatherChange = (newCondition) => {
        this.setState({ weatherCondition: newCondition });
    };

    hideAlert = () => {
        this.setState({ showAlert: false, message: "", title: "" });
    };

    render() {
        const { showAlert, resultTxt, distanceValue, weatherCondition, loader } = this.state;

        return (
            <View style={styles.container}>
                <Image
                    source={require('./../assets/logo2.jpg')}
                    style={{ width: 200, height: 200, marginBottom: 40, borderRadius: 100 }}
                />

                <View style={styles.center}>
                    {!loader && (
                        <>
                            <Text style={styles.resultText}>
                                {resultTxt || "Collecting sensor data..."}
                            </Text>
                            {distanceValue && (
                                <Text style={styles.resultText}>Distance: {distanceValue}</Text>
                            )}
                            <Text style={styles.resultText}>Weather: {weatherCondition}</Text>
                        </>
                    )}

                    {loader && <ActivityIndicator size="large" color={"#000000"} />}
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
        alignItems: 'center',
    },
    resultText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 5,
    },
});