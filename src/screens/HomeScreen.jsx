import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Choose Chat Type</Text>
      <Button
        title="Go to 1-on-1 Chat"
        onPress={() => navigation.navigate('OneToOneChat')}
      />
      <Button
        title="Go to Group Chat"
        onPress={() => navigation.navigate('GroupChat')}
        style={{ marginTop: 20 }} // Add margin for spacing
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
