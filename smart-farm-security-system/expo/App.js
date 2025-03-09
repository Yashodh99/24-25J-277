import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { LogBox } from 'react-native';
import { initializeApp } from "firebase/app";

import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Device from './components/Device';
import WeatherA from './components/WeatherA';
import Weather from './components/Weather';
import Animal from './components/Animal';
import AnimalA from './components/AnimalA';
import Loading from './components/Loading';
import Vibration from './components/Vibration';
import Prediction from './components/Prediction';
import ForgotPassword from './components/ForgotPassword';
import Welcome from './components/Welcome';

import { startWeatherUpdates } from './components/WeatherUpdater'; 


LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...'], (isAffected, bundle) => {
  return isAffected || bundle.includes('example.js');
});


const firebaseConfig = {
  apiKey: "AIzaSyAGOdDyrlYWBeBMStH72ZF16S1SYRZAZAA",
  authDomain: "animal-app-ba66a.firebaseapp.com",
  projectId: "animal-app-ba66a",
  storageBucket: "animal-app-ba66a.firebasestorage.app",
  messagingSenderId: "197258309229",
  appId: "1:197258309229:web:e99351a249192f0da79964",
  measurementId: "G-FJTSR2X12M"
};

initializeApp(firebaseConfig);


const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      Loading: { screen: Loading },
      Welcome: { screen: Welcome },
      HomePage: { screen: HomePage },
      Device: { screen: Device },
      Login: { screen: Login },
      Register: { screen: Register },
      ForgotPassword: { screen: ForgotPassword },
      WeatherA: { screen: WeatherA },
      Weather: { screen: Weather },
      Animal: { screen: Animal },
      AnimalA: { screen: AnimalA },
      Vibration: { screen: Vibration },
      Prediction: { screen: Prediction },
    },
    {
      initialRouteName: 'Loading',
    }
  )
);


export default function MainApp() {
  useEffect(() => {
    startWeatherUpdates();
  }, []);

  return <AppNavigator />;
}
