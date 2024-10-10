import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, registerMessageListener } from '../agora/groupManager';

import AgoraContext from '../context/AgoraContext';
import ImagePicker from 'react-native-image-crop-picker';
import UploadFiles from '../components/UploadFiles';

const GroupDetails = ({ navigation }) => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const { groupId, groupName } = useRoute().params;

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState('');

  const fetchMessages = async () => {
    const updatedMessages = await receivemessages(isInitialized, chatClient, groupId);
    setChats(updatedMessages);
  };

  useEffect(() => {
    fetchMessages();
    chatClient.getCurrentUsername().then(setUsername).catch(console.log);

    const messageListener = registerMessageListener(chatClient, groupId, setChats);
    return () => {
      chatClient.chatManager.removeMessageListener(messageListener);
    };

  }, []);

  const handleSendMessage = async () => {
    const msg = await sendmsg(isInitialized, chatClient, groupId, message);
    console.log('Group Received Message: ', msg);
    setChats(prevChats => [...prevChats, msg]);
    setMessage('');
  };

  const pickImage = async () => {
    await ImagePicker.openPicker({
      multiple: true,
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
    });
  }


  const renderChatItem = ({ item }) => (
    <View
      className={`p-2 border-b rounded-2xl max-w-xs mb-4 ${item.sender === username ? 'bg-blue-600 self-end mr-4' : 'bg-green-500 self-start ml-4'
        }`}
    >
      <Text className="text-white font-bold">{item.sender}</Text>
      <Text className="text-white">{item.message}</Text>
    </View>

  );

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-dark p-4">
        <View className="flex-row justify-between items-center p-4">
          <Text className="text-2xl font-bold">{groupName}</Text>
          <TouchableOpacity
            className="ml-2 bg-blue-500 p-3 rounded-full"
            onPress={() => navigation.navigate('GroupInfo', { groupId: groupId, groupName: groupName })}
          >
            <Text className="text-white">Group Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Input Section */}
      <View className="flex-row items-center p-4 border-t border-0 bg-dark">
        <TextInput
          className="flex-1 border rounded-full p-2 border-gray-300"
          placeholder="Type your message..."
          onChangeText={text => setMessage(text)}
          value={message}
        />
        <UploadFiles/>
        {/* <TouchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-full"
          // onPress={pickImage}
        >
          <Image source={require('../../assets/icons/attach-file.png')}
            resizeMode="contain" className="w-6 h-6" />
        </TouchableOpacity> */}

        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-full"
        // onPress={sendVoiceMessage}
        >
          <Image source={require('../../assets/icons/voice-message.png')}
            resizeMode="contain" className="w-6 h-6" />
        </TouchableOpacity>

        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2.5 rounded-full"
          onPress={handleSendMessage}
        >
          <Text className="text-black">Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GroupDetails;
