// Imports dependencies.
import React, { useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Button } from 'react-native';
//To initialize Agora SDK
import AgoraContext from '../context/AgoraContext';
//Authorize User
import { login, logout } from '../agora/authAgora';
//To handle group related functions
import { creategroup, getjoinedgroups, getCurrentUsername, addgroupmembers } from '../agora/groupManager';


const GroupChat = ({ navigation }) => {
    const { chatClient, isInitialized } = useContext(AgoraContext);
    const title = 'AgoraChatQuickstart';
    const [username, setUsername] = React.useState('rida1234sahd');
    const [chatToken, setChatToken] = React.useState('007eJxTYHjkIB/ZFa3Fu/9go1ymdT/r21UcbvVXLgbyPTtUzbK/S1aBIdHQ0MLI0tg4KS3RyMQ8zcjCyMLYKDEx0dDcNMnMwMKkfPf/tIZARgaxR6KsjAysDIxACOKrMJgmJRqZGSQb6FoYWJrrGhqmpukmWSRa6lqaJpmbmpuZplimpQAAk1olNg==')
    //Set Group name and group description
    const [groupName, setGroupName] = React.useState(null);
    const [groupDescription, setGroupDescription] = React.useState(null);

    const [groupId, setGroupId] = React.useState('260632179965954');

    //Check for current user login status
    const checkLoginStatus = async () => {
        try {
            if (await chatClient.isLoginBefore()) {
                const user_name = await chatClient.getCurrentUsername();
                console.log("Username:", user_name);
                setUsername(user_name)
                return user_name;
            } else {
                console.log("User is not logged in.");
                return null;
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            return null;
        }
    };

    // Renders the UI.
    return (
        <SafeAreaView>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <ScrollView>
                <View style={styles.inputCon}>
                    <TextInput
                        multiline
                        style={styles.inputBox}
                        placeholder="Enter username"
                        onChangeText={text => setUsername(text)}
                        value={username}
                    />
                </View>
                <View style={styles.inputCon}>
                    <TextInput
                        multiline
                        style={styles.inputBox}
                        placeholder="Enter chatToken"
                        onChangeText={text => setChatToken(text)}
                        value={chatToken}
                    />
                </View>
                <View style={styles.buttonCon}>
                    <Text style={styles.eachBtn}
                        onPress={() => login(isInitialized, chatClient, username, chatToken)}
                    >
                        SIGN IN
                    </Text>
                    <Text style={styles.eachBtn}
                        onPress={() => logout(isInitialized, chatClient)}
                    >
                        SIGN OUT
                    </Text>
                </View>
                <View style={styles.inputCon}>
                    <TextInput
                        multiline
                        style={styles.inputBox}
                        placeholder="Enter group name"
                        onChangeText={text => setGroupName(text)}
                        value={groupName}
                    />
                </View>
                <View style={styles.inputCon}>
                    <TextInput
                        multiline
                        style={styles.inputBox}
                        placeholder="Enter group description"
                        onChangeText={text => setGroupDescription(text)}
                        value={groupDescription}
                    />
                </View>
                <View style={styles.buttonCon}>
                    <Text className="mb-2" style={styles.btn2}
                    onPress={()=>creategroup(isInitialized, chatClient, groupName, groupDescription)}
                    >
                        Create Group
                    </Text>
                </View>
                <View style={styles.buttonCon}>
                    <Text className="mb-2" style={styles.btn2} 
                    onPress={ ()=> addgroupmembers(chatClient, groupId)}
                    >
                        Add new members to the group
                    </Text>
                </View>
                <Button
                    className="rounded-lg w-40 px-4 py-2 bg-blue-500"
                    title="See All Groups"
                    onPress={async () => {
                        const groups = await getjoinedgroups(chatClient);
                        navigation.navigate('ShowGroup', { joinedGroups: groups });
                    }}
                    style={{ marginTop: 20 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};
// Sets UI styles.
const styles = StyleSheet.create({
    titleContainer: {
        height: 60,
        backgroundColor: '#6200ED',
    },
    title: {
        lineHeight: 60,
        paddingLeft: 15,
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    inputCon: {
        marginLeft: '5%',
        width: '90%',
        height: 60,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    inputBox: {
        marginTop: 15,
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonCon: {
        marginLeft: '2%',
        width: '96%',
        flexDirection: 'row',
        marginTop: 20,
        height: 26,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    eachBtn: {
        height: 40,
        width: '28%',
        lineHeight: 40,
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#6200ED',
        borderRadius: 5,
    },
    btn2: {
        height: 40,
        width: '45%',
        lineHeight: 40,
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#6200ED',
        borderRadius: 5,
    }
});
export default GroupChat;
