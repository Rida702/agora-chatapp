import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';

const GroupDetails = ({ navigation }) => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const { groupId, groupName } = useRoute().params;

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const updatedMessages = await receivemessages(isInitialized, chatClient, groupId);
        setChats(prev => [
          ...prev.filter(chat => !chat.temporary),
          ...updatedMessages.filter(msg => !prev.some(chat => chat.id === msg.id)),
        ]);
      } catch (error) {
        console.log('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    chatClient.getCurrentUsername().then(setUsername).catch(console.log);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const tempId = Date.now().toString();
    const newMessage = { id: tempId, sender: username, message, temporary: true };
    setChats(prev => [...prev, newMessage]);

    try {
      await sendmsg(isInitialized, chatClient, groupId, message);
      setMessage('');
    } catch (error) {
      console.log('Error sending message:', error);
    }
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
            onPress={() => navigation.navigate('GroupInfo', { groupId: groupId, groupName: groupName })}
          >
            <Text className="text-white">Group Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-white">Loading chat...</Text>
        </View>
      ) : (

        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

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
