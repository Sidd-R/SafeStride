import MapView, { Marker, Polyline } from 'react-native-maps';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,Image, View, Dimensions, Text, TextInput, Button, TouchableOpacity, ToggleSButton, Alert } from 'react-native';
//import {GOOGLE_MAPS_API_KEY} from '@env'
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from "expo-constants";
import { ButtonGroup } from '@rneui/themed'
import Loader from '../components/Loader';
const GOOGLE_MAPS_API_KEY='AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';
import { uri } from '../uri';

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

const SafestRoute = ({navigation}) => {
  const mapRef = useRef(null)

  const [selectedRoute, setSelectedRoute] = useState(0)
  const [buttons, setButtons] = useState(['none'])
  const [loading, setLoading] = useState(false)
  const [source,setSource] = useState({ latitude:19.113645,  longitude:72.8695881 });
  const [destination,setDestination] = useState({ latitude: 19.2009332, longitude: 77.13896183099209 });
  const [sourceAddress,setSourceAddress]=useState("");
  const [destAddress,setDestAddress]=useState("");
  const [waypoints, setWaypoints] = useState([])
  const [answer,setAnswer]=useState([]);
  const [dispMap, setDispMap] = useState(false)
  const [routeOverViews, setRouteOverViews] = useState([])
  const [region, setRegion] = useState({
    latitude: source.latitude,
    longitude: source.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  let n=0

  const updateArea = () => {
    const newRegion ={
      latitude: source.latitude,
      longitude: source.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    setRegion(newRegion);
    mapRef.current.animateToRegion(region, 1000);
  }
  
  async function changeMap() {
    setSelectedRoute(0)
    setDispMap(false)
    setAnswer([])
    setWaypoints([])
    n = 0
    console.log("sourceAddress ",sourceAddress);
    console.log("destinationAddress",destAddress);
    setLoading(true)
    try {
      console.log('hi');
      const sourceLocation = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${sourceAddress}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results[0].geometry.location)
      console.log(sourceLocation);
      setSource({latitude: sourceLocation.lat, longitude: sourceLocation.lng});

      const destinationLocation = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${destAddress}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results[0].geometry.location)
      setDestination({latitude: destinationLocation.lat, longitude: destinationLocation.lng});

      updateArea()
    } catch (error) {
      console.log(error,'2')
      alert('Location not found')
      setLoading(false);
      return
    }

    try {
      console.log("the source and destination are: ", source, " and ", destination)
      let routes = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${sourceAddress}&destination=${destAddress}&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`).then(data => data.data.routes);
  
        routes.forEach((route, routeIndex) => {
           n= routeIndex;
          routeOverViews[routeIndex] = (decodePolyline(route.overview_polyline.points))
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
        console.log(n + 1,routeOverViews.length);
      } catch (error) {
        console.error(error,3);
        setLoading(false);
      }

        try {
          // const { manifest } = Constants;
          // const uri = `http://${manifest.debuggerHost.split(':').shift()}:3010`;
          // const uri = 'https://99a5-2409-40c0-6c-4c4f-cd4c-7ec9-5e46-d88e.ngrok-free.app'
          const riskScores = await axios.post(uri+'/safestroute', {
            waypoints: waypoints,
            numberOfRoutes: n + 1,
            destlatitude: destination.latitude,
            destlongitude: destination.longitude,
            sourcelatitude: source.latitude,
            sourcelongitude: source.longitude,
          }).then(data => data.data.riskscores);

          riskScores.forEach((e,i)=> {
              e = String(e);
              e = e.substring(7)
              riskScores[i]="0."+e;
              riskScores[i] = Number(riskScores[i])
          })

          riskScores.sort()

          if (riskScores.length == 3) setButtons(['route1','route2','route3'])
          else if (riskScores.length == 2) setButtons(['route1','route2'])
          else setButtons(['route1'])
          console.log('fff',riskScores[0]);
          if (riskScores[0] > 0.65) {
            Alert.alert(
              'Warning',
              'The riskscore of the availaible routes is beyond the safety index, It is suggested that you go to a safe spot.',
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    return null;
                  },
                },
                {
                  text: 'Proceed',
                  onPress: () => {
                    navigation.navigate('nsf');
                  },
                },
              ],
              {cancelable: false},
            );
          }
       

          console.log(buttons);
          console.log(riskScores.length);
          console.log(riskScores);
          setAnswer(riskScores);
          setDispMap(true);
        }
        catch (error) {
          console.error(error);
        }
     setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading}/>
      <View style={styles.inputsec} >
        <TextInput style={styles.input} placeholder='Source' onChangeText={setSourceAddress}  />
        <TextInput style={styles.input} placeholder='destination' onChangeText={setDestAddress} />
        <Image source={require('../assets/SafestRouteIcons.png')}
                style={{
                  marginLeft: -55,
                  marginTop: -95,
                  height: 100,
                  width: 170,
                }}
                />
        <TouchableOpacity  onPress={changeMap} style={styles.button}>
          <Text style={styles.buttonText} >Go</Text>
        </TouchableOpacity>
      </View>
      {dispMap?<View className=" h-14" style={{backgroundColor:"white"}}>
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedRoute}
        onPress={(value) => {
          // setSelectedIndex(value);
          setSelectedRoute(value);
        }}
        selectedTextStyle={{color:"white"}}
        textStyle={{color:"#FF4F63"}}
        buttonStyle={{backgroundColor:"white"}}
        selectedButtonStyle={{backgroundColor:"#FF4F63"}}
        containerStyle={{ marginBottom: 40,marginTop:0, width:"80%",marginLeft:"10%",borderRadius:5,backgroundColor:'white'}}
      />
      </View>:null}
        
      <MapView
      ref={mapRef}
        loadingEnabled
        region={region}
        style={styles.map}
        // initialRegion={{
        //   latitude: source.latitude,
        //   longitude: source.longitude,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      >
        {/*display thr routes (here max 3 routes) */ }
      {dispMap && selectedRoute == 0 ? <Polyline
        coordinates={routeOverViews[0]}
        strokeWidth={5}
        strokeColor="cornflowerblue"
      />:null}
      {dispMap && selectedRoute == 1 && answer.length >= 2 ? <Polyline
        coordinates={routeOverViews[1]}
        strokeWidth={5}
        strokeColor="cornflowerblue"
      />:null}
      {dispMap && selectedRoute == 2 && answer.length >= 3 ? <Polyline
        coordinates={routeOverViews[2]}
        strokeWidth={5}
        strokeColor="cornflowerblue"
      />:null}
      
    {source && <Marker coordinate={source} />}
    {destination && <Marker coordinate={destination} />}
    {/* {routePoints && (<Polyline coordinates={routePoints} strokeColor="#000" strokeWidth={6}/>)} */}
      </MapView>
     
     {dispMap? <View style={{marginBottom: 20, marginLeft: 20, padding:10}}>
          <Text style={{color:"#FF4F63", fontSize: 20}}>The Routes with their riskscores are</Text>
          {
              answer.map((i,j)=>{
                  return(
                      <Text style={{color:"grey", fontWeight: 'bold'}} key={j}>Route {j}:  {Math.round(i*100)}%</Text>
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
    backgroundColor: 'white',
  },
  button: {
    color: '#106ffe',
    backgroundColor: '#FF4F63',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: "5%",
    padding: 7,
    marginBottom: 20,
    width: "90%"
  },
  input: {
    backgroundColor: 'white',
    marginLeft: "14%",
    // marginRight: 50,
    // marginBottom: 5,
    marginTop: 20,
    borderRadius: 20,
    fontSize: 10,
    paddingLeft: 10,
    height: 35,
    width:"80%",
    borderColor:"grey",
    borderWidth: 0.5
  },
  buttonText:{
    color: "white",
    fontWeight: "bold",
  }
});

export default SafestRoute;