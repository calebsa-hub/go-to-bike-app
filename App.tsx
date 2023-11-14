import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/pages/home'
import MapScreen from './src/pages/map/MapaScreen'
import SettingsScreen from './src/pages/settings'
import SQLiteManager from './src/database/SQLiteManager';
// function HomeScreen() {
//   return (
   
//   );
// }

// function MapScreen() {
//   return (
//     <View style={styles.mapScreen}>

//     </View>
//   );
// }

// function HistoryScreen() {
//   return (
//     <View style={styles.historyScreen}>
//       <Text>Histórico!</Text>
//       <View style={{backgroundColor: "red"}}>
//         <Text>Opa</Text>
//       </View>
//     </View>
//   );
// }
//const banco = new SQLiteManager();
//banco.initDB();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle:{
            backgroundColor: "#1C2120",
          },
          headerTitleStyle: {
            color: 'white',
          },
          tabBarStyle: {
            backgroundColor: "#62BA44",
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'white',
        })}
      >
        
        <Tab.Screen name="Início" component={HomeScreen} 
        options={{
          //tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={30} color="white"/>
          ),
        }}/>
        <Tab.Screen name="Mapa" component={MapScreen}
        options={{
          //tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={30} color="white"/>
          ),
        }}/>
        <Tab.Screen name="Ajustes" component={SettingsScreen}
        options={{
          //tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={30} color="white"/>
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

