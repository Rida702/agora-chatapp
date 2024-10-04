import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { AgoraProvider } from './context/AgoraContext';

const App = ({ navigation }) => {
  return (
    <>
      <AgoraProvider>
        <SafeAreaView>
          <Text>Src Directory Hello, React Native!</Text>
          <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />

        </SafeAreaView>
      </AgoraProvider>
    </>
  );
};

export default App;
