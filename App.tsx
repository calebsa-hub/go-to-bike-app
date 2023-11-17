import * as React from 'react';
import { ThemeProvider } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/pages/home'
import MapScreen from './src/pages/map/MapaScreen'
import SettingsScreen from './src/pages/settings'

const Tab = createBottomTabNavigator();

const App = () => {

  const screenOptions = {
    headerStyle:{
      backgroundColor: '#62BA44',
    },
    headerTitleStyle: {
      color: 'white',
    },
    tabBarStyle: {
      backgroundColor: '#62BA44',
    },
    tabBarActiveTintColor: 'black',
    tabBarInactiveTintColor: 'white',
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={screenOptions}
        >
          
          <Tab.Screen name="Início" component={HomeScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={30} color="white"/>
            ),
          }}/>
          <Tab.Screen name="Mapa" component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" size={30} color="white"/>
            ),
          }}/>
          <Tab.Screen name="Ajustes" component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" size={30} color="white"/>
            ),
          }}/>
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;

