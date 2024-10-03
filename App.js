import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, Button } from 'react-native';
import { View, StyleSheet } from 'react-native'; // Added for styling

// Use relative imports
import HomeScreen from './src/screens/HomeScreen';
import OnetoOnechat from './src/screens/OnetoOnechat';
import GroupChat from './src/screens/GroupChat';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000', // Dark background for headers (optional)
          },
          headerTintColor: '#fff', // Header text color
          cardStyle: { backgroundColor: '#121212' }, // Dark background for screens
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OneToOneChat" component={OnetoOnechat} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
