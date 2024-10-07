export const login = async (isInitialized, chatClient, username, chatToken) => {
  if (isInitialized === false || isInitialized === undefined) {
    console.log('Perform initialization first.')
    return;
  }
  console.log('start login ...')
  chatClient
    .loginWithAgoraToken(username, chatToken)
    .then(() => {
      console.log('login operation success.')
    })
    .catch(reason => {
      console.log('login fail: ' + JSON.stringify(reason))
    });
};

export const logout = async (isInitialized, chatClient) => {
  if (isInitialized === false || isInitialized === undefined) {
    console.log('Perform initialization first.')
    return;
  }
  console.log('start logout ...')
  await chatClient
    .logout()
    .then(() => {
      console.log('logout success.')
    })
    .catch(reason => {
      console.log('logout fail:' + JSON.stringify(reason))
    });
};

//getAccessToken(): Promise<string>
export const getaccesstoken = async (chatClient) => {
  return await chatClient.getAccessToken()
    .then((response) => {
      console.log("Token Created Successfully", response)
      return response;
    })
    .catch((error) => {
      console.log("Error while generating token")
      return error;
    });
}

//renewAgoraToken(agoraToken: string): Promise<void>

//Check for current user login status
const getusername = async (chatClient) => {
  const user_name = await chatClient.getCurrentUsername();
  console.log("Username:", user_name);
  return user_name;
};




