import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getGroupInfo } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeadmin, addgroupmembers, removemember, blockmembers, mutemembers, unblockmembers, unmutemembers, leavegroup } from '../agora/groupManager';

const GroupInfo = () => {
    const { chatClient, isInitialized } = useContext(AgoraContext);
    const route = useRoute();
    const { groupId, groupName } = route.params;
    const [groupInfo, setGroupInfo] = useState(null);
    const [user, setUser] = useState([]);
    const [refreshing, setRefreshing] = useState(false); 
    
    const fetchGroupInfo = async () => {
        try {
            const info = await getGroupInfo(isInitialized, chatClient, groupId);
            setGroupInfo(info);
        } catch (error) {
            console.log('Error fetching group info:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGroupInfo();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchGroupInfo();
    }, [isInitialized, chatClient, groupId]);

    const showAlert = (member, type) => {
        let options = [];

        if (type === 'admin') {
            options = [
                // { text: 'Remove Admin', onPress: () => removemember(isInitialized, chatClient, groupId, member) },
                { text: 'Block', onPress: () => blockmembers(isInitialized, chatClient, groupId, member) },
                { text: 'Mute', onPress: () => mutemembers(isInitialized, chatClient, groupId, member) },
                { text: 'Cancel', style: 'cancel' },
            ];
        } else if (type === 'member') {
            options = [
                { text: 'Make Admin', onPress: () => makeadmin(isInitialized, chatClient, groupId, member) },
                { text: 'Block', onPress: () => blockmembers(isInitialized, chatClient, groupId, member) },
                // { text: 'Remove', onPress: () => removemember(isInitialized, chatClient, groupId, member) },
                { text: 'Mute', onPress: () => mutemembers(isInitialized, chatClient, groupId, member) },
                { text: 'Cancel', style: 'cancel' },
            ];
        } else if (type === 'blocked') {

            options = [
                { text: 'Unblock', onPress: () => unblockmembers(isInitialized, chatClient, groupId, member) },
                { text: 'Cancel', style: 'cancel' },
            ];
        } else if (type === 'muted') {
            options = [
                { text: 'Unmute', onPress: () => unmutemembers(isInitialized, chatClient, groupId, member) },
                { text: 'Cancel', style: 'cancel' },
            ];
        }

        Alert.alert('Options: ', '', options);
    };

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {groupInfo ? (
                    <View className="p-4 border-0">
                        <View className="mb-4 p-4">
                            <Text className="text-blue-300 text-xl text-center">{groupInfo.groupName}</Text>
                            <Text className="text-white-600 text-sm text-center"> Group - {groupInfo.memberCount} members</Text>
                        </View>
                        <View className="bg-gray-800 mb-4 p-4 rounded-lg">
                            <Text className="text-white-600 text-xl mt-2">{groupInfo.description}</Text>
                            <Text className="text-white-600 text-sm">Created by {groupInfo.owner}</Text>
                        </View>
                        <View className="bg-gray-800 mb-4 p-4 rounded-lg">
                            <Text className="text-white-600 text-xl">Admins:</Text>
                            {groupInfo.adminList.length > 0 ? (
                                groupInfo.adminList.map((member, index) => (
                                    <TouchableOpacity key={index} onPress={() => showAlert(member, 'admin')}>
                                        <Text className="text-white-600 text-sm">{member}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text className="text-white-600 text-sm">No admins</Text>
                            )}
                        </View>
                        <View className="bg-gray-800 mb-4 p-4 rounded-lg">
                            <Text className="text-white-600 text-xl">Members:</Text>
                            {groupInfo.memberList.length > 0 ? (
                                groupInfo.memberList.map((member, index) => (
                                    <TouchableOpacity key={index} onPress={() => showAlert(member, 'member')}>
                                        <Text className="text-white-600 text-sm">{member}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text className="text-white-600 text-sm">No members yet</Text>
                            )}
                        </View>
                        <View className="bg-gray-800 mb-4 p-4 rounded-lg">
                            <Text className="text-white-600 text-xl">Block List:</Text>
                            {groupInfo.blockList.length > 0 ? (
                                groupInfo.blockList.map((member, index) => (
                                    <TouchableOpacity key={index} onPress={() => showAlert(member, 'blocked')}>
                                        <Text className="text-white-600 text-sm">{member}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text className="text-white-600 text-sm">No blocked members</Text>
                            )}
                        </View>
                        <View className="bg-gray-800 mb-4 p-4 rounded-lg">
                            <Text className="text-white-600 text-xl">Mute List:</Text>
                            {groupInfo.muteList.length > 0 ? (
                                groupInfo.muteList.map((member, index) => (
                                    <TouchableOpacity key={index} onPress={() => showAlert(member, 'muted')}>
                                        <Text className="text-white-600 text-sm">{member}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text className="text-white-600 text-sm">No Muted members</Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <Text className="text-white-600 text-center mt-4">Loading group info...</Text>
                )}

                <View className="flex-row justify-between items-center p-4">
                    <TouchableOpacity
                        className="ml-2 bg-blue-500 p-3 rounded-full"
                        onPress={() => leavegroup(isInitialized, chatClient, groupId)}
                    >
                        <Text className="text-white text-xl">Exit Group</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-dark p-4 mb-6">
                    <Text className="text-xl font-bold">Add Group Member</Text>
                    <View className="flex-row items-center p-4 border-t border-0 bg-dark">
                        <TextInput
                            className="flex-1 border rounded-full p-2 border-gray-300"
                            placeholder="Write member name..."
                            onChangeText={text => setUser(text)}
                            value={user}
                        />
                        <TouchableOpacity className="ml-2 bg-blue-500 p-2 rounded-full"
                            onPress={() => addgroupmembers(isInitialized, chatClient, groupId, user)}
                        >
                            <Text className="text-white">Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default GroupInfo;
