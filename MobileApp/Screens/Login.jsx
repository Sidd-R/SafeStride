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
import { LinearGradient } from 'expo-linear-gradient';
import { getDoc,doc, } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import {db} from '../dbconfig';

const Login = ({navigation}) => {
  // const app = initializeApp(dbconfig)
  // const db = getFirestore(app)

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
    // const userId = doc(db,'users',userEmail)
    // const user = await getDoc(userId)
    // if (!user.exists()) {
    //   alert('User dosen\'t exists')
    //   setLoading(false);
    //   return
    // } else if (user.data().password != userPassword) {
    //   alert('Incorrect password')
    //   setLoading(false);
    //   return
    // }
    // ToastAndroid.show('Login Successfull',ToastAndroid.SHORT)
    // setLoading(false);
    // const {email,name,phone1} = user.data()
    // await AsyncStorage.setItem('email', email);
    // await AsyncStorage.setItem('name', name);
    // await AsyncStorage.setItem('phone', phone1);
    navigation.replace('DrawerNavigationRoutes');
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
            <View style={{alignItems: 'center',
          alignContent: 'center'}}>
              <Image
                source={require('../assets/SafeStrideLogo.png')}
                style={{
                  marginLeft: 15,
                  width: Dimensions.get('window').width*1.2,
                  height: Dimensions.get('window').width*0.99,
                  resizeMode: 'contain',
                  //margin: 20,
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
             <LinearGradient colors={['#F6A684','#F61956']}  style={styles.buttonStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            </LinearGradient>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('Register')}>
              <Text className='text-black'>New Here ? </Text>
              Register
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
    marginTop: 10,
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
    color: 'red',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: 'red',
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