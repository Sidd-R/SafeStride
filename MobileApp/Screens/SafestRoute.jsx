import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions ,Text,TextInput,Button, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_MAPS_API_KEY='AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';




const Map=()=>{
  const [location,setLocation]=useState({latitude:0, longitude:0});
  const [source,setSource]=useState("");
  const [destination,setDestination]=useState("");
  //const [routes,setRoutes]=useState([]);
  async function handlePress() {

      const waypoints = [];
      let n=0;
      try {
        console.log("the source and destination are: ",source," and ",destination)
        const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`);
        const data = await response.json();
        const routes = data.routes;
        
            routes.forEach((route, routeIndex) => {
              n=routeIndex;
              route.legs.forEach((leg) => {
                leg.steps.forEach((step) => {
                  
                  if (step.steps) {
                    
                    step.steps.forEach((subStep) => {
                   
                      waypoints.push({
                        route: routeIndex,
                        latitude: subStep.end_location.lat,
                        longitude: subStep.end_location.lng,
                       
                      });
                    });
                  } else {
                  
                    waypoints.push({
                      latitude: step.end_location.lat,
                      longitude: step.end_location.lng,
                      route: routeIndex
                     
                    });
                  }
                });
              });
            });
          console.log(waypoints);
          console.log(n+1);
          } catch (error) {
            console.error(error);
          }
          try{
            const response2 = await axios.post('http://192.168.162.214:3010/safestroute', {
              waypoints: waypoints,
              numberOfRoutes: n+1,
            });
      
          } 
          catch (error) {
          console.error(error);
        }
  }
    
  
  return(
    <View style={styles.container}>
      <View style={styles.inputsec}>
        <TextInput style={styles.input} placeholder='Source' onChangeText={setSource}/>
        <TextInput style={styles.input} placeholder='destination' onChangeText={setDestination} />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
      </View>
    
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    
  },
  mapsec: {
    
  },
    button: {
      color: 'cadetblue',
      height: 20,
      backgroundColor: 'lightblue',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:10,
      marginLeft: 40,
      marginRight: 30,
      marginBottom: 10,
    },
  
  inputsec: {
    backgroundColor: 'cadetblue',
  },
  input:{
    backgroundColor: 'white',
    marginLeft: 40,
    marginRight: 50,
    marginBottom: 5,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 10,
    paddingLeft: 10,
  },
  route: {

  },
  map: {
    flex: 1,
    marginTop: 50,
    width: '100%',
    height: '100%'
  }
});

export default Map


/*<Polyline
          coordinates={[
            {latitude: 28.6692, longitude: 77.107},
            {latitude: 28.5355, longitude: 77.2649},
          ]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={6}
        /> */


        
    
  
  
  
  
  
  


      