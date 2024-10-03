import React from 'react';
import { SafeAreaView, Text } from 'react-native';

const App = ({navigation}) => {
  return (
    <SafeAreaView>
      <Text>Src Directory Hello, React Native!</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />

    </SafeAreaView>
  );
};

export default App;
