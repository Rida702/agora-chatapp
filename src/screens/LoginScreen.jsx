import React, { useContext } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
//To initialize Agora SDK
import AgoraContext from '../context/AgoraContext';
//Authorize User
import { login, logout } from '../agora/Group/helpers';


const LoginScreen = ({ navigation }) => {
    const { chatClient } = useContext(AgoraContext);
    const title = 'Group Chat App';
    const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME);
    const [chatToken, setChatToken] = React.useState(process.env.REACT_APP_CHAT_TOKEN);
    
    const handleLogin = async () => {
        const success = await login(chatClient, username, chatToken);
        console.log(success)
        if (success) {
            Alert.alert('Login Successful');
            navigation.replace('HomeScreen');
        } else {
            Alert.alert('Login failed. Please check your credentials.');
        }
    };

    // Renders the UI.
    return (
        <SafeAreaView>
            <View className="bg-blue-500 h-15">
                <Text className="text-white text-2xl font-bold pl-4 leading-relaxed h-10 mt-2">{title}</Text>
            </View>
            <View className="w-[90%] mx-auto border-b border-gray-300 h-15">
                <TextInput
                    multiline
                    className="mt-4 w-full text-base font-bold"
                    placeholder="Enter username"
                    onChangeText={text => setUsername(text)}
                    value={username}
                />
            </View>
            <View className="w-[90%] mx-auto border-b border-gray-300 h-15 mt-3">
                <TextInput
                    multiline
                    className="mt-4 w-full text-base font-bold"
                    placeholder="Enter Token"
                    onChangeText={text => setChatToken(text)}
                    value={chatToken}
                />
            </View>
            <View className="flex-row justify-around mt-5 h-10 items-center w-[96%] mx-auto">
                <TouchableOpacity className="bg-blue-500 h-10 w-[28%] rounded" onPress={handleLogin}>
                    <Text className="text-white text-center font-bold mt-2">
                        SIGN IN
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-500 h-10 w-[28%] rounded" onPress={() => logout(chatClient)}>
                    <Text className="text-white text-center font-bold mt-2">
                        SIGN OUT
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
