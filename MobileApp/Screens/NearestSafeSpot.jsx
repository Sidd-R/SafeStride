import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import DirectSpot from './DirectSpot'
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const GOOGLE_MAPS_API_KEY = 'AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY'

const NEARBY_SEARCH_RADIUS = 200; // Search radius in meters

export default function NearestSafeSpot({ navigation }) {
  const [hospitals, setHospitals] = useState([]);

  const getSafeSpots = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return
    }

    let location = await Location.getCurrentPositionAsync({});
    let { latitude, longitude } = location.coords;

    console.log(latitude, longitude);

    // location=19.4065, 72.8338
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${NEARBY_SEARCH_RADIUS}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`
    );

    const results =  []
    response.data.results.forEach((result) => {
      results.push({
        name: result.name,
        address: result.vicinity,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      })
    });

    setHospitals(results);
  }

  useEffect(() => {
    getSafeSpots()
  }, []);



  return (

    <View style={styles.container}>
      <Text style={styles.heading}>Find Nearby SafeSpots</Text>
      <ScrollView className="w-10/12  ">
      {
        hospitals.map((result,i) => {
          return (
            <TouchableOpacity  style={styles.card} onPress={() => navigation.navigate('DirectSpot', { hosp: result})} key={i}>
              <Text style={styles.name}>{result.name}</Text>
              <Text style={styles.address}>{result.address}</Text>
            </TouchableOpacity>
            )
          }
        )
      }
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'cadetblue'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: 30,
    color: 'cadetblue',
  },
  card: {
    // width: '100%',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 7,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  name: {
    marginTop: 8,
    marginLeft: 20,
    fontSize: 15,
  },
  address: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 11,
    marginLeft: 20
  }
});

/* 
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View style={styles.placeContainer}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.address}</Text>
          </View>
        )}
        */