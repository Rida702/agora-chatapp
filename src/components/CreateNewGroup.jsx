import React, { useContext, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { creategroup, getjoinedgroups } from '../agora/groupManager';
import AgoraContext from '../context/AgoraContext';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateGroup = ({ updateGroups }) => {
    const { chatClient, isInitialized } = useContext(AgoraContext);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const refRBSheet = useRef();
    const navigation = useNavigation();  

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
            refRBSheet.current.close(); // Close the bottom sheet after group creation
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'Failed to create group. Please try again.');
        }
    };

    return (
        <>
            <TouchableOpacity
                className="w-full items-end mb-3 mt-5 px-4"
                onPress={() => refRBSheet.current.open()}
            >
                <Image
                    source={require('../../assets/icons/plus.png')}
                    resizeMode="contain"
                    className="w-6 h-6"
                />
            </TouchableOpacity>

            <RBSheet
                ref={refRBSheet}
                useNativeDriver={false}
                height={120}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    container: {
                        backgroundColor: '#428bc9',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                customAvoidingViewProps={{
                    enabled: true,
                  }}
            >
                {/* <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'height' : 'padding'} 
                    style={{ flex: 1 }}
                > */}
                    <View className="p-4">
                        {/* <TextInput
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
                        /> */}
                        <TouchableOpacity
                            className="bg-white px-4 py-2 mt-4 rounded-lg w-32 self-center"
                            // onPress={handleCreateGroup}
                            onPress={() => navigation.navigate('CreateGroup', { updateGroups: updateGroups })} 
                        >
                            <Text className="text-blue-500 text-center">Create Group</Text>
                        </TouchableOpacity>
                    </View>
                {/* </KeyboardAvoidingView> */}
            </RBSheet>
        </>
    );
};

export default CreateGroup;
