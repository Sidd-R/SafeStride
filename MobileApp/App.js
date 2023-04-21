// import { StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer} from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createTheme, ThemeProvider} from'@rneui/themed'
// import Home from './Screens/Home';
// import NearestSafeSpot from './Screens/NearestSafeSpot';
// import Sos from './Screens/Sos';
// import Login from './Screens/Login';
// import DirectSpot from './Screens/DirectSpot';
// import SafestRoute from './Screens/SafestRoute';
// import Register from './Screens/Register';

// // Navigation
// const Drawer = createDrawerNavigator();

// export default function App() {
//   const theme = createTheme({
//     lightColors: {
//       primary: 'rgb(32, 136, 192)',
//     },
//     darkColors: {
//       primary: 'black',
//     },
//     mode: 'light',
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <NavigationContainer>
//         <Drawer.Navigator initialRouteName="Home">
//           {/* <Drawer.Screen name="Home" component={MainStackNavigator} /> */}
//           <Drawer.Screen name="Home" component={Home} 
//           options={{
//             title:"Home",
//             headerStyle:{
//               backgroundColor: 'cadetblue',
//               height:90,  
//             },
//             headerStatusBarHeight:25,
//             headerTintColor:'black'
//           }}/>
//           <Drawer.Screen name="Nearest Safe Spot" component={NearestSafeSpot} />
//           <Drawer.Screen name="Safest Route" component={SafestRoute} />
//           <Drawer.Screen name="S.O.S" component={Sos} />
//           <Drawer.Screen name="Login" component={Login} options={{headerShown:false,}}/>
//           <Drawer.Screen name="DirectSpot" component={DirectSpot} />
//           <Drawer.Screen name="Register" component={Register} options={{headerShown:false,}}/>
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </ThemeProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
// });


// // Example of Splash, Login and Sign Up in React Native
// // https://aboutreact.com/react-native-login-and-signup/
// import 'react-native-gesture-handler';

// Import React and Component
import React from 'react';
import { Text } from 'react-native';
// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Screens
import SplashScreen from './Screens/SplashScreen';
import Login from './Screens/Login';
import Register from './Screens/Register';
import DrawerNavigationRoutes from './Screens/DrawerNavigationRoutes';

const Stack = createNativeStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
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
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;