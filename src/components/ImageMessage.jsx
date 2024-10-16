import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const ImageMessage = ({ item }) => {
    const navigation = useNavigation()

    const handleImageClick = (imageUri) => {
        navigation.navigate('FullImage', { imageUri:imageUri });
    };

    return (
        <>
            <View className="bg-blue-600 p-1 rounded-lg" >
                <TouchableOpacity onPress={() => handleImageClick(item.image)}>
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: 250, height: 250 }}
                        className="rounded-lg mt-2 bg-blue-400"
                        // resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default ImageMessage