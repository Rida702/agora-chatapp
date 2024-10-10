import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Text, View, ActivityIndicator, TextInput } from 'react-native';
import AgoraContext from '../context/AgoraContext';
import ShowGroup from '../components/ShowGroup';
import { getjoinedgroups } from '../agora/groupManager';
import CreateNewGroup from '../components/CreateNewGroup'


const HomeScreen = () => {
    const { chatClient, isInitialized } = useContext(AgoraContext);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchJoinedGroups = async () => {
            const groups = await getjoinedgroups(isInitialized, chatClient);
            setJoinedGroups(groups);
            setLoading(false);
        };

        if (isInitialized && chatClient !== undefined) {
            fetchJoinedGroups();
        }
    }, [isInitialized]);

    // Function to update the group list
    const updateGroups = (newGroups) => {
        setJoinedGroups(newGroups);
    };

    return (

        <SafeAreaView className="flex-1 bg-black">
            <CreateNewGroup updateGroups={updateGroups} />
            <View className="p-3 bg-black">
                <Text className="text-3xl font-bold text-white border-0">Groups</Text>
            </View>

            <View className="flex-row items-center p-4 border-t bg-black">
                <TextInput
                    className="flex-1 border rounded-full p-2 border-gray-300"
                    placeholder="Search..."
                    onChangeText={text => setQuery(text)}
                    value={query}
                />
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-4 text-white">Loading groups...</Text>
                </View>
            ) : (
                <ShowGroup joinedGroups={joinedGroups} query={query} />
            )}            
        </SafeAreaView>
    );
};

export default HomeScreen;
