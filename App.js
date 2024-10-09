import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image } from 'react-native';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import ShowGroup from './src/components/ShowGroup';
import GroupDetails from './src/screens/GroupDetails';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen'; 
import SplashScreen from './src/screens/SplashScreen'
import CreateGroup from './src/components/CreateGroup';

import { AgoraProvider } from './src/context/AgoraContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, color, focused }) => {
  return (
    <View className="items-center justify-center gap-0"
    style={{ paddingTop: 19 }}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
      >
      </Text>
    </View>
  );
};

// Define HomeTabs for Home and Profile Tab
const HomeTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: 'white',
      },
      sceneContainerStyle: {
        backgroundColor: '#121212',
      },
      tabBarIcon: ({ color, focused }) => {
        let icon;
        let name;

        if (route.name === 'Home') {
          icon = require('../chatapp/assets/icons/home.png');
        } else if (route.name === 'Profile') {
          icon = require('../chatapp/assets/icons/profile.png');
        }

        return <TabIcon icon={icon} color={color} focused={focused} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);


const App = () => {
  return (
    <AgoraProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={"SplashScreen"}
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            cardStyle: { backgroundColor: '#121212' },
          }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeTabs} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="ShowGroup" component={ShowGroup} />
          <Stack.Screen name="GroupDetails" component={GroupDetails} />
          {/* <Stack.Screen name="GroupInfo" component={GroupInfo} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AgoraProvider>
  );
};

export default App;
