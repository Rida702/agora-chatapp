import React from 'react';
import { TouchableOpacity, Image, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const UploadFiles = () => {

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true
      });
      console.log(doc)
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User Cancelled the Upload",err)
      else
        console.log(error)
    }
  }


  return (
    <>
      {/* <TouchableOpacity
        className="ml-2 bg-blue-500 p-2 rounded-full"
        onPress={pickImage}
      >
        <Image source={require('../../assets/icons/attach-file.png')}
          resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity> */}

      <TouchableOpacity
        className="ml-2 bg-green-500 p-2 rounded-full"
        onPress={selectDoc}
      >
        <Image source={require('../../assets/icons/attach-file.png')}
          resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
    </>
  );
};

export default UploadFiles;
