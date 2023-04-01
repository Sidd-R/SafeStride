import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';

const origin = {latitude: 28.6692, longitude: 77.107};
const destination = {latitude: 28.5355, longitude: 77.2649};

const routes = [
  {origin: {latitude: 28.6692, longitude: 77.107}, destination: {latitude: 28.5355, longitude: 77.2649}},
  {origin: {latitude: 28.6692, longitude: 77.107}, destination: {latitude: 28.5303, longitude: 77.2672}},
  {origin: {latitude: 28.6692, longitude: 77.107}, destination: {latitude: 28.5484, longitude: 77.2359}},
];

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 28.6692,
    longitude: 77.107,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    setRegion({
      latitude: 28.6692,
      longitude: 77.107,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, []);

  const key=GOOGLE_MAPS_API_KEY
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followUserLocation={true}
      >
        <Marker coordinate={origin} />
        <Marker coordinate={destination} />

        {routes.map((route, index) => (
          <MapViewDirections
            key={index}
            origin={route.origin}
            destination={route.destination}
            apikey={key}
            strokeWidth={3}
            strokeColor="#FF0000"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);

              // Uncomment the line below to show the directions in the console
               console.log(result.steps);

              setRegion({
                latitude: result.coordinates[0]['latitude'],
                longitude: result.coordinates[0]['longitude'],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }}
            onError={(errorMessage) => {
               console.log('GOT AN ERROR');
            }}
          />
        ))}

        <Polyline
          coordinates={[
            {latitude: 28.6692, longitude: 77.107},
            {latitude: 28.5355, longitude: 77.2649},
          ]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map
