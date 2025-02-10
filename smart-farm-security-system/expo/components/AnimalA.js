import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

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
            x1: '',
            x2: '',
            x3: '',
            x4: '',
            x5: '',
            x6: '',
            x7: '',
            x8: '',
            x9: '',
            x10: '',
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch("http://192.168.4.1/data")
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        distanceValue: data.distanceValue,
                        loader: false,
                    });

                    // WRONG: No logic to check which slot is next — all get filled at once
                    this.setState({
                        x1: data.vibrationValue,
                        x2: data.vibrationValue,
                        x3: data.vibrationValue,
                        x4: data.vibrationValue,
                        x5: data.vibrationValue,
                        x6: data.vibrationValue,
                        x7: data.vibrationValue,
                        x8: data.vibrationValue,
                        x9: data.vibrationValue,
                        x10: data.vibrationValue,
                    });
                });
        }, 2000);
    }

    render() {
        return (
            <View>
                <Text>Distance: {this.state.distanceValue}</Text>
                <Text>Vibration X1: {this.state.x1}</Text>
                <AwesomeAlert
                    show={this.state.showAlert}
                    title={this.state.title}
                    message={this.state.message}
                    closeOnTouchOutside={true}
                    showCancelButton={true}
                    cancelText="OK"
                    onCancelPressed={() => this.setState({ showAlert: false })}
                />
            </View>
        );
    }
}
