/*import React, { useState, useEffect } from 'react';
import { View , Text} from 'react-native';


const MapScreen = ({navigation,hosp}) => {

    useEffect(
        async () => {
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
            let hospitallat=19.4076341;
            let hospitallong=72.8356197;
            
        }
       

    )
  
  
};

export default MapScreen;

*/
import React, { useState, useEffect } from 'react';
import { View , Text} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import {GOOGLE_MAPS_API_KEY} from '@env'
import polyline from 'polyline';

const DirectSpot = ({route}) => {
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [region, setRegion] = useState(null);
    const [routes, setRoute] = useState(null);
    const [hospitallat, setHospitallat] = useState(route.params.hosp.latitude);
    const [hospitallong, setHospitallong] = useState(route.params.hosp.longitude);

    // const GOOGLE_MAPS_APIKEY = 'AIzaSyD5puZeCAKP5CnZxPbhvWIezhWdHfJAwtY';
    console.log("latitude",route.params.hosp.latitude);
    console.log("longitude",route.params.hosp.longitude);
    

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMessage('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            let { latitude, longitude } = location.coords;
            setLocation(location);
            setRegion({ latitude, longitude, latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,});
        })();
    }, []);

    useEffect(() => {
        if (location) {
            getDirections(location.coords.latitude, location.coords.longitude);
        }
    }, [location]);

    const getDirections = async (latitude, longitude) => {
        try {
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${hospitallat},${hospitallong}&key=${GOOGLE_MAPS_API_KEY}`);
            const respJson = await resp.json();
            const points = polyline.decode(respJson.routes[0].overview_polyline.points);
            
            const coords = points.map(point => ({
                latitude: point[0],
                longitude: point[1]
            }));
            setRoute(coords);
            console.log(coords);
        } catch (error) {
         console.log('Error1:', error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {region && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                >
                    {location && (
                        <Marker
                            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                            title= "Your location"
                            pinColor="lightblue"
                        />
                    )}
                    {hospitallat && hospitallong && (
                        <Marker
                            coordinate={{ latitude: hospitallat, longitude: hospitallong }}
                            title={`${route.params.hosp.name} (Safe Spot)`}
                            pinColor="red"
                        />
                    )}
                    {location && (
                        <MapViewDirections
                            origin={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                            destination={{ latitude: hospitallat, longitude: hospitallong }}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={3}
                            strokeColor="purple"
                        />
                    )}
                    {routes && (
                        <Polyline
                            coordinates={routes}
                            strokeWidth={3}
                            strokeColor="cadetblue"
                        />
                    )}
                </MapView>
            )}
            {errorMessage && <Text>{errorMessage}</Text>}
        </View>
    );
};

export default DirectSpot;
