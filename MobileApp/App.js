import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Home from './Screens/Home';
import NearestSafeSpot from './Screens/NearestSafeSpot';
import SafestRoute from './Screens/SafestRoute';
import Sos from './Screens/Sos';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='home' component={Home} options={{title:"Home"}}/>
        <Stack.Screen name='nearestsf' component={NearestSafeSpot} options={{title:"Nearest Safe Spot"}}/>
        <Stack.Screen name='safestroute' component={SafestRoute} options={{title:"Safest Route"}}/>
        <Stack.Screen name='sos' component={Sos} options={{title:"S.O.S"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}