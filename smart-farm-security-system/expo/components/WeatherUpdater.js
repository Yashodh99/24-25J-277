import * as Location from 'expo-location';
import axios from 'axios';
import store from './GlobalStore';
import LocalIP from './localIPAddress';

let interval = null;

export async function startWeatherUpdates() {
  if (interval) return; 

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn("Permission not granted for location");
    return;
  }

  interval = setInterval(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const apiKey = 'dd622b9622486c70fdaa0f2543e09cbb';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const data = response.data;

      const rainValue = data.rain?.["1h"] || data.rain?.["3h"] || "0";
      const weatherData = {
        temperature: data.main.temp,
        rain: rainValue,
        windspeed: data.wind.speed,
        humidity: data.main.humidity,
        soilMoisture: 100,
        vibration: 700,
      };


      const res = await axios.post(`http://${LocalIP}:2222/weather`, JSON.stringify(weatherData), {
        headers: { "Content-Type": "application/json" }
      });

      let weatherCondition = "Unidentified";
      if (res.data.res >= 0 && res.data.res <= 10) weatherCondition = "Dry";
      else if (res.data.res >= 11 && res.data.res <= 19) weatherCondition = "Normal";
      else if (res.data.res >= 20 && res.data.res <= 40) weatherCondition = "Wet";

      store.setWeatherCondition(weatherCondition);
    } catch (err) {
      console.log("Weather fetch failed:", err.message);
    }
  }, 5000); 
}

export function stopWeatherUpdates() {
  if (interval) clearInterval(interval);
  interval = null;
}
