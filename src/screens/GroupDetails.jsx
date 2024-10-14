import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendmsg, receivemessages, registerMessageListener } from '../agora/groupManager';

import AgoraContext from '../context/AgoraContext';
import UploadFiles from '../components/UploadFiles';
import { ChatMessageType } from 'react-native-agora-chat';
import RecordVoice from '../components/RecordVoice';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';


const GroupDetails = ({ navigation }) => {
  const { chatClient, isInitialized } = useContext(AgoraContext);
  const { groupId, groupName } = useRoute().params;
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [playTime, setPlayTime] = useState('00:00');
  const [durationVM, setDuration] = useState('00:00');
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  let filePath;
  let displayName;
  let width;
  let height;
  let duration;

  const fetchMessages = async () => {
    const updatedMessages = await receivemessages(isInitialized, chatClient, groupId);
    console.log("CHATS: ", updatedMessages)
    setChats(updatedMessages);
  };

  useEffect(() => {
    fetchMessages();
    chatClient.getCurrentUsername().then(setUsername).catch(console.log);

    const messageListener = registerMessageListener(chatClient, groupId, setChats);
    console.log("messageListener Chats: ", chats)
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

  const setImageData = async (pickedImage) => {
    filePath = pickedImage.fileUri;
    displayName = pickedImage.fileName;
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

  const handleSendMessage = async ({ messageType = null }) => {
    let msg;
    if (messageType === ChatMessageType.TXT) {
      msg = await sendmsg({
        isInitialized, chatClient, groupId, messageType,
        message
      });
      setChats(prevChats => [...prevChats, { id: msg.id, message: msg.message, sender: msg.sender, type: 'txt' }]);
      setMessage('');
    } else if (messageType === ChatMessageType.IMAGE) {
      msg = await sendmsg({
        isInitialized, chatClient, groupId, messageType,
        filePath,
        displayName,
        width,
        height,
      });
      setChats(prevChats => [...prevChats, { id: msg.id, image: msg.image, sender: msg.sender, type: 'img' }]);
    } else if (messageType === ChatMessageType.VOICE) {
      msg = await sendmsg({
        isInitialized, chatClient, groupId, messageType,
        filePath,
        displayName,
        duration,
      });
      setChats(prevChats => [...prevChats, { id: msg.id, voice: msg.voice, sender: msg.sender, time: msg.duration, type: 'voice' }]);
    }

  };

  const handlePlayPause = async (item, Id) => {
    setCurrentlyPlayingId(Id);
    if (!isPlaying) {
      // Start playing
      setIsPlaying(true); //Now it's playing 
      const result = await audioRecorderPlayer.startPlayer(item.voice);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setPlayTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)));
        if (Math.ceil(e.currentPosition / 1000) === item.duration) {
          setIsPlaying(false);
          // console.log("Player Stopped.")
          // console.log("isPlaying",isPlaying)
          audioRecorderPlayer.stopPlayer();
        }
      });
    } else {
      // Pause playing
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    }
  };

  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60); // Get the minutes
    const seconds = duration % 60; // Get the remaining seconds
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Format MM:SS
  };


  const renderChatItem = ({ item }) => {
    return (
      <View
        className={`p-2 border-b rounded-2xl max-w-xs mb-4 ${item.sender === username ?
          item.type !== 'img' ? 'bg-blue-600 self-end mr-4' : 'self-end mr-4' :
          item.type !== 'img' ? 'bg-green-500 self-start ml-4' : 'self-start ml-4'}`}
      >
        <Text className="text-white font-bold text-lg ml-2">{item.sender}</Text>

        {/* Conditional rendering based on message type */}
        {item.type === 'txt' ? (
          <Text className="text-white">{item.message}</Text>
        ) : item.type === 'img' && item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 150, height: 150 }}
            className="rounded-lg mt-2 bg-blue-400"
          />
        )
          : item.type === 'voice' && item.voice ? (
            <View className="flex-row items-center mt-1">
              <TouchableOpacity
                onPress={() => handlePlayPause(item, item.id)}
                className=" rounded-full w-[150px] h-[22px] justify-center items-start"
              >
                {isPlaying && currentlyPlayingId === item.id ? (
                  <Image className="ml-3" source={require('../../assets/icons/pause.png')} style={{ width: 15, height: 15 }} />
                ) : (
                  <Image className="ml-3" source={require('../../assets/icons/play-button.png')} style={{ width: 15, height: 15 }} />
                )}
              </TouchableOpacity>
              {isPlaying && currentlyPlayingId === item.id ? (
                <Text className="mr-6 text-white">
                  {playTime}
                </Text>
              ) : !isPlaying ? (
                <Text className="mr-6 text-white">
                  {formatTime(item.duration)}
                </Text>
              ): (
                <Text className="mr-6 text-white">
                  {formatTime(item.duration)}
                </Text>
              )}
            </View>
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
        {/* Upload Files Component */}
        <UploadFiles setImageData={setImageData} />
        {/* Record Voice Message Component */}
        <RecordVoice setVoiceMessageData={setVoiceMessageData} />

        <TouchableOpacity
          className="ml-2 bg-blue-500 p-2.5 rounded-full"
          onPress={() => handleSendMessage({ messageType: ChatMessageType.TXT })}
        >
          <Text className="text-black">Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GroupDetails;
