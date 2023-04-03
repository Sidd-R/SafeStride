import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useState,useEffect} from 'react';
import * as Location from 'expo-location';
import NearestSafeSpot from './NearestSafeSpot';
import axios from 'axios'

 export default function Sos ({navigation}) {
  const [phone1,setPhone1]=useState("");
  const [phone2,setPhone2]=useState("");
  const sendSOS = async () => {
    try {
      
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        myHeaders.append("Authorization", "Basic QUM4NWNjNzRhNGE0NDBiZmNkODJhODdhZjM3MzllNmFhZDozYTc2OGJkZDE5NDMwYjY5ODkzZjMxYmNjNDE5M2E2Ng==");
        let location = await Location.getCurrentPositionAsync({});
        let { latitude, longitude } = location.coords;
        var details = {

          'Body': `I am in danger. My current location is ${latitude},${longitude}`,
          'To': '+917021746420',
          'From': '+15855952432'
        }

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formBody
      };

      

       fetch("https://api.twilio.com/2010-04-01/Accounts/AC85cc74a4a440bfcd82a87af3739e6aad/Messages.json", requestOptions)
         .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      console.log('sos snet');
      

    }
    catch (error) {
        console.log("Error");
    }
}
  const [sosRequested, setSosRequested] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sosSent, setSosSent] = useState(false);
  const [buttonbg, setButtonbg] = useState('#D12222');

  useEffect(() => {
    let timeoutId = null;
    if (sosRequested) {
      timeoutId = setTimeout(() => {
        // Send SOS request here
        setSosRequested(false);
        setSecondsLeft(0);
        sendSOS()
        setSosSent(true)
        setButtonbg('green')
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [sosRequested]);

  const handleSosPress = () => {
    if (sosRequested) {
      setSosRequested(false);
      console.log('Cancelled SOS request');
      setSecondsLeft(0);
    } else {
      setSosRequested(true);
      console.log('SOS requested');
      setSecondsLeft(5);
    }
  };

  useEffect(() => {
    let timerId = null;
    if (sosRequested && secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [sosRequested, secondsLeft]);
  
  return(
    <View style={styles.container}>
      <TouchableOpacity style={[styles.sosButton,{backgroundColor:buttonbg},]} onPress={handleSosPress} disabled={sosSent}>
        <Text style={styles.sosButtonText} >{sosRequested ? 'STOP' : sosSent?"SENT":'SOS'}</Text>
      </TouchableOpacity>
      {sosRequested && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{secondsLeft} seconds left</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: Dimensions.get('window').width*0.8,
    height: Dimensions.get('window').width*0.8,
    borderRadius: Dimensions.get('window').width*0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: 'bold',
  },
});