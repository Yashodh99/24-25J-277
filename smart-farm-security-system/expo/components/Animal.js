import React from 'react';
import { ActivityIndicator, Alert, View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default class Animal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localUri: '',
            resultUri: '',
            resultTxt: '',
            message: '',
            showAlert: false,
            result: false,
            title: '',
            loader: false,
        };
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Animal Detect (M)',
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

    uploadImage = async (uri_data) => {
        console.log("Uploading URI:", uri_data);
        const data = new FormData();
        data.append("file", {
            uri: uri_data,
            name: uuidv4() + ".jpg",
            type: "image/jpg",
        });

        try {
            const response = await axios.post(`http://${LocalIP}:2222/image_upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Server Response:", response.data);
            const { con, result } = response.data;
            const confidence = Number(con);  // Convert to JS number explicitly
            if (confidence < 60 || confidence.toFixed(1) === "100.00") {
                this.setState({ loader: false, result: true, resultTxt: "Not Detected!" });
            } else {
                this.setState({ loader: false, resultTxt: result, result: true });
            }
        } catch (error) {
            console.log("Upload Error:", error.response ? error.response.data : error.message);
            this.setState({
                loader: false,
                title: "Upload Failed",
                message: error.response?.data?.error || "An error occurred while uploading the image.",
                showAlert: true,
            });
        }
    };

    onInsert = async () => {
        if (!this.state.localUri) {
            this.setState({ title: "Required!", message: "Please choose an image!" });
            this.showAlert();
            return;
        }
        if (this.state.loader) {
            this.setState({ title: "Required!", message: "Please wait!" });
            this.showAlert();
            return;
        }

        this.setState({ loader: true });
        await this.uploadImage(this.state.localUri);
    };

    showAlert = () => {
        this.setState({ showAlert: true });
    };

    hideAlert = () => {
        this.setState({ showAlert: false, message: "", title: "" });
    };

    openImagePickerAsync = async (x) => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            this.setState({ title: "Permission Denied!", message: "Permission to access camera roll is required!" });
            this.showAlert();
            return;
        }

        let pickerResult;
        if (x === 1) {
            pickerResult = await ImagePicker.launchImageLibraryAsync();
        } else {
            pickerResult = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
        }

        if (pickerResult.canceled) {
            return;
        }

        console.log("Selected URI:", pickerResult.assets[0].uri);
        this.setState({ localUri: pickerResult.assets[0].uri });
    };

    open_image_option = () => {
        Alert.alert(
            'Select Option',
            'Camera or Gallery',
            [
                { text: 'Camera', onPress: () => this.openImagePickerAsync(0) },
                { text: 'Gallery', onPress: () => this.openImagePickerAsync(1) },
                { text: 'Close', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };


    render() {
        const { showAlert } = this.state;

        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.center}>
                        <Image
                            source={require("./../assets/logo2.jpg")}
                            style={{ width: 150, height: 150, marginBottom: 20, marginTop: 10, borderRadius: 100 }}
                        />
                    </View>

                    <View>
                        <Text style={styles.labelText}>Upload Image:</Text>
                        <View style={styles.center}>
                            <TouchableOpacity
                                onPress={this.open_image_option}
                                style={{
                                    width: '80%',
                                    height: Dimensions.get('window').width * 0.8,
                                    borderWidth: 1,
                                    marginBottom: 10,
                                    marginTop: 10,
                                    borderColor: '#c4c4c4',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {this.state.localUri ? (
                                    <Image
                                        source={{ uri: this.state.localUri }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <Text style={{ color: '#888' }}>No Image Selected</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.center, { marginVertical: 10 }]}>
                            <TouchableOpacity
                                style={[styles.buttonContainer, styles.registerButton]}
                                onPress={this.open_image_option}
                            >
                                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Choose Image</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.center, { marginBottom: 20 }]}>
                            <TouchableOpacity
                                style={[styles.buttonContainer, styles.loginButton]}
                                onPress={this.onInsert}
                            >
                                {!this.state.loader ? (
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Upload</Text>
                                ) : (
                                    <ActivityIndicator size="large" color="#ffffff" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {this.state.result && (
                            <View style={[styles.center, { marginTop: 20, marginHorizontal: 20, padding: 15, borderRadius: 10, backgroundColor: '#f2f7fb' }]}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#1875bb', textAlign: 'center' }}>
                                    {this.state.resultTxt}
                                </Text>

                                {this.state.resultTxt === 'Deer' && (
                                    <><Text style={[styles.resultMessage, { color: 'red', fontWeight: 'bold' }]}>
                                        Deterrent System Activated!
                                    </Text>
                                        <Text style={styles.resultMessage}>
                                            Playing barking-two-large-dogs
                                        </Text></>
                                )}
                                {this.state.resultTxt === 'Wild Boar' && (
                                    <><Text style={[styles.resultMessage, { color: 'red', fontWeight: 'bold' }]}>
                                        Deterrent System Activated!
                                    </Text><Text style={styles.resultMessage}>
                                            Playing leopard-growl
                                        </Text></>
                                )}
                                {this.state.resultTxt === 'Elephant' && (
                                    <><Text style={[styles.resultMessage, { color: 'red', fontWeight: 'bold' }]}>
                                        Deterrent System Activated!
                                    </Text><Text style={styles.resultMessage}>
                                            Playing angry-bee-swarm
                                        </Text></>
                                )}
                            </View>


                        )}
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
            </ScrollView>
        );
    }
}
