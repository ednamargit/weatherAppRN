import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import WeatherDetails from './components/WeatherDetails';
import { colors } from './utils/index';
import ReloadIcon from './components/ReloadIcon';
import { WEATHER_API_KEY } from '@env'

const { PRIMARY_COLOR } = colors

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {


  const [ errorMessage, setErrorMessage ] = useState(null)

  const [ currentWeather, setCurrentWeather ] = useState(null)

  const [ unitsSystem, setUnitsSystem ] = useState('metric')

  //Inside useEffect we can add a dependency, everytime unitsSystem change, we are gonna make a call to the API load() }, [unitsSystem])

  useEffect(() => {
    load()
  }, [unitsSystem])

  async function load() {

    setCurrentWeather(null)

    setErrorMessage(null)

    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if(status !== "granted") {
        setErrorMessage('Access to location is needed to run the app')
        return
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

      // const weatherUrl = `${BASE_WEATHER_URL}lat=45.508888&lon=-73.561668&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

      alert(`Latitude : ${latitude}, Longitude : ${longitude}`)

      const response = await fetch(weatherUrl)

      console.log(response)

      const result = await response.json()
      
      if(response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }

    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  if(currentWeather) {

    //access two levels destructuring (main property main.temp) 
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem} />
          <ReloadIcon  load={load}/>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem} />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
         <ReloadIcon  load={load}/>
        <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return(
      <View style={styles.container}>
      <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      <StatusBar style="auto" />
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'cyan',
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
});
