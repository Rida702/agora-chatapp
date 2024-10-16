import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ChatGroupOptions,
    ChatMessage,
    ChatMessageChatType,
    ChatMessageType,
    ChatConversationType,
    ChatSearchDirection

} from 'react-native-agora-chat';


export const login = async (chatClient, username, chatToken) => {
  try {
    console.log('start login ...');
    await chatClient.loginWithAgoraToken(username, chatToken);  
    const successMessage = 'Login operation successful.';
    console.log(successMessage);
    // Alert.alert('Login Success', successMessage);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('chatToken', chatToken);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    return true;  
  } catch (error) {
    const errorMessage = 'Login failed: ' + JSON.stringify(error);
    console.log(errorMessage);
    Alert.alert('Login Failed', errorMessage);
    return false; 
  }
};



export const logout = async (chatClient) => {
    console.log('start logout ...');
  
    await chatClient
      .logout()
      .then(() => {
        const successMessage = 'Logout operation successful.';
        console.log(successMessage);
        Alert.alert('Logout Success', successMessage);
      })
      .catch(reason => {
        const errorMessage = 'Logout failed: ' + JSON.stringify(reason);
        console.log(errorMessage);
        Alert.alert('Logout Error', errorMessage);
      });
  };

//Get current user
export const getusername = async (chatClient) => {
    const user_name = await chatClient.getCurrentUsername();
    console.log("Username:", user_name);
    return user_name;
};

// Get Joined Groups
export const getjoinedgroups = async (chatClient) => {
    let groups = await chatClient.groupManager.getJoinedGroups()
    // console.log(groups)
    return groups;
}

//create a new group 
export const creategroup = async (chatClient, groupName, groupDescription) => {

    const result = await chatClient.isLoginBefore();
    console.log("Group manager object 1", result);

    const callback = new (class {
        onSuccess(response) {
            const successMessage = 'Group chat created successfully. Group ID: ' + response.groupId;
            console.log(successMessage);
            Alert.alert('Group Creation Success', successMessage);
        }
        onError(error) {
            const errorMessage = 'Error creating group chat: ' + JSON.stringify(error);
            console.log(errorMessage);
            Alert.alert('Group Creation Error', errorMessage);
        }
    })();

    const options = new ChatGroupOptions({
        style: 0,
        maxCount: 100,
        inviteNeedConfirm: true,
        ext: 'custom extension data',
        isDisabled: false,
    });

    console.log('Starting group creation...');
    // Alert.alert('Group Creation', 'Starting group creation...');

    let group = await chatClient.groupManager.createGroup(
        options,
        groupName,
        groupDescription,
        ["user1", "laiba5362gsdgh"], //users  are not adding to the group
        'Join this awesome group'
    )
        .then((response) => {
            callback.onSuccess(response);
            console.log("Group created successfully:", response.groupId);
        })
        .catch((error) => {
            callback.onError(error);
        });

    return group;
};

//Listener for received messages
export const registerMessageListener = (chatClient, groupId, setChats) => {
    chatClient.chatManager.addMessageListener({
      onMessagesReceived: (messages) => {
        console.log('Received messages from admin:', messages);
  
        messages.forEach(message => {
          if (message.conversationId === groupId) {
            let newChatItem;
            const uniqueKey = `${message.msgId}-${message.localTime}`;
  
            if (message.body.type === 'txt') {
              // Handle text message
              newChatItem = {
                id: message.localMsgId,
                message: message.body.content,
                sender: message.from,
                type: 'txt'
              };
            } else if (message.body.type === 'img') {
              // Handle image message
              newChatItem = {
                id: message.localMsgId,
                image: message.body.remotePath,
                displayName: message.body.displayName,
                width: message.body.width,
                height: message.body.height,
                sender: message.from,
                type: 'img'
              };
            } else if (message.body.type === 'voice') {
                // Handle voice message
                newChatItem = {
                  id: message.localMsgId,
                  voice: message.body.remotePath,
                  displayName: message.body.displayName,
                  duration: message.body.duration,
                  sender: message.from,
                  type: 'voice',
                };
              } else if (message.body.type === 'file') {
                // Handle voice message
                newChatItem = {
                    id: message.localMsgId,
                    sender: message.from,
                    remoteUrl: message.body.remotePath, 
                    localUrl: message.body.localPath, 
                    fileSize: message.body.fileSize, 
                    displayName : message.body.displayName,
                    type: 'file'  
                };
              }

  
            setChats(prevChats => [...prevChats, newChatItem]);
          }
        });
      }
    });
  };

//Receive Message from server
export const createMessage = async ({
    groupId,
    messageType,
    message = null,
    filePath = '',
    displayName = '',
    width = 100,
    height = 100,
    thumbnailLocalPath = '',
    duration = 0,
    fileSize = 0,
}) => {
    const chatType = ChatMessageChatType.GroupChat;
    let msg;

    switch (messageType) {
        case ChatMessageType.TXT:
            msg = ChatMessage.createTextMessage(groupId, message, chatType);
            break;

        case ChatMessageType.IMAGE:
            msg = ChatMessage.createImageMessage(groupId, filePath, chatType, {
                displayName,
                fileSize,
                width,
                height,
            });
            break;

        case ChatMessageType.FILE:
            msg = ChatMessage.createFileMessage(groupId, filePath, chatType, {
                displayName,
                fileSize
            });
            break;

        case ChatMessageType.VIDEO:
            msg = ChatMessage.createVideoMessage(groupId, filePath, chatType, {
                displayName,
                thumbnailLocalPath,
                duration,
                width,
                height,
            });
            break;

        case ChatMessageType.VOICE:
            msg = ChatMessage.createVoiceMessage(groupId, filePath, chatType, {
                displayName,
                duration,
            });
            break;

        default:
            throw new Error("Not implemented.");
    }
    console.log("Create Message: ",msg)
    return msg;
};


export const sendmsg = async ({
    chatClient,
    groupId,
    messageType = null,
    message = '',
    filePath = '',
    displayName = '',
    width = 100,
    height = 100,
    duration=0,
    thumbnailLocalPath=null,
    fileSize = 0,
}) => {
    let msg;
    try {
        if (messageType === ChatMessageType.TXT) {
            msg = await createMessage({ groupId, messageType, message });
        } else if (messageType === ChatMessageType.IMAGE) {
            msg = await createMessage({ groupId, messageType, filePath, displayName, fileSize });
        } else if (messageType === ChatMessageType.VOICE) {
            msg = await createMessage({ groupId, messageType, filePath, displayName, duration });
        } else if (messageType === ChatMessageType.VIDEO) {
            msg = await createMessage({ groupId, messageType, filePath, displayName });
        } else if (messageType === ChatMessageType.FILE) {
            msg = await createMessage({ groupId, messageType, filePath, displayName, fileSize });
        }
    } catch (error) {
        console.error("Failed to create message:", error.message);
        return;
    }

    // Wrap sendMessage in a promise to handle the result from onSuccess
    return new Promise((resolve, reject) => {
        const callback = {
            onProgress: (localMsgId, progress) => {
                console.log(`Sending message with ID ${localMsgId}: ${progress}% complete.`);
            },
            onError: (localMsgId, error) => {
                console.log(`Error sending message with ID ${localMsgId}:`, error);
                reject(error);
            },
            onSuccess: (message) => {
                console.log(`Message sent successfully:`, message);
                // Update the `msg` with additional information from `message`
                if (messageType === ChatMessageType.TXT) {
                    resolve({
                        id: msg.localMsgId,
                        message: msg.body.content,
                        sender: msg.from,
                        type: 'txt'
                    });
                } else if (messageType === ChatMessageType.IMAGE) {
                    resolve({
                        id: message.localMsgId,
                        image: message.body.remotePath,  // Use the value from onSuccess
                        displayName: message.body.displayName,
                        width: message.body.width,
                        height: message.body.height,
                        fileSize: message.body.fileSize,
                        sender: message.from,
                        type: 'img'
                    });
                }
                else if (messageType === ChatMessageType.VOICE) {
                    resolve({
                        id: message.localMsgId,
                        voice: message.body.remotePath, 
                        displayName: message.body.displayName,
                        duration: message.body.duration,
                        sender: message.from,
                        type: 'voice'
                    });
                }
                else if (messageType === ChatMessageType.VIDEO) {
                    resolve({
                        id: message.localMsgId,
                        video: message.body.remotePath, 
                        displayName: message.body.displayName,
                        duration: message.body.duration,
                        sender: message.from,
                        height: message.body.height,
                        width: message.body.width,
                        type: 'video'
                    });
                }
                else if (messageType === ChatMessageType.FILE) {
                    resolve({
                        id: message.localMsgId,
                        remoteUrl: message.body.remotePath, 
                        localUrl: message.body.localPath, 
                        displayName: message.body.displayName,
                        fileSize : message.body.fileSize,
                        sender: message.from,
                        type: 'file'
                    });
                }
            }
        };

        chatClient.chatManager
            .sendMessage(msg, callback)
            .catch(reason => {
                console.log('Send fail: ' + JSON.stringify(reason));
                reject(reason);
            });
    });
};



//Receive Messages for a group chat with group id
export const receivemessages = async (chatClient, targetId) => {
    const callback = new (class {
        onSuccess() {
            console.log('Messages Received Successfully, Group ID: ' + targetId);
        }
        onError(error) {
            console.log('Error receiving group chat messages: ' + JSON.stringify(error));
        }
    })();

    const params = {
        pageSize: 20,
        direction: ChatSearchDirection.UP
    };

    return await chatClient.chatManager
        .fetchHistoryMessages(targetId, ChatConversationType.GroupChat, params)
        .then((response) => {
            callback.onSuccess("HERE IS: ", response);
            
            // Handle different types of messages: text and image
            const chatData = response.list.map(message => {
                if (message.body.type === 'txt') {
                    // Handle text message
                    return {
                        id: message.localMsgId,
                        sender: message.from,
                        message: message.body.content,
                        type: 'txt'
                    };
                } else if (message.body.type === 'img') {
                    // Handle image message
                    return {
                        id: message.localMsgId,
                        sender: message.from,
                        image: message.body.remotePath,
                        type: 'img'  
                    };
                } else if (message.body.type === 'voice') {
                    // Handle voice message
                    return {
                        id: message.localMsgId,
                        sender: message.from,
                        voice: message.body.remotePath,
                        duration : message.body.duration,
                        type: 'voice'  
                    };
                } else if (message.body.type === 'file') {
                    // Handle file message
                    return {
                        id: message.localMsgId,
                        sender: message.from,
                        remoteUrl: message.body.remotePath, 
                        localUrl: message.body.localPath, 
                        fileSize: message.body.fileSize, 
                        displayName : message.body.displayName,
                        type: 'file'  
                    };
                } else if (message.body.type === 'video') {
                    // Handle video message
                    return {                        
                        id: message.localMsgId,
                        video: message.body.remotePath, 
                        displayName: message.body.displayName,
                        duration: message.body.duration,
                        sender: message.from,
                        height: message.body.height,
                        width: message.body.width,
                        type: 'video'
                    };
                } else {
                    return {
                        id: message.localMsgId,
                        sender: message.from,
                        message: message.body.content || 'Unknown content',
                        type: 'unknown'
                    };
                }
            });

            return chatData;
        })
        .catch((error) => {
            callback.onError(error);
            return [];
        });
};


//Group Info

//Add Admin for a group
export const makeadmin = async ( chatClient, groupId, admin) => {
    return await chatClient.groupManager.addAdmin(groupId, admin)
        .then(() => {
            console.log("Admin Created Successfully")
        })
        .catch((error) => {
            console.log("Error while creating admin")
        });
}

export const registerAdminAddedListener = (chatClient) => {
    const groupListener = {
        onAdminAdded: ({ admin, groupId }) => {
            console.log(`Admin with ID: ${admin} has been added to group: ${groupId}`);
        },
        onMemberJoined: ({ member, groupId }) => {
            console.log(`Member with ID: ${member} has joined group: ${groupId}`);
        },
    };
    chatClient.groupManager.addGroupListener(groupListener)
}

//Get all the information about group
export const getGroupInfo = async ( chatClient, groupId) => {
    const callback = new (class {
        onSuccess() {
            console.log('Group Info Received Successfully');
        }
        onError(error) {
            console.log('Error receiving Group Info : ' + JSON.stringify(error));
        }
    })();
    return await chatClient.groupManager.fetchGroupInfoFromServer(groupId, true)
        .then((response) => {
            callback.onSuccess(response);
            const groupInfo = {
                adminList: response.adminList,
                blockList: response.blockList,
                groupId: response.groupId,
                description: response.description,
                groupName: response.groupName,
                memberCount: response.memberCount,
                memberList: response.memberList,
                muteList: response.muteList,
                owner: response.owner,
            };
            console.log(groupInfo)
            return groupInfo;
        })
        .catch((error) => {
            callback.onError(error);
            return [];
        });
}

//removeMembers(groupId: string, members: string[]): Promise<void>
export const removemember = async (chatClient, groupId, members) => {
    try {
        await chatClient.groupManager.removeMembers(groupId, members);
        console.log("Members successfully removed from the group.");
        Alert.alert('Success', "Members successfully removed from the group.");
    } catch (error) {
        console.error("Failed to remove members from the group:", error);
        Alert.alert('Error', `Failed to remove members from the group: ${error.message}`);
    }
}

//blockMembers(groupId: string, members: string[]): Promise<void>
export const blockmembers = async (chatClient, groupId, members) => {
    try {

        await chatClient.groupManager.blockMembers(groupId, members);
        console.log("Members successfully blocked from the group.");
        Alert.alert('Success', "Members successfully blocked from the group.");
    } catch (error) {
        console.error("Failed to block members from the group:", error);
        Alert.alert('Error', `Failed to block members from the group: ${error.message}`);
    }
}

//muteMembers(groupId: string, members: string[], duration?: number): Promise<void>
export const mutemembers = async (chatClient, groupId, members) => {
    try {
        await chatClient.groupManager.muteMembers(groupId, members);
        console.log("Members successfully muted from the group.");
        Alert.alert('Success', "Members successfully muted from the group.");
    } catch (error) {
        console.error("Failed to mute members from the group:", error);
        Alert.alert('Error', `Failed to mute members from the group: ${error.message}`);
    }
}

//unblockMembers(groupId: string, members: string[]): Promise<void>
export const unblockmembers = async (chatClient, groupId, members) => {
    try {
        await chatClient.groupManager.unblockMembers(groupId, members);
        console.log("Members successfully unblocked.");
        Alert.alert('Success', "Members successfully unblocked.");
    } catch (error) {
        console.error("Failed to unblock members:", error);
        Alert.alert('Error', `Failed to unblock members: ${error.message}`);
    }
}

//unMuteMembers(groupId: string, members: string[]): Promise<void>
export const unmutemembers = async (chatClient, groupId, members) => {
    try {
        await chatClient.groupManager.unMuteMembers(groupId, members);
        console.log("Members successfully unmuted.");
        Alert.alert('Success', "Members successfully unmuted.");
    } catch (error) {
        console.error("Failed to unmute members:", error);
        Alert.alert('Error', `Failed to unmute members: ${error.message}`);
    }
}

//removeAdmin(groupId: string, admin: string): Promise<void>
export const removeadmin = async (chatClient, groupId, members) => {
    try {
        await chatClient.groupManager.removeAdmin(groupId, members);
        console.log("Admin removed successfully.");
        Alert.alert('Success', "Admin removed successfully.");
    } catch (error) {
        console.error("Failed to remove admin:", error);
        Alert.alert('Error', `Failed to remove admin: ${error.message}`);
    }
}

//leaveGroup(groupId: string): Promise<void>
export const leavegroup = async (chatClient, groupId) => {
    try {
        await chatClient.groupManager.leaveGroup(groupId);
        console.log("Group left successfully.");
        Alert.alert('Success', "Group left successfully.");
    } catch (error) {
        console.error("Failed to leave group:", error);
        Alert.alert('Error', `Failed to leave group: ${error.message}`);
    }
}

//addMembers(groupId: string, members: string[], welcome?: string): Promise<void>
//Add group Members 
export const addgroupmembers = async (chatClient, groupId, member) => {
    // Check and log the type of members
    console.log("Members: ", member);
    console.log("Type of members: ", typeof member);
    console.log("Is members an array?: ", Array.isArray(member));

    // Convert members to an array of strings if it's not an array
    if (Array.isArray(member)) {
        // If already an array, ensure all elements are strings
        member = member.map(member => String(member));
    } else if (typeof member === 'string') {
        // If members is a single string, convert it to an array
        member = [member];
    } else if (typeof member === 'object') {
        // If members is an object, convert its values to an array of strings
        member = Object.values(member).map(value => String(value));
    } else {
        Alert.alert('Error', 'Members should be an array, string, or an object.');
        return;
    }

    console.log("Converted Members: ", member);

    await chatClient.groupManager.addMembers(
        groupId,
        member,
        "Welcome to the group"
    )
        .then(() => {
            console.log("Members successfully added to the group.");
            Alert.alert('Success', 'Members successfully added to the group.');
        })
        .catch((error) => {
            console.error("Failed to add members to the group:", error);
            Alert.alert('Error', `Failed to add members to the group: ${error.message}`);
        });
}

//get group from server 
export const getgroup = async (chatClient, groupId) => {
    let group = await chatClient.groupManager.fetchGroupInfoFromServer(
        groupId,
        false
    )
    console.log(group)
    return group;
}