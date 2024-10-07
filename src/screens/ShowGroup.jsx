import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ShowGroup = () => {
  const route = useRoute(); 
  const navigation = useNavigation();
  const { joinedGroups } = route.params;

  const handleItemPress = (group) => {
    navigation.navigate('GroupDetails', { groupId: group.groupId, groupName: group.groupName });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View className="bg-blue-500 mb-4 p-2 rounded-lg ml-3 mr-3">
        <Text className="font-bold text-lg">{item.groupName}</Text>
        <Text className="text-gray-600 mt-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="items-center p-4 bg-black-200">
      <Text className="text-3xl font-bold mb-4">Your Groups</Text>
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
