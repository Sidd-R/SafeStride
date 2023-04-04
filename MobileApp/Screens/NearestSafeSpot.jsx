import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList ,TouchableOpacity,ScrollView} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import DirectSpot from './DirectSpot'
const GOOGLE_MAPS_API_KEY ='AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY'

const NEARBY_SEARCH_RADIUS = 500; // Search radius in meters

export default function NearestSafeSpot({navigation}) {
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
                                                                   // location=19.4065, 72.8338
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${NEARBY_SEARCH_RADIUS}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`
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
  


<<<<<<< HEAD
  return(
    <>
    <View>
    <Text style={styles.title}>Hey User</Text>
    <Text style={styles.title2}>Nearby Safespots available are: </Text>
    <ScrollView>
    {
      hospitals.map(hospital=>{
        return(
          <View style={styles.card}>
    <TouchableOpacity onPress={() => navigation.navigate('DirectSpot',{hosp: hospital})}>
      <Text style={styles.name}>{hospital.name}</Text>
      <Text style={styles.address}>{hospital.address}</Text>
      
    </TouchableOpacity>
  </View>
        )
      })
=======
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Find Nearby Hospitals</Text>
      <Text style={styles.heading}>Latitude: {lat} </Text>
      <Text style={styles.heading}>Longitude: {long} </Text>
      
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
>>>>>>> e6636a223b6a1195bc8617aaebdc8d1b9e98a7c7
}
</ScrollView>
</View>
  </>
  )
};



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
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: 30,
    color: 'cadetblue',
  },
  title2:{
    marginLeft:30,
    marginTop: 10,
    marginBottom: 20,
    color: 'cadetblue',
  },
  card: { width: '95%',
  marginTop: 5,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  
  borderColor: 'lightblue',
  borderWidth:1,
  borderRadius: 10,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  },
  name:{
    marginTop: 8,
    marginLeft:20,
    fontSize: 15,
  },
  address: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 8,
    marginLeft: 20
  }
});
