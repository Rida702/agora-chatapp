import React, { useContext, useState } from 'react';
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import { creategroup, getjoinedgroups } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';

const CreateGroup = ({ updateGroups }) => {
    const { chatClient, isInitialized } = useContext(AgoraContext)
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Group name is required');
            return;
        }
        try {
            const group = await creategroup(isInitialized, chatClient, groupName, groupDescription);

            const updatedGroups = await getjoinedgroups(isInitialized, chatClient);
            updateGroups(updatedGroups);

            setGroupName('');
            setGroupDescription('');
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'Failed to create group. Please try again.');
        }
    };

    return (

        <View className="p-4">
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Group Name"
                value={groupName}
                onChangeText={text => setGroupName(text)}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Group Description"
                value={groupDescription}
                onChangeText={text => setGroupDescription(text)}
            />
            <TouchableOpacity
                className="bg-white px-4 py-2 rounded-lg w-32 self-center"
                onPress={handleCreateGroup}
            >
                <Text className="text-blue-500 text-center">Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateGroup;
