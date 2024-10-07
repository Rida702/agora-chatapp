import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, getmessage, getGroupInfo } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';
import { getusername } from '../agora/authAgora'

const GroupDetails = ({ navigation }) => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const route = useRoute();
  const { groupId, groupName } = route.params;

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [username, setUsername] = useState('');


  useEffect(() => {
    receivemessages(isInitialized, chatClient, groupId)
      .then(updatedMessages => {
        setChats(updatedMessages);
      })
      .catch(error => {
        console.log('Error fetching messages:', error);
      });
    chatClient.getCurrentUsername()
      .then(Username => {
        setUsername(Username);
      })
      .catch(error => {
        console.log('Error fetching messages:', error);
      });

  }, [messageSent]);

  const handleSendMessage = async () => {
    await sendmsg(isInitialized, chatClient, groupId, message)
      .then(() => {
        setMessage('');
        setMessageSent(prev => !prev);
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
  };

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
            // onPress={() => getGroupInfo(isInitialized, chatClient, groupId)}
            onPress={async () => {
              navigation.navigate('GroupInfo', { groupId: groupId, groupName: groupName });
            }}
          >
            <Text className="text-white">Group Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
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
        <TouchableOpacity uchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-full"
          onPress={handleSendMessage}
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GroupDetails;
