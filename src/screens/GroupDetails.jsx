import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, getmessage } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';

const GroupDetails = () => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const route = useRoute();
  const { groupId, groupName } = route.params;

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await receivemessages(isInitialized, chatClient, groupId);
        setChats(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [isInitialized, chatClient, groupId]);

  const renderChatItem = ({ item }) => (
    <View className="p-4 border-b border-blue-300">
      <Text className="text-blue-300 font-bold">{item.sender}</Text>
      <Text className="text-white-600 text-sm">{item.message}</Text>
    </View>
  );

  const [message, setMessage] = React.useState('');

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-blue-600 p-4">
        <Text className="text-xl font-bold">Group Name: {groupName}</Text>
        <Text className="text-xl font-bold">Group ID: {groupId}</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Input Section */}
      <View className="flex-row items-center p-4 border-t border-blue-300 bg-dark">
        <TextInput
          className="flex-1 border rounded-full p-2 border-gray-300"
          placeholder="Type your message..."
          onChangeText={text => setMessage(text)}
          value={message}
        />
        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2 rounded-full"
          onPress={() => {
            sendmsg(isInitialized, chatClient, groupId, message).then(() => {
              receivemessages(isInitialized, chatClient, groupId).then(updatedMessages => {
              setChats(updatedMessages);
              });
              setMessage('');
            });
          }}
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GroupDetails;
