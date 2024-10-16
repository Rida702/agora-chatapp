import React, { useContext, useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';  
import { creategroup, getjoinedgroups } from '../agora/Group/helpers';
import AgoraContext from '../context/AgoraContext';

const CreateGroup = () => {
    const { chatClient } = useContext(AgoraContext)
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const navigation = useNavigation();
    const route = useRoute(); 
    const { updateGroups } = route.params;

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Group name is required');
            return;
        }

        try {
            const group = await creategroup(chatClient, groupName, groupDescription);
            const updatedGroups = await getjoinedgroups(chatClient);
            updateGroups(updatedGroups); 
            
            setGroupName('');
            setGroupDescription('');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'Failed to create group. Please try again.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === "android" ? "padding" : "height"}
                keyboardVerticalOffset={150}
                style={{ flex: 1 }}
            >
                <View className="p-4">
                    <Text className="text-lg font-bold mb-4 text-white">Create Group</Text>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateGroup;
