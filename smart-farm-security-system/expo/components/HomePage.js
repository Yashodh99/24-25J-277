import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            showAlert: false,
            title: ''
        };

    }

    logout = async () => {
        AsyncStorage.clear();
        this.props.navigation.replace('Login')
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Dashboard',
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

    render() {
        const { showAlert } = this.state;
        return (
            <View style={styles.container}>
                <Image source={require('./../assets/logo2.jpg')}
                    style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 100 }} />

                <View style={styles.dashboardContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Weather')}>
                        <Icon name="cloud" size={40} color="#4CAF50" />
                        <Text style={styles.cardText}>Weather Code (M)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('WeatherA')}>
                        <Icon name="cloud-queue" size={40} color="#4CAF50" />
                        <Text style={styles.cardText}>Weather Code (A)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Animal')}>
                        <Icon name="adb" size={40} color="#FF5722" />
                        <Text style={styles.cardText}>Animal Detect(M)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('AnimalA')}>
                        <Icon name="adb" size={40} color="#3F51B5" />
                        <Text style={styles.cardText}>Animal Detect(A)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Vibration')}>
                        <Icon name="list-alt" size={40} color="#FF1125" />
                        <Text style={styles.cardText}>Vibration</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Prediction')}>
                        <Icon name="list" size={40} color="#3D2D25" />
                        <Text style={styles.cardText}>Predictions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('Device')}>
                        <Icon name="devices" size={40} color="#FFC107" />
                        <Text style={styles.cardText}>Devices Control</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={this.logout}>
                        <Icon name="logout" size={40} color="#F44336" />
                        <Text style={styles.cardText}>Logout</Text>
                    </TouchableOpacity>
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
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
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
    input: {
        borderBottomWidth: 1,
        width: 80 + '%',
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        borderBottomColor: '#c4c4c4',
        color: '#000000'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        width: 80 + '%',
        height: 40,
        borderRadius: 60
    },
    loginButton: {
        backgroundColor: "#1875bb",
    },
    registerButton: {
        backgroundColor: "#0e2025",
    },
    dashboardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: 40 + '%',
        height: 90,
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