// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, Button } from 'react-native';


// const Stack = createNativeStackNavigator()
// function h (){
//   return (<View><Text>Hello</Text></View>)
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name='home' component={Home} options={{title:"Home",animation:"flip",header:h}}/>
//         <Stack.Screen name='nearestsf' component={NearestSafeSpot} options={{title:"Nearest Safe Spot"}}/>
//         <Stack.Screen name='safestroute' component={SafestRoute} options={{title:"Safest Route"}}/>
//         <Stack.Screen name='sos' component={Sos} options={{title:"S.O.S"}}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Screens/Home';
import NearestSafeSpot from './Screens/NearestSafeSpot';
import SafestRoute from './Screens/SafestRoute';
import Sos from './Screens/Sos';
import Login from './Screens/Login';

// Navigation
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// function MainStackNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name='home' component={Home} options={{title:"Home",animation:"flip"}}/>
//       <Stack.Screen name='nearestsf' component={NearestSafeSpot} options={{title:"Nearest Safe Spot"}}/>
//       <Stack.Screen name='safestroute' component={SafestRoute} options={{title:"Safest Route"}}/>
//       <Stack.Screen name='sos' component={Sos} options={{title:"S.O.S"}}/>
//       <Stack.Screen name='login' component={Login} options={{title:"Login"}}/>
//     </Stack.Navigator>
//   );
// }

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        {/* <Drawer.Screen name="Home" component={MainStackNavigator} /> */}
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Nearest Safe Spot" component={NearestSafeSpot} />
        <Drawer.Screen name="Safest Route" component={SafestRoute} />
        <Drawer.Screen name="S.O.S" component={Sos} />
        <Drawer.Screen name="Login" component={Login} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
