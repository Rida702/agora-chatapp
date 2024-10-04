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
