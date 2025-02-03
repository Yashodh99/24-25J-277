import React from 'react';
import { View, Text } from 'react-native';

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
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch("http://192.168.4.1/data")
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        distanceValue: data.distanceValue,
                        vibrationValue: data.vibrationValue // no history yet
                    });
                });
        }, 2000);
    }

    render() {
        return (
            <View>
                <Text>Animal Detection Page</Text>
                <Text>Distance: {this.state.distanceValue}</Text>
                <Text>Vibration: {this.state.vibrationValue}</Text>
            </View>
        );
    }
}
