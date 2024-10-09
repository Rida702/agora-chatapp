import { View, Image, Alert } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AgoraContext from '../context/AgoraContext';
import { login } from '../agora/authAgora';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
    const navigation = useNavigation();
    const { chatClient, isInitialized} = useContext(AgoraContext);

    useEffect(() => {
        const checkLoginStatus = async () => {
            if (isInitialized) {
                console.log("SDK Initialized", isInitialized);
                const isLoggedIn = await chatClient.isLoginBefore();
                const username = await AsyncStorage.getItem('username');
                const chatToken = await AsyncStorage.getItem('chatToken');
                console.log("isLoggedIn", isLoggedIn)
                if (isLoggedIn) {
                    const success = await login(isInitialized, chatClient, username, chatToken);
                    navigation.replace('HomeScreen'); 
                } else {
                    navigation.replace('LoginScreen');
                }
            } else {
                console.log('Agora SDK is not initialized yet.');
            }
        };
        checkLoginStatus();
    }, [isInitialized, chatClient]);

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Image
                source={require('../../assets/images/splash_screen.png')}
                className="w-3/4 h-3/4"
                resizeMode="contain"
            />
        </View>
    );
};

export default SplashScreen;
