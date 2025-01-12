import React from "react";
import {
  TextInput, View, ActivityIndicator, StyleSheet,
  TouchableOpacity, Text, Image, ScrollView
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

const initialState = {
  email: "",
  name: "",
  password: "",
  cpassword: "",
  success: false,
  message: "",
  showAlert: false,
  loader: false,
  title: "",
};

export default class Register extends React.Component {
  state = initialState;

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Register',
      headerStyle: { backgroundColor: '#1875bb' },
      headerTintColor: '#ffffff',
      headerLeft: () => {
        return null;
      }
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text>Register Screen</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});
