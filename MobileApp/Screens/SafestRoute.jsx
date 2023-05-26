import MapView, { Marker, Polyline } from 'react-native-maps';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,Image, View, Dimensions, Text, TextInput, Button, TouchableOpacity, ToggleSButton, Alert, Linking } from 'react-native';
import {GOOGLE_MAPS_API_KEY} from '@env'
import axios from 'axios';
import { ButtonGroup } from '@rneui/themed'
import Loader from '../components/Loader';
// const GOOGLE_MAPS_API_KEY='AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';
import polyline from 'polyline';
import * as Location from 'expo-location';

export default function SafestRoute ({navigation,route}) {
  const [source,setSource] = useState({ latitude:19.113645,  longitude:72.8695881 });
  const [showMap, setShowMap] = useState(false)
 

  useEffect(() => {
    const getSafeSpots = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
    
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return
      }
    
      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;
      
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      setSource({latitude:latitude,longitude:longitude});
      console.log(latitude,longitude,"ffff");
      console.log(source,'fffk');
      setLoading(false);
      setShowMap(true)
    }
    getSafeSpots();
  }, [])

  useEffect(() => {
    // setLoading(true);
    setRegion({
      latitude: source.latitude,
      longitude: source.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    // setLoading(false);
    setShowMap(true)
  
  }, [source])
  
  
  const mapRef = useRef(null)

  const [selectedRoute, setSelectedRoute] = useState(0)
  const [buttons, setButtons] = useState(['none'])
  const [loading, setLoading] = useState(false)
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
  let gmapRoutes = ["", "", ""]

  const updateArea = async () => {
    // setShowMap(false);
    // console.log('s');
    // const newRegion ={
    //   latitude: source.latitude,
    //   longitude: source.longitude,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // }
    // setRegion(newRegion);
    // // setShowMap(true);
    // await mapRef.current.animateToRegion(newRegion, 5);
    // console.log('e');
  }
  
  const openGoogleMaps = (/*startLatitude, startLongitude, endLatitude, endLongitude, waypoints*/e) => {
    //37.7965,-122.4056|37.7998,-122.4057
    const url = `https://www.google.com/maps/dir/?api=1&origin=${source.latitude},${source.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${e}`;
    Linking.openURL(url);
  }
  
  

  async function changeMap() {
    
    setLoading(true)
    try {
      const sourceLocation = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${sourceAddress}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results[0].geometry.location)
      console.log(sourceLocation);
      setSource({latitude: sourceLocation.lat, longitude: sourceLocation.lng});


      const destinationLocation = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${destAddress}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results[0].geometry.location)
      setDestination({latitude: destinationLocation.lat, longitude: destinationLocation.lng});

      // updateArea()
    } catch (error) {
      console.log(error,'2')
      alert('Location not found')
      setLoading(false);
      return
    }
    await updateArea()
    setSelectedRoute(0)
    setDispMap(false)
    setAnswer([])
    setWaypoints([])
    n = 0
    gmapRoutes = ["","",""]
    console.log("sourceAddress ",sourceAddress);
    console.log("destinationAddress",destAddress);
    // updateArea()
    try {
      // console.log("the source and destination are: ", source, " and ", destination)
      let routes = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${sourceAddress}&destination=${destAddress}&key=${GOOGLE_MAPS_API_KEY}&alternatives=true`).then(data => data.data.routes);
      routes.forEach((route, routeIndex) => {
        n= routeIndex;
        let points = polyline.decode(route.overview_polyline.points)
        points.forEach((e,i)=> {
          if (i%10 == 0){
            if (gmapRoutes[routeIndex] === "")
              gmapRoutes[routeIndex] = String(e[0])+","+String(e[1])
            else
              gmapRoutes[routeIndex] += "|"+ String(e[0])+","+String(e[1])
          }
        })
        points = points.map((point) => ({
          latitude: point[0],
          longitude: point[1]
        }));

        routeOverViews[routeIndex] = points
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
      // console.log(n + 1,routeOverViews.length);
    } catch (error) {
      console.error(error,3);
      setLoading(false);
    }

      try {
        // const { manifest } = Constants;
        // const uri = `http://${manifest.debuggerHost.split(':').shift()}:3010`;
        // const uri = 'https://99a5-2409-40c0-6c-4c4f-cd4c-7ec9-5e46-d88e.ngrok-free.app'
        const {uri} = route.params
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

        // riskScores.sort()

        if (riskScores.length == 3) setButtons(['route1','route2','route3'])
        else if (riskScores.length == 2) setButtons(['route1','route2'])
        else setButtons(['route1'])
        // console.log('fff',riskScores[0]);
        let min = 1;
        let index = 0;
        riskScores.forEach((e,i) => {
          if (e < min) {
            min = e;
            index = i;
          }
        })
        if (riskScores[index] > 0.65) {
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
                  navigation.navigate('NFS');
                },
              },
            ],
            {cancelable: false},
          );
        }
      

        // console.log(buttons);
        // console.log(riskScores.length);
        console.log(riskScores);
        setAnswer(riskScores);
        setDispMap(true);
        await updateArea()
        setDispMap(false);
        setDispMap(true)
    }
    catch (error) {
      console.error(error);
    }
    setLoading(false);
    // openGoogleMaps()
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
      {showMap?<MapView
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
        onPress={() => openGoogleMaps(gmapRoutes[0])}
      />:null}
      {dispMap && selectedRoute == 1 && answer.length >= 2 ? <Polyline
        coordinates={routeOverViews[1]}
        strokeWidth={5}
        strokeColor="cornflowerblue"
        onPress={() => openGoogleMaps(gmapRoutes[1])}
      />:null}
      {dispMap && selectedRoute == 2 && answer.length >= 3 ? <Polyline
        coordinates={routeOverViews[2]}
        strokeWidth={5}
        strokeColor="cornflowerblue"
        onPress={() => openGoogleMaps(gmapRoutes[2])}
      />:null}
      
    {source && <Marker coordinate={source} />}
    {destination && <Marker coordinate={destination} />}
    {/* {routePoints && (<Polyline coordinates={routePoints} strokeColor="#000" strokeWidth={6}/>)} */}
      </MapView>:null}

     {dispMap&&showMap? <View style={{marginBottom: 20, marginLeft: 20, padding:10}}>
          <Text style={{color:"#FF4F63", fontSize: 20}}>The Routes with their riskscores are</Text>
          {
              answer.map((i,j)=>{
                  return(
                      <Text style={{color:"grey", fontWeight: 'bold'}} key={j}>Route {j+1}:  {Math.round(i*100)}%</Text>
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

// export default SafestRoute;