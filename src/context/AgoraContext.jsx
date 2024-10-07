import React, { createContext, useState, useEffect } from 'react';
import { ChatClient, ChatOptions } from 'react-native-agora-chat';

// Create the Agora Context
const AgoraContext = createContext();

// Agora Provider component to wrap your app
export const AgoraProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [chatManager, setChatManager] = useState(null);
  const [groupManager, setGroupManager] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const appKey = '411216339#1407114'; 

  useEffect(() => {
    // Function to initialize Agora SDK
    const initAgora = async () => {
      const client = ChatClient.getInstance();
      const options = new ChatOptions({ appKey, autoLogin: false });
      await client.init(options);
      setChatClient(client);
      setIsInitialized(true);
      const chatmanager = client.chatManager;
      const groupmanager = client.ChatGroupManager;      
      setChatManager(chatmanager);
      setGroupManager(groupmanager);
    };

    if (!isInitialized) {
      initAgora();
    }
  }, [isInitialized]);

  return (
    <AgoraContext.Provider value={{ chatClient, isInitialized, appKey, chatManager, groupManager }}>
      {children}
    </AgoraContext.Provider>
  );
};

export default AgoraContext;
