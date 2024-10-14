import React, { useState, useRef } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const RecordVoice = ({ setVoiceMessageData }) => {
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
    const [isRecording, setIsRecording] = useState(false); 
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingPath, setRecordingPath] = useState(null);
    const [fileName, setFileName] = useState(null);

    const createUniqueFileName = () => {
        const timestamp = new Date().getTime(); 
        return `audio_${timestamp}.mp4`; 
    };

    async function startRecording() {
        if (isRecording) {
            console.log('Recording already in progress.');
            return;
        }

        const uniqueFileName = createUniqueFileName();
        const path = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;
        setRecordingPath(path); 
        setFileName(uniqueFileName);

        try {
            setIsRecording(true);
            const result = await audioRecorderPlayer.startRecorder(path);
            console.log('Recording started:', result);

            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecordingDuration(e.currentPosition);
                console.log('Recording duration:', e.currentPosition);
            });
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }

    async function stopRecording() {
        if (!isRecording) {
            console.log('Recording is not in progress.');
            return; 
        }

        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
            console.log('Recording stopped:', result);

            const durationInSeconds = (recordingDuration / 1000).toFixed(2);

            console.log(`Recording file name: ${fileName}`);
            console.log(`Recording duration in seconds: ${durationInSeconds}`);
            console.log(`Recording file path: ${recordingPath}`);
            const voiceMessage = { fileUri: recordingPath, fileName: fileName, duration: durationInSeconds }
            setVoiceMessageData(voiceMessage);
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    }

    

    return (
        <>
            <TouchableOpacity
                className="ml-2 bg-blue-500 p-2 rounded-full"
                onPressIn={startRecording}
                onPressOut={stopRecording}
            >
                <Image source={require('../../assets/icons/voice-message.png') }
                    resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>
        </>
    );
};

export default RecordVoice;
