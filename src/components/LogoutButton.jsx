import React, { useContext } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../agora/Group/helpers';
import AgoraContext from '../context/AgoraContext';

const LogoutButton = () => {
  const { chatClient } = useContext(AgoraContext);
  const navigation = useNavigation(); // Access the navigation object

  const handleLogout = async () => {
    await logout(chatClient);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (

    <TouchableOpacity
      className="w-full items-end mb-3 mt-5 px-4"
      onPress={handleLogout}
    >
      <Image source={require('../../assets/icons/logout.png')}
        resizeMode="contain" className="w-6 h-6" />
    </TouchableOpacity>
  );
};

export default LogoutButton;
