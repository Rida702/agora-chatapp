// Imports dependencies.
import React, { useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    ChatClient,
    ChatOptions,
    ChatGroupOptions,
    ChatGroupManager
} from 'react-native-agora-chat';


// Defines the App object.
const App = () => {
    // Defines the variable.
    const title = 'AgoraChatQuickstart';
    // Replaces <your appKey> with your app key.
    const appKey = '411216339#1407114';
    // Replaces <your userId> with your user ID.
    const [username, setUsername] = React.useState('rida1234sahd');
    // Replaces <your agoraToken> with your Agora token.
    const [chatToken, setChatToken] = React.useState('007eJxTYHjutu6iXNTMbdfcX09cHrd/msVETveP7futz00+/Y8xz2+RAkOioaGFkaWxcVJaopGJeZqRhZGFsVFiYqKhuWmSmYGFSW/Gv7SGQEaGO+VmjIwMrAyMQAjiqzCYJiUamRkkG+haGFia6xoapqbpJlkkWupamiaZm5qbmaZYpqUAADJ+KOg=')
    // Set Group Chat Token
    const [groupChatToken, setGroupChatToken] = React.useState('<Your Group Token>');
    //Set Group name and group description
    const [groupName, setGroupName] = React.useState(null);
    const [groupDescription, setGroupDescription] = React.useState(null);
    const [groupId, setGroupId] = React.useState('260632179965954');
    const [user, setUser] = React.useState(null);
    const [logText, setWarnText] = React.useState('Show log area');
    const chatClient = ChatClient.getInstance();
    const chatManager = chatClient.chatManager;
    const groupManager = chatClient.ChatGroupManager;
    // Outputs console logs.
    useEffect(() => {
        logText.split('\n').forEach((value, index, array) => {
            if (index === 0) {
                console.log(value);
            }
        });
    }, [logText]);
    // Outputs UI logs.
    const rollLog = text => {
        setWarnText(preLogText => {
            let newLogText = text;
            preLogText
                .split('\n')
                .filter((value, index, array) => {
                    if (index > 8) {
                        return false;
                    }
                    return true;
                })
                .forEach((value, index, array) => {
                    newLogText += '\n' + value;
                });
            return newLogText;
        });
    };
    useEffect(() => {
        // Registers listeners for messaging.
        const setMessageListener = () => {
            let msgListener = {
                onMessagesReceived(messages) {
                    for (let index = 0; index < messages.length; index++) {
                        rollLog('received msgId: ' + messages[index].msgId);
                    }
                },
                onCmdMessagesReceived: messages => { },
                onMessagesRead: messages => { },
                onGroupMessageRead: groupMessageAcks => { },
                onMessagesDelivered: messages => { },
                onMessagesRecalled: messages => { },
                onConversationsUpdate: () => { },
                onConversationRead: (from, to) => { },
            };
            chatManager.removeAllMessageListener();
            chatManager.addMessageListener(msgListener);
        };
        // Initializes the SDK.
        // Initializes any interface before calling it.
        const init = () => {
            let o = new ChatOptions({
                autoLogin: false,
                appKey: appKey,
            });
            chatClient.removeAllConnectionListener();
            chatClient
                .init(o)
                .then(() => {
                    rollLog('init success');
                    this.isInitialized = true;
                    let listener = {
                        onTokenWillExpire() {
                            rollLog('token expire.');
                        },
                        onTokenDidExpire() {
                            rollLog('token did expire');
                        },
                        onConnected() {
                            rollLog('onConnected');
                            setMessageListener();
                        },
                        onDisconnected(errorCode) {
                            rollLog('onDisconnected:' + errorCode);
                        },
                    };
                    chatClient.addConnectionListener(listener);
                })
                .catch(error => {
                    rollLog(
                        'init fail: ' +
                        (error instanceof Object ? JSON.stringify(error) : error),
                    );
                });
        };
        init();
    }, [chatClient, chatManager, groupManager, appKey]);

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
    

    // Logs in with an account ID and a token.
    const login = async () => {
        if (this.isInitialized === false || this.isInitialized === undefined) {
            rollLog('Perform initialization first.');
            return;
        }
        rollLog('start login ...');
    
        try {
            await chatClient.loginWithAgoraToken(username, chatToken);
            rollLog('login operation success.');
    
            // Call the separate function to check the login status
            await checkLoginStatus();
        } catch (reason) {
            rollLog('login fail: ' + JSON.stringify(reason));
        }
    };
    

    // Logs out from server.
    const logout = () => {
        if (this.isInitialized === false || this.isInitialized === undefined) {
            rollLog('Perform initialization first.');
            return;
        }
        rollLog('start logout ...');
        chatClient
            .logout()
            .then(() => {
                rollLog('logout success.');
            })
            .catch(reason => {
                rollLog('logout fail:' + JSON.stringify(reason));
            });
    };

    const creategroup = async () => {
        // console.log(groupName)
        // console.log(groupDescription)
        if (this.isInitialized === false || this.isInitialized === undefined) {
            rollLog('Perform initialization first.');
            return;
        }
        const callback = new (class {
            onSuccess(response) {
              rollLog('Group chat created successfully. Group ID: ' + response.groupId);
            }
        
            onError(error) {
              rollLog('Error creating group chat: ' + JSON.stringify(error));
            }
          })();
        const options = new ChatGroupOptions({
            style: 0,
            maxCount: 100,
            inviteNeedConfirm: true,
            ext: 'custom extension data',
            isDisabled: false,
        })
        
        let group = await chatClient.groupManager.createGroup(
            options,
            groupName,
            groupDescription,
            ["rida1234sahd", "laiba5362gsdgh"],
            'Join this awesome group'
        ).then(() => {
            console.log("Group created successfully:", group);
        })
        .catch((error) => {
            callback.onError(error);
        });
        await checkLoginStatus();
        return group;
    }

    //get group from server 
    const getgroup = async () => {
        console.log("Inside get group")
        let group = await chatClient.groupManager.fetchGroupInfoFromServer(
            groupId,
            false
        )
        console.log(group)
        return group;
    }
    
    //Add group Members 
    const addgroupmembers = async () => {
        await chatClient.groupManager.addMembers(
            groupId,
            ["rida1234sahd", "user1", "user2", "user12"],
            "Welcome to the group"
        )
        .then(() => {
            console.log("Members successfully added to the group.");
        })
        .catch((error) => {
            console.error("Failed to add members to the group:", error);
        });
        
    }

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
                    <Text style={styles.eachBtn} onPress={login}>
                        SIGN IN
                    </Text>
                    <Text style={styles.eachBtn} onPress={logout}>
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
                    <Text style={styles.btn2} onPress={addgroupmembers}>
                        Create Group
                    </Text>
                </View>

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
    },
    logText: {
        padding: 10,
        marginTop: 10,
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
    },
});
export default App;
