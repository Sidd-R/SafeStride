import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createTheme, ThemeProvider} from'@rneui/themed'
import Home from './Screens/Home';
import NearestSafeSpot from './Screens/NearestSafeSpot';
import Sos from './Screens/Sos';
import Login from './Screens/Login';
import DirectSpot from './Screens/DirectSpot';
import SafestRoute from './Screens/SafestRoute';

// Navigation
const Drawer = createDrawerNavigator();

export default function App() {
  const theme = createTheme({
    lightColors: {
      primary: '#f00',
    },
    darkColors: {
      primary: '#0f0',
    },
    mode: 'light',
  });

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
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
