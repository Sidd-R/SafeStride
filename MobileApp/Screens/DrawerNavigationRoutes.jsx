// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import Home from './Home';
import Sos from './Sos'
// import SettingsScreen from './DrawerScreens/SettingsScreen';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import NavigationDrawerHeader from '../components/NavigationDrawerHeader';
import NearestSafeSpot from './NearestSafeSpot';
import SafestRoute from './SafestRoute';
import DirectSpot from './DirectSpot';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#106ffe', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SOSScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SOS"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#106ffe', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SOs"
        component={Sos}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const NFSScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="nfs"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#106ffe', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="nfs"
        component={NearestSafeSpot}
        options={{
          title: 'Nearby Safe Spots', //Set Header Title
        }}
      />
      <Stack.Screen
        name="DirectSpot"
        component={DirectSpot}
        options={{
          title: 'Safe Spot', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const SSScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="Safest Route"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#106ffe', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Safest Route1"
        component={SafestRoute}
        options={{
          title: 'Safest Route', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
        screenOptions={{headerShown: false}}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="home"
        options={{drawerLabel: 'Home',drawerLabelStyle:{color: 'white'}}}
        component={HomeStack}
      />
      <Drawer.Screen
        name="SOS"
        options={{drawerLabel: 'SOS',drawerLabelStyle:{color: 'white'}}}
        component={SOSScreenStack}
      />
      <Drawer.Screen 
       name='nsf' 
       options={{drawerLabel: 'Nearby SafeSpots',drawerLabelStyle:{color: 'white'}}}
       component={NFSScreenStack}
      />
      <Drawer.Screen
        name='Safest Route'
        options={{drawerLabel: 'Safest Route',drawerLabelStyle:{color: 'white'}}}
        component={SSScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;