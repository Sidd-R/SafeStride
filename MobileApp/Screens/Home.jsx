import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
      <View > 
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.1, y: 0.2} } style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Safest Route')}>
       
          <Text style={styles.cardTitle}>Safest Route</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
      <View >
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.1, y: 0.2} } style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('nsf',{navigation})} >
          <Text style={styles.cardTitle}>Nearest Safe Spot</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
      <View >
      <LinearGradient colors={['#F6A684','#F61956']} start={{x: 0.1, y: 0.2} } style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('SOS')}>
          <Text style={styles.cardTitle}>S O S</Text>
        </TouchableOpacity>
        </LinearGradient>
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
    paddingTop: 40
  },
  card: {
    width: 350,
    height: 140,
    marginTop: 0,
    margin: 15,
    // marginBottom: 20,
    //borderColor: 'lightgrey',
    borderRadius: 14,
    //borderBottomWidth: 4,
    //borderRightWidth: 4,
    
    
    
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '500',
    color: 'white',
    marginLeft: 140,
    marginTop: 20,
  },
});
