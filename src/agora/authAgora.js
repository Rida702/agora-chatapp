import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (isInitialized, chatClient, username, chatToken) => {
  if (!isInitialized) {
    const message = 'Perform initialization first.';
    console.log(message);
    Alert.alert('Login Error', message);
    return false;  // Return false if initialization failed
  }

  try {
    console.log('start login ...');
    await chatClient.loginWithAgoraToken(username, chatToken);  
    const successMessage = 'Login operation successful.';
    console.log(successMessage);
    // Alert.alert('Login Success', successMessage);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('chatToken', chatToken);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    return true;  
  } catch (error) {
    const errorMessage = 'Login failed: ' + JSON.stringify(error);
    console.log(errorMessage);
    Alert.alert('Login Failed', errorMessage);
    return false; 
  }
};



export const logout = async (isInitialized, chatClient) => {
  if (isInitialized === false || isInitialized === undefined) {
    const message = 'Perform initialization first.';
    console.log(message);
    Alert.alert('Logout Error', message);
    return;
  }

  console.log('start logout ...');
  // Alert.alert('Logout', 'Starting logout operation...');

  await chatClient
    .logout()
    .then(() => {
      const successMessage = 'Logout operation successful.';
      console.log(successMessage);
      Alert.alert('Logout Success', successMessage);
    })
    .catch(reason => {
      const errorMessage = 'Logout failed: ' + JSON.stringify(reason);
      console.log(errorMessage);
      Alert.alert('Logout Error', errorMessage);
    });
};

//getAccessToken(): Promise<string>
export const getaccesstoken = async (chatClient) => {
  return await chatClient.getAccessToken()
    .then((response) => {
      console.log("Token Created Successfully", response)
      return response;
    })
    .catch((error) => {
      console.log("Error while generating token")
      return error;
    });
}

//renewAgoraToken(agoraToken: string): Promise<void>

//Check for current user login status
const getusername = async (chatClient) => {
  const user_name = await chatClient.getCurrentUsername();
  console.log("Username:", user_name);
  return user_name;
};




