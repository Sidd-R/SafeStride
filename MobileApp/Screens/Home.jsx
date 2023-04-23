import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topText}>
          <Text style={styles.topTextLine1}>We admire</Text>
          <Text style={styles.topTextLine2}>Your Strong personality</Text>
        </View>
      <View > 
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.1, y: 0.2} } style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Safest Route')}>
         
          <Text style={styles.cardTitle}>Safest Route</Text>
          <Image source={require('../assets/SafestRoute.png')}
                style={{
                  marginLeft: -80,
                  marginTop: -130,
                }}
                />
        </TouchableOpacity>
        </LinearGradient>
      </View>
      <View >
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.2, y: 0.2} } style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('nsf',{navigation})} >
          <Text style={styles.cardTitle}>Nearest Safe Spot</Text>
          <Image source={require('../assets/nearbySafespot.png')}
                style={{
                  marginLeft: -80,
                  marginTop: -130,
                }}
                />
        </TouchableOpacity>
        </LinearGradient>
      </View>
      <View >
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.1, y: 0.2} } style={styles.card}>
       <View>
       <TouchableOpacity onPress={() => navigation.navigate('SOS')}>
        <Image source={require('../assets/SOS.png')}
                style={{
                  marginLeft: -70,
                  marginTop:-80,
                }}
                />
          <Text style={styles.cardTitle}>S O S</Text>
        </TouchableOpacity>
        </View>
        </LinearGradient>
      </View>
      <View>
        <Text style={styles.exploreNearby}>Explore Nearby</Text>
      </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 10
  },
  exploreNearby: {
    marginLeft: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: -5,
  },
  topText:{
    marginBottom: 10,
    marginLeft: 25,

  },
  topTextLine1:{
    fontSize: 15,
  },
  topTextLine2:{
    fontSize: 20,
  },
  card: {
    width: 350,
    height: 140,
    marginTop: 0,
    margin: 20,
    // marginBottom: 20,
    //borderColor: 'lightgrey',
    borderRadius: 20,
    //borderBottomWidth: 4,
    //borderRightWidth: 4,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    
    
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '500',
    color: 'white',
    marginLeft: 140,
    marginTop: 20,
  },
});
