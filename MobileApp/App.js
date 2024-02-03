import React, { useEffect,useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { getDoc,doc, } from 'firebase/firestore';
import Constants  from 'expo-constants';

// Import Screens
import SplashScreen from './Screens/SplashScreen';
import Login from './Screens/Login';
import Home from './Screens/Home'
import Register from './Screens/Register';
import DrawerNavigationRoutes from './Screens/DrawerNavigationRoutes';
import { db } from './dbconfig';
import SafestRoute from './Screens/SafestRoute';
import NearestSafeSpot from './Screens/NearestSafeSpot';
import Sos from './Screens/Sos'
import SafetyIndex from './Screens/SafetyIndex'
const Stack = createNativeStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      /><Stack.Screen
      name="Home"
      component={Home}
      options={{headerShown: false}}
    />
  
    <Stack.Screen
      name="SafestRoute"
      component={SafestRoute}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SafetyIndex"
      component={SafetyIndex}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="NFS"
      component={NearestSafeSpot}
      options={{headerShown: false}}
    />
    
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const [uri, setUri] = useState(null)
  const getUri = async () => {
    const userId = doc(db,'backend','uri')
    const user = await getDoc(userId)
    const {uri} = user.data();
    setUri(uri)
    // const { manifest } = Constants;
    // // const { manifest } = Constants;
    //   const uriT = `http://${manifest.debuggerHost.split(':').shift()}:3010`;
    //   console.log(uriT);
    // // const temp = `http://192.168.0.218:3010`;
    // // console.log(temp,"kk");
    // setUri('https://fbad-125-99-120-242.ngrok-free.app')
  }
  useEffect(() => {  
    getUri()
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
          initialParams={{uri:uri}}
          
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;