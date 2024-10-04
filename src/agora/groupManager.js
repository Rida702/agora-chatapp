import {
    ChatGroupOptions,
    ChatMessage,
    ChatManager,
    ChatMessageChatType,
    ChatConversationType,
    ChatSearchDirection
} from 'react-native-agora-chat';

//create a new group 
export const creategroup = async (isInitialized, chatClient, groupName, groupDescription) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    const callback = new (class {
        onSuccess(response) {
            console.log('Group chat created successfully. Group ID: ' + response.groupId)
        }

        onError(error) {
            console.log('Error creating group chat: ' + JSON.stringify(error))
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
    ).then((response) => {
        callback.onSuccess(response)
        console.log("Group created successfully:", response.groupId);
    })
        .catch((error) => {
            callback.onError(error);
        });
    return group;
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

//Add group Members 
export const addgroupmembers = async (chatClient, groupId) => {
    await chatClient.groupManager.addMembers(
        groupId,
        ["user3"],
        "Welcome to the group"
    )
        .then(() => {
            console.log("Members successfully added to the group.");
        })
        .catch((error) => {
            console.error("Failed to add members to the group:", error);
        });

}

// Get Joined Groups
export const getjoinedgroups = async (chatClient) => {
    let groups = await chatClient.groupManager.getJoinedGroups()
    // console.log(groups)
    return groups;
}

//Send Message to group chat
//ChatMessageChatType: 1(Group Chat)
//target id --> group id in case of group chat
//content --> The text content
export const sendmsg = (isInitialized, chatClient, targetId, content) => {
    if (isInitialized === false || isInitialized === undefined) {
        rollLog('Perform initialization first.');
        return;
    }
    let msg = ChatMessage.createTextMessage(
        targetId,
        content,
        ChatMessageChatType.GroupChat,
    );
    console.log(targetId)
    const callback = new (class {
        onProgress(locaMsgId, progress) {
            console.log(`send message process: ${locaMsgId}, ${progress}`)
        }
        onError(locaMsgId, error) {
            console.log(`send message fail: ${locaMsgId}, ${JSON.stringify(error)}`)
        }
        onSuccess(message) {
            console.log('send message success: ' + message.localMsgId)
        }
    })();
    console.log('start send message ...')
    chatClient.chatManager
        .sendMessage(msg, callback)
        .then(() => {
            console.log('send message: ' + msg.localMsgId)
        })
        .catch(reason => {
            console.log('send fail: ' + JSON.stringify(reason))
        });
};

/*
//Get the content of a message from message ID
//1333463981527928442
export const getmessage =  async (chatClient) => {
    msgId = '1333463981527928442'
    msg = await chatClient.chatManager.getMessage(msgId)
    // message = await msg.getBody.ChatTextMessageBody.content;
    const content = msg.body.content;
    console.log(content);
    // console.log(message);
}
*/

//Receive Messages for a group chat with group id
export const receivemessages = (isInitialized, chatClient, targetId) => {
    if (!isInitialized) {
        rollLog('Perform initialization first.');
        return;
    }

    const callback = new (class {
        onSuccess(response) {
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

    return chatClient.chatManager
        .fetchHistoryMessages(targetId, ChatConversationType.GroupChat, params)
        .then((response) => {
            callback.onSuccess(response);
            const chatData = response.list.map(message => ({
                id: message.msgId,           
                sender: message.from,    
                message: message.body.content
            }));

            return chatData;
        })
        .catch((error) => {
            callback.onError(error);
            return [];
        });
};
