import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

const NEARBY_SEARCH_RADIUS = 5000; // Search radius in meters

export default function App() {
  const [hospitals, setHospitals] = useState([]);
  const [lat, setLat] = useState(0)
  const [long, setlong] = useState(0)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;
      setLat(latitude)
      setlong(longitude)

      console.log(latitude, longitude);

      const response = await axios.get(
        // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.4065, 72.8338&radius=${NEARBY_SEARCH_RADIUS}&type=hindu_temple&key=${GOOGLE_MAPS_API_KEY}`
      );

      // console.log(response);

      const results = response.data.results.map((result) => {
        // console.log(result,2);
        return {
          name: result.name,
          address: result.vicinity,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        };
      });
      // console.log(results,3);
      setHospitals(results);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Find Nearby Hospitals{lat} long </Text>
      <Text style={styles.heading}>Latitude: {lat} Longitude: {long}</Text>
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View style={styles.placeContainer}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.address}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placeAddress: {
    fontSize: 16,
  },
});
