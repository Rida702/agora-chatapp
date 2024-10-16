import { Dimensions, ImageBackground, TouchableOpacity, Image, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

const FullImage = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const deviceHeight = Dimensions.get('window').height
  const deviceWidth = Dimensions.get('window').width
  const { imageUri } = route.params
  return (
    <>
      <ImageBackground
        source={{ uri: imageUri }}
        style={{ width: deviceWidth, height: deviceHeight }}
        className ="relative"
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-5 left-5 z-40 flex-row items-cente" >
        <Image source={require('../../assets/images/back-button.png')}
          resizeMode="contain" className="w-8 h-8 ml-3"
          tintColor='white'
         />
         <Text className="ml-3 mt-1" >Go Back</Text>
      </TouchableOpacity>
    </>
  )
}

export default FullImage