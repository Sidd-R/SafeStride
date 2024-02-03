import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity , Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import SafestRoute from './SafestRoute';


export default function SafetyScoreScreen() {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);

  // Function to get the current location
  const getCurrentLocation =async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("requested for permission for currenr location")
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return
      }
      console.log(status)
      let loc = await Location.getCurrentPositionAsync({});
      console.log(loc)
      let { latitude, longitude } = loc.coords;
      // lat=19.135264058448602
      // long=72.90966639924382
      // loc="IITBombay, Hostel5"
      setLatitude(latitude)
      setLongitude(longitude)
      setLocation(loc)
      console.log(latitude, longitude);
  };

  const handleLocationSubmit = () => {
    // If the user didn't enter a location, use the current location by default.
    if (!location) {
      console.log("Location not entered")
      getCurrentLocation();
    } else {
      // Use Google Maps Geocoding API or another geocoding service to get latitude and longitude based on the location.
      // Example using the Google Maps Geocoding API.
      loc=location
      const apiKey = 'AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg';
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${apiKey}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const firstResult = data.results[0];
          if (firstResult) {
            setLatitude(firstResult.geometry.location.lat);
            setLongitude(firstResult.geometry.location.lng);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const calculateSafetyScore = async (latitude, longitude) => {
    console.log("Entered function")
    try {
      const riskScore = await axios.post('http://192.168.1.7:3010/safetyindex', {
        latitude: latitude,
        longitude: longitude,
      }).then(data => data.data.riskscores);
      console.log(riskScore)
      risk=riskScore
      risk=risk*1000000
      risk=String(risk)
      console.log(risk)
      risk=risk.slice(5)
      risk=Number(risk)
      risk=risk.toFixed(3)
      setSafetyScore(risk);
    
    } catch (error) {
      console.error(error);
      setSafetyScore(null);
    }
  };

  useEffect(() => {
    if (safetyScore === null && latitude !== null && longitude !== null) {
      calculateSafetyScore(latitude, longitude);
    }
  }, [safetyScore, latitude, longitude]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/verify.png')}
                style={{
                  marginLeft: 10,
                  marginTop:50,
                  height: 65,
                  width: 70,
                }}
                />
      <Text style={styles.heading}>Safety Index</Text>
      <Text>Enter a location or your current location</Text>
      <TextInput
        style={styles.input}
        placeholder="Your current Location"
        onChangeText={(text) => setLocation(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLocationSubmit}
      >
        <Text style={styles.buttonText}>Get Location</Text>
      </TouchableOpacity>
      {latitude !== null && longitude !== null && (
        <MapView
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.00422,
            longitudeDelta: 0.00421,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title="Selected Location" />
        </MapView>
      )}
      {safetyScore !== null && (
      <>
       <Text style={styles.safetyScoreText}>Safety Score: {safetyScore}</Text>
       <Text style={styles.safetyScoreText2}>This region is MODERATELY SAFE</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#FF4F63",
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  button: {
    backgroundColor: '#FF4F63',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {

    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    width: '80%',
    height: 200,
    margin: 10,
  },
  safetyScoreText: {
    fontSize: 20,
    margin: 10,
    color: '#FF4F63',
    fontWeight: 'bold',
  },
  safetyScoreText2: {
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
  },
});
