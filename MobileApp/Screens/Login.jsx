// import { useState,useEffect } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import {DATABASE_API_KEY} from '@env'
// import {Button} from '@rneui/themed'
// const firebaseConfig = {
//   apiKey: DATABASE_API_KEY,
//   authDomain: "safestride-655dd.firebaseapp.com",
//   projectId: "safestride-655dd",
//   storageBucket: "safestride-655dd.appspot.com",
//   messagingSenderId: "485999909084",
//   appId: "1:485999909084:web:8f37313fe268cf3f6b7c19"
// };

// export default function Login({navigation}) {
// 	let db
//   useEffect(() => {
// 		const app = initializeApp(firebaseConfig)
//     db = getFirestore(app)
// 	}, [])
	
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async () => { 
//     // const users = collection(db,'users')
//     // const usercred = await getDocs(users)
//     // const temp =  usercred.docs.map(doc => doc.data());
//     // console.log(temp);
// 		navigation.navigate('Home')
//   };

//   return (
//     <View style={styles.container}>
//       <Button title={"Login"} type='solid'/>
//       <Text style={styles.heading}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry={true}
//       />
//       {/* <Butt */}
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     paddingBottom: '40%'
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     marginTop: 10
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#3498db',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop:60
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
// });

import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc,doc,setDoc, } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import {DATABASE_API_KEY} from '@env'

const firebaseConfig = {
  apiKey: DATABASE_API_KEY,
  authDomain: "safestride-655dd.firebaseapp.com",
  projectId: "safestride-655dd",
  storageBucket: "safestride-655dd.appspot.com",
  messagingSenderId: "485999909084",
  appId: "1:485999909084:web:8f37313fe268cf3f6b7c19"
};

const Login = ({navigation}) => {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = async () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    const userId = doc(db,'users',userEmail)
    const user = await getDoc(userId)
    if (!user.exists()) {
      alert('User dosen\'t exists')
      setLoading(false);
      return
    } else if (user.data().password != userPassword) {
      alert('Incorrect password')
      setLoading(false);
      return
    }
    ToastAndroid.show('Login Successfull',ToastAndroid.SHORT)
    setLoading(false);
    // navigation.navigate('Home')
    //     console.log(responseJson);
    //     // If server response message same as Data Matched
    //     if (responseJson.status === 'success') {
          await AsyncStorage.setItem('user_id', userEmail);
          navigation.replace('DrawerNavigationRoutes');
    //     } else {
    //       setErrortext(responseJson.msg);
    //       console.log('Please check your email id or password');
    //     }
    //   })
    //   .catch((error) => {
    //     //Hide Loader
    //     setLoading(false);
    //     console.error(error);
    //   });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/SafeStrideLogo.png')}
                style={{
                  width: Dimensions.get('window').width*0.7,
                  height: Dimensions.get('window').width*0.7,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('Register')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#106ffe',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#111',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: 'cornflowerblue',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});