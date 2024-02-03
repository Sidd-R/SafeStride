import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { LogBox } from 'react-native';
import { log } from 'react-native-reanimated';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const NEARBY_SEARCH_RADIUS = 500; 

export default function NearestSafeSpot({ navigation }) {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const getSafeSpots = async () => {
      console.log("Entered safe spots function")
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(location)
      let { latitude, longitude } = location.coords;
  
      console.log(latitude, longitude);
      const response = await axios.post('http://192.168.1.7:3010/nearestsafespot', {
        latitude: latitude,
        longitude: longitude,
      }).then(data => data.data);
      console.log("sent api request")
      //console.log(response)
      const results =  []
      console.log(response[1].name)
      response.forEach((result) => {
        results.push({
          name: result.name,
          address: result.vicinity,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        })
      
      });
      
      setHospitals(results);
      console.log(hospitals);
    }
    getSafeSpots()
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/findingNearbySafeSpots.png')}
                style={{
                  marginLeft: 30,
                  marginTop:80,
                  height: 70,
                  width: 400,
                }}
                />
      <ScrollView className="w-10/12  ">
      {
        hospitals.map((result,i) => {
          let name = result.name.toLowerCase()
          if (name.includes("clinic")) return;
          if (i < 7)
          return (
            <TouchableOpacity  style={styles.card} onPress={() => navigation.navigate('DirectSpot', { hosp: result})} key={i}>
              <Text style={styles.name}>{result.name}</Text>
              <Text style={styles.address}>{result.address}</Text>
            </TouchableOpacity>
            )
          }
        )
      }
      {/* <TouchableOpacity  style={styles.card}>
              <Text style={styles.name}>Hostel 18</Text>
              <Text style={styles.address}>Hostel 18 Rd, Students' Residential Zone, IIT Area, Powai, Mumbai, Maharashtra 400076</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.card}>
              <Text style={styles.name}>SBI ATM Centre</Text>
              <Text style={styles.address}>Tansa House B Wing, Students' Residential Zone, IIT Area, Powai, Mumbai, Maharashtra 400076</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.card}>
              <Text style={styles.name}>Hostel 17</Text>
              <Text style={styles.address}>4WM5+PC6, Students' Residential Zone, IIT Area, Powai, Mumbai, Maharashtra 400076</Text>
        </TouchableOpacity> */}
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
    marginTop: 5,
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 10,
    borderColor: '#FF4F63',
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
    marginBottom: 10,
    marginTop: 5,
    marginRight: 5,
    fontSize: 11,
    marginLeft: 20
  }
});
