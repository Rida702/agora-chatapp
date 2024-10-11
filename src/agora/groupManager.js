import {
    ChatGroupOptions,
    ChatMessage,
    ChatMessageChatType,
    ChatMessageType,
    ChatConversationType,
    ChatSearchDirection

} from 'react-native-agora-chat';

import { Alert } from 'react-native';

//Get current user
export const getusername = async (chatClient) => {
    const user_name = await chatClient.getCurrentUsername();
    console.log("Username:", user_name);
    return user_name;
};

// Get Joined Groups
export const getjoinedgroups = async (isInitialized, chatClient) => {
    if ((isInitialized === false || isInitialized === undefined) && chatClient !== undefined) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
    let groups = await chatClient.groupManager.getJoinedGroups()
    // console.log(groups)
    return groups;
}

//create a new group 
export const creategroup = async (isInitialized, chatClient, groupName, groupDescription) => {

    if (isInitialized === false || isInitialized === undefined) {
        const message = 'Perform initialization first.';
        console.log(message);
        Alert.alert('Group Creation Error', message);
        return;
    }

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
                message: '',
                image: message.body.remotePath,
                displayName: message.body.displayName,
                width: message.body.width,
                height: message.body.height,
                sender: message.from,
                type: 'img'
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
                width,
                height,
            });
            break;

        case ChatMessageType.FILE:
            msg = ChatMessage.createFileMessage(groupId, filePath, chatType, {
                displayName,
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
    isInitialized,
    chatClient,
    groupId,
    messageType = null,
    message = '',
    filePath = '',
    displayName = '',
    width = 100,
    height = 100,
}) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.');
        return;
    }

    let msg;
    try {
        if (messageType === ChatMessageType.TXT) {
            msg = await createMessage({ groupId, messageType, message });
        } else if (messageType === ChatMessageType.IMAGE) {
            // console.log("HERE");
            msg = await createMessage({ groupId, messageType, filePath, displayName, width, height });
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
                        id: msg.localMsgId,
                        message: '',
                        image: message.body.remotePath,  // Use the value from onSuccess
                        displayName: message.body.displayName,
                        width: message.body.width,
                        height: message.body.height,
                        sender: msg.from,
                        type: 'img'
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
export const receivemessages = async (isInitialized, chatClient, targetId) => {
    if (!isInitialized) {
        rollLog('Perform initialization first.');
        return;
    }
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
                        id: message.msgId,
                        sender: message.from,
                        message: message.body.content,
                        type: 'txt'
                    };
                } else if (message.body.type === 'img') {
                    // Handle image message
                    return {
                        id: message.msgId,
                        sender: message.from,
                        image: message.body.remotePath,
                        type: 'img'  
                    };
                } else {
                    return {
                        id: message.msgId,
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