import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Safest Route')}>
          <Text style={styles.cardTitle}>Safest Route</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('nsf',{navigation})} >
          <Text style={styles.cardTitle}>Nearest Safe Spot</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('SOS')}>
          <Text style={styles.cardTitle}>S O S</Text>
        </TouchableOpacity>
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
    width: '80%',
    height: 160,
    marginTop: 0,
    margin: 20,
    // marginBottom: 20,
    //backgroundColor: 'lightblue',
    borderRadius: 14,
    borderColor: '#106ffe',
    borderWidth: 4,
    borderBottomWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#106ffe',
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: 'white',
  },
});
