import { useState,useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {DATABASE_API_KEY} from '@env'
import {Button} from '@rneui/themed'
const firebaseConfig = {
  apiKey: DATABASE_API_KEY,
  authDomain: "safestride-655dd.firebaseapp.com",
  projectId: "safestride-655dd",
  storageBucket: "safestride-655dd.appspot.com",
  messagingSenderId: "485999909084",
  appId: "1:485999909084:web:8f37313fe268cf3f6b7c19"
};

export default function Login({navigation}) {
	let db
  useEffect(() => {
		const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
	}, [])
	
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => { 
    // const users = collection(db,'users')
    // const usercred = await getDocs(users)
    // const temp =  usercred.docs.map(doc => doc.data());
    // console.log(temp);
		navigation.navigate('Home')
  };

  return (
    <View style={styles.container}>
      <Button/>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      {/* <Butt */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: '40%'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    marginTop: 10
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:60
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
