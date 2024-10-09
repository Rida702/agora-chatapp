import {
    ChatGroupOptions,
    ChatMessage,
    ChatManager,
    ChatMessageChatType,
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

//Add Admin for a group
//Make the person who created the group Admin by default
export const makeadmin = async (isInitialized, chatClient, groupId, admin) => {
    if (isInitialized === false || isInitialized === undefined) {
        const message = 'Perform initialization first.';
        console.log(message);
        Alert.alert('Login Error', message);
        return;
      }
    return await chatClient.groupManager.addAdmin(groupId,admin)
    .then(() => {
        console.log("Admin Created Successfully")
    })
    .catch((error) => {
        console.log("Error while creating admin")
    });
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
        ["rida1234sahd", "laiba5362gsdgh"],
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


//get group from server 
export const getgroup = async (chatClient, groupId) => {
    let group = await chatClient.groupManager.fetchGroupInfoFromServer(
        groupId,
        false
    )
    console.log(group)
    return group;
}

//addMembers(groupId: string, members: string[], welcome?: string): Promise<void>
//Add group Members 
export const addgroupmembers = async (isInitialized, chatClient, groupId, member) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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


// Get Joined Groups
export const getjoinedgroups = async (isInitialized,chatClient) => {
    if ((isInitialized === false || isInitialized === undefined) && chatClient!==undefined) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
    let groups = await chatClient.groupManager.getJoinedGroups()
    // console.log(groups)
    return groups;
}

//Send Message to group chat
//ChatMessageChatType: 1(Group Chat)
//target id --> group id in case of group chat
//content --> The text content
export const sendmsg = async (isInitialized, chatClient, targetId, content) => {
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
    await chatClient.chatManager
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

//Get all the information about group
export const getGroupInfo = async (isInitialized, chatClient, groupId) => {
    if (!isInitialized) {
        rollLog('Perform initialization first.');
        return;
    }
    const callback = new (class {
        onSuccess() {
            console.log('Group Info Received Successfully');
        }
        onError(error) {
            console.log('Error receiving Group Info : ' + JSON.stringify(error));
        }
    })();
    return await chatClient.groupManager.fetchGroupInfoFromServer(groupId,true)
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
export const removemember = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const blockmembers = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const mutemembers = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const unblockmembers = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const unmutemembers = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const removeadmin = async (isInitialized, chatClient, groupId, members) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
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
export const leavegroup = async (isInitialized, chatClient, groupId) => {
    if (!isInitialized) {
        console.log('Perform initialization first.');
        Alert.alert('Error', 'Perform initialization first.');
        return;
    }
    try {
        await chatClient.groupManager.leaveGroup(groupId);
        console.log("Group left successfully.");
        Alert.alert('Success', "Group left successfully.");
    } catch (error) {
        console.error("Failed to leave group:", error);
        Alert.alert('Error', `Failed to leave group: ${error.message}`);
    }
}


//changeGroupDescription(groupId: string, description: string): Promise<void>
//changeGroupName(groupId: string, groupName: string): Promise<void>
//changeOwner(groupId: string, newOwner: string): Promise<void>



