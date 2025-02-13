import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

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
            x1: '1', x2: '2', x3: '3', x4: '4', x5: '5',
            x6: '6', x7: '7', x8: '8', x9: '9', x10: '10',
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            axios.get("http://192.168.4.1/data")
                .then(res => {
                    this.setState({
                        distanceValue: res.data.distanceValue,
                        loader: false,
                    });

                    // simulate sending to motion model — WRONG: should use POST, local IP assumed
                    axios.get("http://localhost:5000/motion", {
                        params: {
                            x1: this.state.x1,
                            x2: this.state.x2,
                            x3: this.state.x3,
                            x4: this.state.x4,
                            x5: this.state.x5,
                            x6: this.state.x6,
                            x7: this.state.x7,
                            x8: this.state.x8,
                            x9: this.state.x9,
                            x10: this.state.x10,
                        }
                    }).then(pred => {
                        console.log("Predicted:", pred.data.res);
                        this.setState({ resultTxt: pred.data.res });
                    }).catch(err => {
                        console.log("Prediction error:", err.message);
                    });
                });
        }, 2000);
    }

    render() {
        return (
            <View>
                <Text>Result: {this.state.resultTxt}</Text>
                <Text>Distance: {this.state.distanceValue}</Text>
            </View>
        );
    }
}
