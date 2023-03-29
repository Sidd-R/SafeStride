import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

const Temp = ({navigation}) => {
  return(
    <View style={styles.container}>
      <Text className={"text-red-600 bg-slate-500"}>screen1</Text>
      <Button
      title="Go to screen2"
      onPress={() =>
        navigation.navigate('Screen2f', {name: 'Jane'})
      }
    />
      <StatusBar style="auto" />
    </View>
  )
}

const Temp1 = ({navigation}) => {
  return(
    <View style={styles.container}>
      <Text className={"text-red-600 bg-slate-500"}>screen2</Text>
      <Button
      title="Go screen 1"
      onPress={() =>
        navigation.navigate('Screen1f', {name: 'Jane'})
      }
    />
      <StatusBar style="auto" />
    </View>
  )
}

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Screen1f' component={Temp} options={{title:"screen1"}}/>
        <Stack.Screen name='Screen2f' component={Temp1} options={{title:"screen2"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
