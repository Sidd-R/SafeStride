import MapView, { Marker, Polyline } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, Button, TouchableOpacity, ToggleButton } from 'react-native';
import Constants from "expo-constants";
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';

const MapScreen = () => {
  // Source and Destination coordinates
  const [source,setSource] = useState({ latitude:28.66969942317484,  longitude:77.09303425361844 });
  const [destination,setDestination] = useState({ latitude: 28.632481280670913, longitude: 77.13896183099209 });
  const [sourceAddress,setSourceAddress]=useState("");
  const [destAddress,setDestAddress]=useState("");
  const waypoints=[];
  const [routeRank, setRouteRank] = useState("");
  const [answer,setAnswer]=useState([]);
  const [dispMap, setDispMap] = useState(false)
  // Polyline coordinates
  const polylineCoords = [
    source,
    destination
  ];
  
  
  async function changeMap()
  {
      console.log("sourceAddress ",sourceAddress);
      console.log("destinationAddress",destAddress);
    try {
        const response3 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${sourceAddress}&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`)
        const data = await response3.json();
        setSource({latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng});
        console.log("latitude: ", data.results[0].geometry.location.lat, " longitude: ", source.longitude);
      } catch (error) {
        console.log(error)
      }
      try {
        const response3 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${destAddress}&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`)
        const data = await response3.json();
        setDestination({latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng});
        console.log("latitude: ", destination.latitude, " longitude: ", destination.longitude);
      } catch (error) {
        console.log(error)
      }
      try {
        console.log("the source and destination are: ", sourceAddress, " and ", destAddress)
        const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${sourceAddress}&destination=${destAddress}&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`);
        const data = await response.json();
        const routes = data.routes;
  
        routes.forEach((route, routeIndex) => {
          n = routeIndex;
          route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
  
              if (step.steps) {
  
                step.steps.forEach((subStep) => {
  
                  waypoints.push({
                    route: routeIndex,
                    latitude: subStep.end_location.lat,
                    longitude: subStep.end_location.lng,
                    duration: subStep.duration.text,
                  });
                });
              } else {
  
                waypoints.push({
                  latitude: step.end_location.lat,
                  longitude: step.end_location.lng,
                  route: routeIndex,
                  duration: step.duration.text,
                });
              }
            });
          });
        });
        console.log(waypoints);
        console.log(n + 1);
      } catch (error) {
        console.error(error);
      }
      if (n != 0) {
        try {
          const {manifest} = Constants
          const uri = `http://${manifest.debuggerHost.split(':').shift()}:3010`;
        
          const response2 = await axios.post(uri+'/safestroute', {
            waypoints: waypoints,
            numberOfRoutes: n + 1,
            destlatitude: destination.latitude,
            destlongitude: destination.longitude,
            sourcelatitude: source.latitude,
            sourcelongitude: source.longitude,
          }).then(data => data.data);
          console.log(response2.riskscores);
          const riskScores = response2.riskscores;
          var risk;
          risk=riskScores.map((e)=> {
              risk = String(e);
              risk = risk.substring(7)
              console.log((risk));
              e="0."+risk;
              console.log(e);
              return e;
          })
          setAnswer(risk);
          setDispMap(true);
        
          
          /*for (let i = 0; i < n; i++) {
            routeRank[i] = i + 1;
          }
          for (let i = 0; i < riskScores.length; i++) {
            for (let j = i + 1; j < riskScores.length - 1 - i; j++) {
              if (riskScores[j + 1] < riskScores[j]) {
                let temp = riskScores[j];
                riskScores[j] = riskScores[j + 1];
                riskScores[j + 1] = temp;
                temp = routeRank[j];
                routeRank[j] = routeRank[j + 1];
                routeRank[j + 1] = temp;
              }
            }
          }
          console.log("Ranking of Routes: ", routeRank);
            */
        }
        catch (error) {
          console.error(error);
        }
      }
     
  }
  return (
    <View style={styles.container}>
       <View style={styles.inputsec}>
        <TextInput style={styles.input} placeholder='Source' onChangeText={setSourceAddress}  />
        <TextInput style={styles.input} placeholder='destination' onChangeText={setDestAddress} />
        <TouchableOpacity style={styles.button} onPress={changeMap}>
          <Text style={styles.buttonText} >Go</Text>
        </TouchableOpacity>
      </View>
        
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: source.latitude,
          longitude: source.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
       

        {/* Polyline to draw route */}
       
      </MapView>
     
     {dispMap? <View style={{marginBottom: 20, marginLeft: 20, padding:10}}>
          <Text style={{color:"blue", fontSize: 20}}>The Routes with their riskscores are</Text>
          {
              
              answer.map((i,j)=>{
                  return(
                      <Text style={{color:"cadetblue", fontWeight: 'bold'}}>Route {j}:  {i}</Text>
                  )
              })
          }
      
      </View>:null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
     
      flex: 1,
  },
  inputsec: {
    backgroundColor: 'cadetblue',
  },
  button: {
    color: 'cadetblue',
    height: 20,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 40,
    marginRight: 30,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    marginLeft: 40,
    marginRight: 50,
    marginBottom: 5,
    marginTop: 10,
    borderRadius: 10,
    fontSize: 10,
    paddingLeft: 10,
  },
});

export default MapScreen;

