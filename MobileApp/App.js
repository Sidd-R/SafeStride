import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Screens/Home';
import NearestSafeSpot from './Screens/NearestSafeSpot';
import Sos from './Screens/Sos';
import Login from './Screens/Login';
import DirectSpot from './Screens/DirectSpot';
import SafestRoute from './Screens/SafestRoute';

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
        <Drawer.Screen name="Home" component={Home} 
        options={{
          title:"Home",
          headerStyle:{
            backgroundColor: 'cadetblue',
            height:90,  
          },
          headerStatusBarHeight:25,
          headerTintColor:'black'
        }}/>
        <Drawer.Screen name="Nearest Safe Spot" component={NearestSafeSpot} />
        <Drawer.Screen name="Safest Route" component={SafestRoute} />
        <Drawer.Screen name="S.O.S" component={Sos} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="DirectSpot" component={DirectSpot} />
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
