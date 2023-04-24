
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useState,useEffect} from 'react';
import * as Location from 'expo-location';
import NearestSafeSpot from './NearestSafeSpot';
import axios from 'axios'
import Constants from "expo-constants";
import { uri } from '../uri';


export default function Sos ({navigation}) {
  
  const sendSOS = async () => {
    try {
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      // myHeaders.append("Authorization", "Basic QUM4NWNjNzRhNGE0NDBiZmNkODJhODdhZjM3MzllNmFhZDozYTc2OGJkZDE5NDMwYjY5ODkzZjMxYmNjNDE5M2E2Ng==");

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;

      var details = {
        'Body': 'msg from frntd',
        'To': '+917021746420',
        'From': '+15855952432',

      }

      // var formBody = [];
      // for (var property in details) {
      //   var encodedKey = encodeURIComponent(property);
      //   var encodedValue = encodeURIComponent(details[property]);
      //   formBody.push(encodedKey + "=" + encodedValue);
      // }
      // formBody = formBody.join("&");

      //   var requestOptions = {
      //     method: 'POST',
      //     headers: myHeaders,
      //     body: formBody
      // };

      // const { manifest } = Constants;
      // const uri = `http://${manifest.debuggerHost.split(':').shift()}:3010`;
      // const uri = 'https://99a5-2409-40c0-6c-4c4f-cd4c-7ec9-5e46-d88e.ngrok-free.app'

      await axios.post(uri+'/sos/sms',{latitude:latitude,longitude:longitude}).then(data => console.log(data.data))
                  .catch(err => {
                    console.error(err)
                    alert('sos Failed')
                  })
      await axios.get(uri+'/sos/call',).then(data => console.log(data.data))
                .catch(err => {
                  console.error(err)
                  alert('sos Failed')
                  setSosSent(false)
                  return
                })

      //  await fetch("https://api.twilio.com/2010-04-01/Accounts/AC85cc74a4a440bfcd82a87af3739e6aad/Messages.json", requestOptions)
      //    .then(response => response.text())
      //   .then(result => console.log(result))
      //   .catch(error => console.log('error', error));
      console.log('sos sent');
      ToastAndroid.show('SOS Sent Successfully',ToastAndroid.SHORT)
      

    }
    catch (error) {
        console.log(error);
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
        // setSosSent(true)
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
