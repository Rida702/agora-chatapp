import { ChatClient, ChatOptions } from 'react-native-agora-chat';

export const initAgora = async (appKey) => {
    const chatClient = ChatClient.getInstance();
    const options = new ChatOptions({ appKey, autoLogin: false });
    await chatClient.init(options);
    return chatClient;
};
