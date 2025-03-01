import React from "react";
import { View, Text, ActivityIndicator, StyleSheet , Image , Linking } from "react-native";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Loading extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      message:'',
      showAlert: false,
      title:''
    };

  }

  static navigationOptions = ({ navigation}) => {
    return {
      headerTitle: 'Loading...',
      headerStyle: { backgroundColor: '#1875bb' },
      headerTintColor: '#ffffff',
      headerLeft: () => {
        return null;
      }
    }
  };