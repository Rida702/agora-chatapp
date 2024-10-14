
//Add Admin for a group
export const makeadmin = async (isInitialized, chatClient, groupId, admin) => {
    if (isInitialized === false || isInitialized === undefined) {
        const message = 'Perform initialization first.';
        console.log(message);
        Alert.alert('Login Error', message);
        return;
    }
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

//get group from server 
export const getgroup = async (chatClient, groupId) => {
    let group = await chatClient.groupManager.fetchGroupInfoFromServer(
        groupId,
        false
    )
    console.log(group)
    return group;
}