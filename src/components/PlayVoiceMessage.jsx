import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, {useState, useRef} from 'react'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const PlayVoiceMessage = ({ item }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
    const [playTime, setPlayTime] = useState('00:00');
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

    const handlePlayPause = async (item, Id) => {
        setCurrentlyPlayingId(Id);
        if (!isPlaying) {
            // Start playing
            setIsPlaying(true); //Now it's playing 
            const result = await audioRecorderPlayer.startPlayer(item.voice);
            audioRecorderPlayer.addPlayBackListener((e) => {
                setPlayTime(audioRecorderPlayer.mmss(Math.ceil(e.currentPosition / 1000)));
                if (Math.ceil(e.currentPosition / 1000) === item.duration) {
                    //Both timings should match to stop at correct time
                    // console.log("e.currentPosition: ",Math.ceil(e.currentPosition / 1000))
                    // console.log("item.duration: ",item.duration)
                    setIsPlaying(false);
                    console.log("Player Stopped.")
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
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Format MM:SS
    };


    return (
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
            ) :null}
        </View>
    )
}

export default PlayVoiceMessage