import {
    ChatMessageChatType,
    ChatMessage,
  } from 'react-native-agora-chat';

export const sendmsg = (isInitialized,chatClient,targetId,content) => {
    if (isInitialized === false || isInitialized === undefined) {
      rollLog('Perform initialization first.');
      return;
    }
    let msg = ChatMessage.createTextMessage(
      targetId,
      content,
      ChatMessageChatType.PeerChat,
    );
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