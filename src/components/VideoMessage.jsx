import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { createThumbnail } from "react-native-create-thumbnail";

const VideoMessage = ({ item }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const deviceHeight = Dimensions.get('window').height
    const deviceWidth = Dimensions.get('window').width
    const [thumbnailSrc, setThumbnailSrc] = useState(null);

    useEffect(() => {
        createThumbnail({
            url: item.video
        })
            .then(response => {
                const thumnail = response.path || response;
                setThumbnailSrc(thumnail);
            })
            .catch(err => {
                console.log({ err });
            });
    }, [])

    const handleVideoPress = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <View className="bg-blue-600 p-1 rounded-lg">
            {/* Video Thumbnail (use an Image for preview) */}
            <TouchableOpacity
                onPress={handleVideoPress}
            >
                <Image
                    source={{uri: thumbnailSrc}}
                    style={{ width: 250, height: 250 }}
                    className="rounded-lg mt-2"
                />
                {/* <Text className="font-bold mt-2 text-black">{item.displayName}</Text> */}
            </TouchableOpacity>

            {/* Modal to play video */}
            {isModalVisible && (
                <Modal visible={isModalVisible} transparent={true} onRequestClose={handleModalClose}>
                    <TouchableOpacity
                        onPress={handleModalClose}
                        className="flex-1 justify-center items-center bg-black bg-opacity-75"
                    >
                        <Video
                            source={{ uri: item.video }}
                            style={{ width: deviceWidth, height: deviceHeight }}
                            controls={true}
                            resizeMode="contain"
                            onError={(error) => console.log('Video Error:', error)}  // Error handling
                        />
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default VideoMessage;
