import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ShowGroup = () => {
  const route = useRoute(); 
  const navigation = useNavigation(); // Access navigation
  const { joinedGroups } = route.params;

  const handleItemPress = (group) => {
    // Navigate to another screen or perform any action
    navigation.navigate('GroupDetails', { groupId: group.groupId, groupName: group.groupName });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View className="p-4 border-b border-gray-300">
        <Text className="font-bold text-lg">{item.groupName}</Text>
        <Text className="text-gray-600 mt-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="items-center p-4 bg-black-200">
      <Text className="text-2xl font-bold">Your Groups</Text>
    </View>
  );

  return (
    <FlatList
      data={joinedGroups}
      renderItem={renderItem}
      keyExtractor={(item) => item.groupId}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ShowGroup;
