import { StyleSheet, Text, View, Button, TextInput,Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {useState} from 'react';
import NearestSafeSpot from './NearestSafeSpot';

 export default function Sos ({navigation}) {
  const [phone1,setPhone1]=useState("");
  const [phone2,setPhone2]=useState("");
  const saveNumbers = async () => {
    try {
        await  fetch(("http://localhost:3010/sendMessage"),{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ph1: `${phone1}` })
      })
            .then(response => {
                response.json()
                    .then(() => {
                        Alert.alert("Data sent to backend");
                    });
            })
    }
    catch (error) {
        console.error(error);
    }
}
  
  return(
    <View style={styles.container}>
      <Text >Enter two numbers for emergency contact</Text>
      <TextInput placeholder='Enter number 1' 
      style={styles.input}
      onChangeText={(phone)=>setPhone1(phone)}/>
      <TextInput placeholder='Enter number 2' 
      style={styles.input}
      onChangeText={(phone)=>setPhone2(phone)}/>
      <Button
        title="Press me"
        onPress={saveNumbers}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
