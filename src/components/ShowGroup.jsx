import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ShowGroup = ({ joinedGroups, query }) => {
  const navigation = useNavigation();  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading groups...</Text>
      </View>
    );
  }

  // Filter the joinedGroups based on the query
  const filteredGroups = query
    ? joinedGroups.filter(group => group.groupName.toLowerCase().includes(query.toLowerCase()))
    : joinedGroups;

  return (
    <FlatList
      data={filteredGroups}
      renderItem={renderItem}
      keyExtractor={(item) => item.groupId}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ShowGroup;
