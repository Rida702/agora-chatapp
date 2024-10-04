import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const GroupDetails = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params;

  // Dummy chat data
  const chatData = [
    { id: '1', sender: 'John', message: 'Hello everyone!', time: '2:30 PM' },
    { id: '2', sender: 'Jane', message: 'Welcome to the group!', time: '2:31 PM' },
    { id: '3', sender: 'Doe', message: 'What’s the agenda for today?', time: '2:32 PM' },
    // More dummy data...
  ];

  const renderChatItem = ({ item }) => (
    <View className="p-4 border-b border-blue-300">
      <Text className="font-bold">{item.sender}</Text>
      <Text className="text-gray-600">{item.message}</Text>
      <Text className="text-gray-400 text-xs">{item.time}</Text>
    </View>
  );

  const [message, setMessage] = React.useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Sending message: ${message}`);
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-blue-200 p-4">
        <Text className="text-xl font-bold">{groupName}</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }} // To prevent overlap with input box
      />

      {/* Input Section */}
      <View className="flex-row items-center p-4 border-t border-blue-300 bg-dark">
        <TextInput
          className="flex-1 border rounded-full p-2 border-gray-300"
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
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
