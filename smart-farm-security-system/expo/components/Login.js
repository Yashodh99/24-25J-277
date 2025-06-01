import React, { Component } from 'react';
import { Alert, ActivityIndicator , TextInput, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { ref , getDatabase , get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
import firebase from "firebase/app";

export default class Login extends React.Component {
  
  static navigationOptions = ({ navigation}) => {
    return {
      headerTitle: 'Login',
      headerStyle: { backgroundColor: '#1875bb' },
      headerTintColor: '#ffffff',
      headerLeft: () => {
        return null;
      }
    }
  };

  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      message:'',
      showAlert: false,
      loader: false,
      title:''
    };

    this.loadData();
  }

  loadData = async() =>{
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
    if(isLoggedIn==='true'){
      this.props.navigation.replace('HomePage')
    }
  }
  
  onLogin = e => {
    
    this.setState({loader:true})

    const auth = getAuth();

    signInWithEmailAndPassword(auth,this.state.email, this.state.password)
    .then( async(res) => {
      await AsyncStorage.setItem('isLoggedIn','true')
      await AsyncStorage.setItem('userEmail',res.user.email)
      await AsyncStorage.setItem('userId',res.user.uid)

      get(ref(getDatabase(),'/users/'+res.user.uid)).then( async(snapshot) => {
        
        console.log(snapshot.val().name)
        await AsyncStorage.setItem('name',snapshot.val().name)
        this.props.navigation.replace('HomePage')

      })
      
      this.setState({loader:false})
      
    })
    .catch(error => {
      this.setState({title:"Error!",message:error.message})
      this.showAlert()
      this.setState({loader:false})
    }
    );

  }
  
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
    const {showAlert} = this.state;
    return (
      <View style={styles.container}>
        <Image source={require('./../assets/logo2.jpg')}
          style={{width: 350, height: 350, borderRadius: 100}} />
        
        <TextInput 
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          placeholder={'Email'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={ this.onLogin }>
          {!this.state.loader ? (
            <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Login</Text>
          ) : null}
          {this.state.loader ? (
              <ActivityIndicator size="large" color={"#ffffff"} />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={() =>  this.props.navigation.replace('Register')} style={[styles.buttonContainer, styles.registerButton]}> 
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.replace('ForgotPassword')}>
            <Text>Forgot your password?</Text>
        </TouchableOpacity>

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
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 4, 
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width: 80 + '%',
    height: 40,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#1875bb",
  },
  registerButton: {
    backgroundColor: "#0e2025",
  }
});