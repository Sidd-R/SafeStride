import { StyleSheet, Text, View, Button, TextInput,Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {useState} from 'react';
import NearestSafeSpot from './NearestSafeSpot';
import axios from 'axios'

 export default function Sos ({navigation}) {
  const [phone1,setPhone1]=useState("");
  const [phone2,setPhone2]=useState("");
  const saveNumbers = async () => {
    navigation.navigate('Home')
    try {
      // await axios.get("http://10.0.2.2:3010/").then(data => console.log(data.data))
        await  fetch(("http://10.0.2.2:3010/sendMessage"),{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ph1: `${phone1}` })
      })
            .then((res) => {
                      console.log(res.data);
            })
    }
    catch (error) {
        console.log("Error");
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
