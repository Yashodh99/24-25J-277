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

    render() {
        return (
            <View>
                <Text>Animal Detection Page</Text>
            </View>
        );
    }
}
