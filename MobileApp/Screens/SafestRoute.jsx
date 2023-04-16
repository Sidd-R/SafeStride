import MapView, { Marker, Polyline } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, Button, TouchableOpacity, ToggleSButton } from 'react-native';
const GOOGLE_MAPS_API_KEY = 'AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';
import axios from 'axios';
import Constants from "expo-constants";
import getDirections from 'react-native-google-maps-directions';

const SafestRoute = () => {
  const [source,setSource] = useState({ latitude:19.113645,  longitude:72.8695881 });
  const [destination,setDestination] = useState({ latitude: 19.2009332, longitude: 77.13896183099209 });
  const [sourceAddress,setSourceAddress]=useState("");
  const [destAddress,setDestAddress]=useState("");
  const waypoints=[];
  const [answer,setAnswer]=useState([]);
  const [dispMap, setDispMap] = useState(false)
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routePoints, setRoutePoints] = useState(null)
  const [routeOverViews, setRouteOverViews] = useState([])
  let n=0

  const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;
  
    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
  
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
  
      const dLat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dLat;
  
      shift = 0;
      result = 0;
  
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
  
      const dLng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dLng;
  
      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
  
    return poly;
  };  

  const handleGetDirections = async () => {
    const resp = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=Andheri&destination=Malad&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`)
    console.log(resp.data);
    const points = resp.data.routes[0].overview_polyline.points;
    const routePoints = decodePolyline(points);
    setRoutePoints(routePoints);
  };

  useEffect(() => {
    // handleGetDirections()
    // const directions = new Directions({
    //   origin: {
    //     latitude: 37.78825,
    //     longitude: -122.4324,
    //   },
    //   destination: {
    //     latitude: 37.7749,
    //     longitude: -122.4194,
    //   },
    //   params: {
    //     key: 'AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY',
    //   },
    // });

    

    // directions.getDirections()
    //   .then((result) => {
    //     const { coordinates } = result.routes[0].overview_polyline;
    //     setRouteCoordinates(coordinates);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, [])
  
  
  async function changeMap() {
      console.log("sourceAddress ",sourceAddress);
      console.log("destinationAddress",destAddress);
    try {
      console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${sourceAddress}&key=AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY`);
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
        console.log(`https://maps.googleapis.com/maps/api/directions/json?origin=${sourceAddress}&destination=${destAddress}&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`);
        const data = await response.json();
        const routes = data.routes;
  
        routes.forEach((route, routeIndex) => {
           n= routeIndex;
          console.log('kk',decodePolyline(route.overview_polyline.points));
          routeOverViews.push(decodePolyline(route.overview_polyline.points))
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
        // console.log(waypoints);
        console.log("enc",routeOverViews[0]);
        console.log(n + 1);
      } catch (error) {
        console.error(error);
      }

      if (n != 0) {
        try {
          const { manifest } = Constants;

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
          var risk = riskScores.map((e)=> {
              risk = String(e);
              risk = risk.substring(7)
              console.log((risk));
              e="0."+risk;
              console.log(e);
              return e;
          })
          setAnswer(risk);
          setDispMap(true);
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
        {/*display thr routes (here max 3 routes) */ }
      {dispMap ? <Polyline
        coordinates={routeOverViews[0]}
        strokeWidth={5}
        strokeColor="#00FF00"
      />:null}
      {dispMap ? <Polyline
        coordinates={routeOverViews[1]}
        strokeWidth={5}
        strokeColor="#FF0000"
      />:null}
      {dispMap ? <Polyline
        coordinates={routeOverViews[2]}
        strokeWidth={5}
        strokeColor="#0000FF"
      />:null}
      
    {source && <Marker coordinate={source} />}
    {destination && <Marker coordinate={destination} />}
    {/* {routePoints && (<Polyline coordinates={routePoints} strokeColor="#000" strokeWidth={6}/>)} */}
      </MapView>
     
     {dispMap? <View style={{marginBottom: 20, marginLeft: 20, padding:10}}>
          <Text style={{color:"blue", fontSize: 20}}>The Routes with their riskscores are</Text>
          {
              
              answer.map((i,j)=>{
                  return(
                      <Text style={{color:"cadetblue", fontWeight: 'bold'}} key={j}>Route {j}:  {i}</Text>
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

export default SafestRoute;
