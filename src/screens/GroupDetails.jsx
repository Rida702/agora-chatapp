import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, Dimensions, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, registerMessageListener } from '../agora/Group/helpers';

import AgoraContext from '../context/AgoraContext';
import UploadFiles from '../components/UploadFiles';
import { ChatMessageType } from 'react-native-agora-chat';
import RecordVoice from '../components/RecordVoice';

import VideoMessage from '../components/VideoMessage';
import ImageMessage from '../components/ImageMessage';
import PlayVoiceMessage from '../components/PlayVoiceMessage';
import FileMessage from '../components/FileMessage';

const GroupDetails = ({ navigation }) => {
  const { chatClient } = useContext(AgoraContext);
  const { groupId, groupName } = useRoute().params;
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState('');
  let filePath;
  let displayName;
  let width;
  let height;
  let duration;
  let fileSize;
  let thumbnailLocalPath;

  const fetchMessages = async () => {
    const updatedMessages = await receivemessages(chatClient, groupId);
    console.log("CHATS: ", updatedMessages)
    setChats(updatedMessages);
  };

  useEffect(() => {
    fetchMessages();
    chatClient.getCurrentUsername().then(setUsername).catch(console.log);

    const messageListener = registerMessageListener(chatClient, groupId, setChats);
    return () => {
      chatClient.chatManager.removeMessageListener(messageListener);
    };

  }, [filePath, displayName]);

  const getUniqueChats = (chats) => {
    const seenIds = new Set();
    return chats.filter((chat) => {
      if (seenIds.has(chat.id)) {
        return false;
      }
      seenIds.add(chat.id);
      return true;
    });
  };

  const setFileData = async (pickedDoc) => {
    filePath = pickedDoc.fileUri;
    displayName = pickedDoc.fileName;
    fileSize = pickedDoc.fileSize;
    await handleSendMessage({ messageType: ChatMessageType.FILE });
  }

  const setImageData = async (pickedImage) => {
    filePath = pickedImage.fileUri;
    displayName = pickedImage.fileName;
    fileSize = pickedImage.fileSize;
    width = 150;
    height = 150;
    await handleSendMessage({ messageType: ChatMessageType.IMAGE });
  }

  const setVoiceMessageData = async (voiceMessage) => {
    filePath = voiceMessage.fileUri;
    displayName = voiceMessage.fileName;
    duration = voiceMessage.duration;
    await handleSendMessage({ messageType: ChatMessageType.VOICE });
  }

  const setVideoData = async (video) => {
    filePath = video.fileUri;
    displayName = video.fileName;
    duration = video.duration;
    await handleSendMessage({ messageType: ChatMessageType.VIDEO });
  }

  const handleSendMessage = async ({ messageType = null }) => {
    let msg;
    if (messageType === ChatMessageType.TXT) {
      msg = await sendmsg({
        chatClient, groupId, messageType,
        message
      });
      setChats(prevChats => [...prevChats, { id: msg.id, message: msg.message, sender: msg.sender, type: 'txt' }]);
      setMessage('');
    } else if (messageType === ChatMessageType.IMAGE) {
      msg = await sendmsg({
        chatClient, groupId, messageType,
        filePath,
        displayName
      });
      setChats(prevChats => [...prevChats, { id: msg.id, image: msg.image, sender: msg.sender, fileSize: msg.fileSize, type: 'img' }]);
    } else if (messageType === ChatMessageType.VOICE) {
      msg = await sendmsg({
        chatClient, groupId, messageType,
        filePath,
        displayName,
        fileSize,
        duration,
      });
      setChats(prevChats => [...prevChats, { id: msg.id, voice: msg.voice, sender: msg.sender, duration: msg.duration, fileSize: msg.fileSize, type: 'voice' }]);
    } else if (messageType === ChatMessageType.FILE) {
      msg = await sendmsg({
        chatClient, groupId, messageType,
        filePath,
        displayName,
        fileSize
      });
      setChats(prevChats => [...prevChats, { id: msg.id, localUrl: msg.localUrl, remoteUrl: msg.remoteUrl , sender: msg.sender, displayName: msg.displayName, fileSize: msg.fileSize, type: 'file' }]);
    } else if (messageType === ChatMessageType.VIDEO) {
      msg = await sendmsg({
        chatClient, groupId, messageType,
        filePath,
        displayName,
        thumbnailLocalPath,
        duration,
      });
      setChats(prevChats => [...prevChats, { id: msg.id, video: msg.video, sender: msg.sender, displayName: msg.displayName, duration: msg.duration, type: 'video' }]);
    }

  };

  const renderChatItem = ({ item }) => {
    return (
      <View
        className={`p-2 border-b-0 rounded-2xl max-w-xs mb-4 ${item.sender === username ?
          item.type === 'txt' || item.type === 'voice' ? 'bg-blue-600 self-end mr-4' : 'self-end mr-4' :
          item.type === 'txt' || item.type === 'voice' ? 'bg-green-500 self-start ml-4' : 'self-start ml-4'}`}
      >
        <Text className="text-white font-bold text-lg ml-2">{item.sender}</Text>

        {/* Conditional rendering based on message type */}
        {item.type === 'txt' ? (
          <Text className="text-white">{item.message}</Text>
        ) : item.type === 'img' && item.image ? (
          <ImageMessage item={item}/>
        )
          : item.type === 'voice' && item.voice ? (
            <PlayVoiceMessage item={item} />
          ) : item.type === 'file' ? (
            <FileMessage item={item} />
          ) : item.type === 'video' ? (
            <VideoMessage item={item}/>
          ) : null}
      </View>
    );
  };



  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-dark p-4">
        <View className="flex-row justify-between items-center p-4">
          <Text className="text-2xl font-bold">{groupName}</Text>
          <TouchableOpacity
            className="ml-2 bg-blue-500 p-3 rounded-full"
            onPress={() => navigation.navigate('GroupInfo', { groupId: groupId, groupName: groupName })}
          >
            <Text className="text-white">Group Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={getUniqueChats(chats)}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Input Section */}
      <View className="flex-row items-center p-4 border-t border-0 bg-dark">
        <TextInput
          className="flex-1 border rounded-full p-2 border-gray-300"
          placeholder="Type your message..."
          onChangeText={text => setMessage(text)}
          value={message}
        />
        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2.5 rounded-full"
          onPress={() => handleSendMessage({ messageType: ChatMessageType.TXT })}
        >
          <Text className="text-black">Send</Text>
        </TouchableOpacity>

        {/* Upload Files Component */}
        <UploadFiles setImageData={setImageData} setFileData={setFileData} setVoiceMessageData={setVoiceMessageData} setVideoData={setVideoData} />
        {/* Record Voice Message Component */}
        <RecordVoice setVoiceMessageData={setVoiceMessageData} />
      </View>
    </View>
  );
};

export default GroupDetails;
