import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, Button } from 'react-native';
import { View, StyleSheet } from 'react-native'; // Added for styling

// Use relative imports
import HomeScreen from './src/screens/HomeScreen';
import OnetoOnechat from './src/screens/OnetoOnechat';
import GroupChat from './src/screens/GroupChat';
import ShowGroup from './src/screens/ShowGroup';
import GroupDetails from './src/screens/GroupDetails';
import { AgoraProvider } from './src/context/AgoraContext';
import GroupInfo from './src/screens/GroupInfo';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AgoraProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="GroupChat"
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            cardStyle: { backgroundColor: '#121212' },
          }}
        >
          <Stack.Screen name="GroupChat" component={GroupChat} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OneToOneChat" component={OnetoOnechat} />
          <Stack.Screen name="ShowGroup" component={ShowGroup} />
          <Stack.Screen name="GroupDetails" component={GroupDetails} />
          <Stack.Screen name="GroupInfo" component={GroupInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </AgoraProvider>
  );
};

export default App;
