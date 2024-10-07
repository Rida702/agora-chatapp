import {
    ChatGroupOptions,
    ChatMessage,
    ChatManager,
    ChatMessageChatType,
    ChatConversationType,
    ChatSearchDirection
} from 'react-native-agora-chat';

//Get current user
export const getusername = async (chatClient) => {
    const user_name = await chatClient.getCurrentUsername();
    console.log("Username:", user_name);
    return user_name;
  };

//Add Admin for a group
//Make the person who created the group Admin by default
export const makeadmin = async (isInitialized, chatClient, groupId, admin) => {
    if (!isInitialized) {
        rollLog('Perform initialization first.');
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
        console.log('Perform initialization first.')
        return;
    }
    const owner = await getusername(chatClient);

    const callback = new (class {
      onSuccess(response) {
        console.log('Group chat created successfully. Group ID: ' + response.groupId);
        makeadmin(isInitialized, chatClient, response.groupId, owner);
      }

      onError(error) {
        console.log('Error creating group chat: ' + JSON.stringify(error));
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

////addMembers(groupId: string, members: string[], welcome?: string): Promise<void>
//Add group Members 
export const addgroupmembers = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.addMembers(
        groupId,
        [members],
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
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.removeMembers(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Members successfully Removed from the group.");
        })
        .catch((error) => {
            console.error("Failed to remove members from the group:", error);
        });
}

//blockMembers(groupId: string, members: string[]): Promise<void>
export const blockmembers = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.blockMembers(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Members successfully Blocked from the group.");
        })
        .catch((error) => {
            console.error("Failed to block members from the group:", error);
        });
}

//muteMembers(groupId: string, members: string[], duration?: number): Promise<void>
export const mutemembers = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.muteMembers(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Members successfully Muted from the group.");
        })
        .catch((error) => {
            console.error("Failed to mute members from the group:", error);
        });
}

//unblockMembers(groupId: string, members: string[]): Promise<void>
export const unblockmembers = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.unblockMembers(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Members successfully UnBlocked");
        })
        .catch((error) => {
            console.error("Failed to unblock members", error);
        });
}


//unMuteMembers(groupId: string, members: string[]): Promise<void>
export const unmutemembers = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.unMuteMembers(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Members successfully unmuted");
        })
        .catch((error) => {
            console.error("Failed to unmute members", error);
        });
}

//removeAdmin(groupId: string, admin: string): Promise<void>
export const removeadmin = async (isInitialized, chatClient, groupId, members) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.removeAdmin(
        groupId,
        [members]
    )
        .then(() => {
            console.log("Admin Removed successfully");
        })
        .catch((error) => {
            console.error("Failed to remove admin", error);
        });
}

//leaveGroup(groupId: string): Promise<void>
export const leavegroup = async (isInitialized, chatClient, groupId) => {
    if (isInitialized === false || isInitialized === undefined) {
        console.log('Perform initialization first.')
        return;
    }
    await chatClient.groupManager.leaveGroup(
        groupId
    )
        .then(() => {
            console.log("Group Left successfully");
        })
        .catch((error) => {
            console.error("Failed to leave group", error);
        });
}

//changeGroupDescription(groupId: string, description: string): Promise<void>
//changeGroupName(groupId: string, groupName: string): Promise<void>
//changeOwner(groupId: string, newOwner: string): Promise<void>



