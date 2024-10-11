import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, registerMessageListener } from '../agora/groupManager';

import AgoraContext from '../context/AgoraContext';
import UploadFiles from '../components/UploadFiles';
import { ChatMessageType } from 'react-native-agora-chat';

const GroupDetails = ({ navigation }) => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const { groupId, groupName } = useRoute().params;
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState('');
  let filePath;
  let displayName;
  let width;
  let height;

  const fetchMessages = async () => {
    const updatedMessages = await receivemessages(isInitialized, chatClient, groupId);
    console.log("CHATS: ", updatedMessages)
    setChats(updatedMessages);
  };

  useEffect(() => {
    fetchMessages();
    chatClient.getCurrentUsername().then(setUsername).catch(console.log);

    const messageListener = registerMessageListener(chatClient, groupId, setChats);
    console.log("messageListener Chats: ", chats)
    return () => {
      chatClient.chatManager.removeMessageListener(messageListener);
    };

  }, [filePath, displayName]);

  const getUniqueChats = (chats) => {
    const seenIds = new Set();
    return chats.filter((chat) => {
      if (seenIds.has(chat.id)) {
        return false;
      }
      seenIds.add(chat.id);
      return true;
    });
  };

  const setImageData = async (pickedImage) => {
    filePath = pickedImage.fileUri;
    displayName = pickedImage.fileName;
    width = 150;
    height = 150;
    await handleSendMessage({ messageType: ChatMessageType.IMAGE });
  }

  const handleSendMessage = async ({ messageType = null }) => {
    let msg;
    if (messageType === ChatMessageType.TXT) {
      msg = await sendmsg({
        isInitialized, chatClient, groupId, messageType,
        message
      });
      setChats(prevChats => [...prevChats, { id: msg.id, message: msg.message, sender: msg.sender, type: 'txt' }]);
      setMessage('');
    } else if (messageType === ChatMessageType.IMAGE) {
      msg = await sendmsg({
        isInitialized, chatClient, groupId, messageType,
        filePath,
        displayName,
        width,
        height,
      });
      setChats(prevChats => [...prevChats, { id: msg.id, image: msg.image, sender: msg.sender, type: 'img' }]);
    }

  };


  const renderChatItem = ({ item }) => {
    return (
      <View
        className={`p-2 border-b rounded-2xl max-w-xs mb-4 ${item.sender === username ?
          item.type !== 'img' ? 'bg-blue-600 self-end mr-4' : 'self-end mr-4' :
          item.type !== 'img' ? 'bg-green-500 self-start ml-4' : 'self-start ml-4'}`}
      >
        <Text className="text-white font-bold text-lg">{item.sender}</Text>

        {/* Conditional rendering based on message type */}
        {item.type === 'txt' ? (
          <Text className="text-white">{item.message}</Text>
        ) : item.type === 'img' && item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 150, height: 150 }}
            className="rounded-lg mt-2 bg-blue-400"
          />
        ) : null}
      </View>
    );
  };



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
        data={getUniqueChats(chats)}
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
        <UploadFiles setImageData={setImageData} />

        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-full"
        // onPress={sendVoiceMessage}
        >
          <Image source={require('../../assets/icons/voice-message.png')}
            resizeMode="contain" className="w-6 h-6" />
        </TouchableOpacity>

        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2.5 rounded-full"
          onPress={() => handleSendMessage({ messageType: ChatMessageType.TXT })}
        >
          <Text className="text-black">Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GroupDetails;
