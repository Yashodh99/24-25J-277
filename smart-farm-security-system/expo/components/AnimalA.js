import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default class AnimalA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            message: '',
            showAlert: false,
            title: '',
            resultTxt: '',
            distanceValue: '',
            vibrationValue: '',
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch("http://192.168.4.1/data")
                .then(res => res.json())
                .then(data => {
                    console.log("Fetched:", data);
                    this.setState({
                        distanceValue: data.distanceValue,
                        vibrationValue: data.vibrationValue,
                        loader: false
                    });
                });
        }, 2000);
    }

    render() {
        return (
            <View>
                {this.state.loader ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Text>Animal Detection Page</Text>
                        <Text>Distance: {this.state.distanceValue}</Text>
                        <Text>Vibration: {this.state.vibrationValue}</Text>
                    </>
                )}
            </View>
        );
    }
}
