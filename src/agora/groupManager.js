import {
    ChatGroupOptions
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
    console.log(groups)
    return groups;
}