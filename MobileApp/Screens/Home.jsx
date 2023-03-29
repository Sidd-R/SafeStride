import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('nearestsf')}>
          <Text style={styles.cardTitle}>Nearest Safe Spot</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('safestroute')}>
          <Text style={styles.cardTitle}>Safest Route</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('sos')}>
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
    height: 150,
    marginTop: 0,
    margin: 20,
    // marginBottom: 20,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
