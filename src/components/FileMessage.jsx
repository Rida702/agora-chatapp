import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import FileViewer from "react-native-file-viewer";
import RNFS from 'react-native-fs';

const FileMessage = ({ item }) => {
    const extension = item.displayName.split('.').pop();
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1000;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = (bytes / Math.pow(k, i)).toFixed(2); 
        return `${Math.ceil(size)} ${sizes[i]}`; 
    }

    const handleFileClick = async (remoteUrl, displayName) => {
        console.log("remoteUrl: ", remoteUrl);
        console.log("displayName: ", displayName);
        const localFile = `${RNFS.DocumentDirectoryPath}/${displayName}`;
        console.log("localFile: ", localFile);

        try {
            console.log("Starting download...");

            await RNFS.downloadFile({
                fromUrl: remoteUrl,
                toFile: localFile,
                progressCallback: (progress) => {
                    console.log(`Download progress: ${progress.bytesWritten}/${progress.contentLength}`);
                },
            }).promise;

            console.log("Download successful, opening file...");

            // Open the downloaded file
            await FileViewer.open(localFile);
            console.log("File opened successfully");
        } catch (error) {
            console.log("Error during download or file opening: ", error);
        }
    };


    return (
        <View className="flex-row items-center mt-1 bg-blue-600 p-1 rounded-lg" >
            <TouchableOpacity
                onPress={() => handleFileClick(item.remoteUrl, item.displayName)}
                className="flex-row items-center p-4 bg-gray-200 rounded-lg w-[260px] h-[120px]"
            >
                { extension==='pdf' ? (
                    <Image
                    source={require('../../assets/icons/pdf.png')}
                    className="w-8 h-8 mr-3"
                />
                ) : extension==='docx' ? (
                    <Image
                    source={require('../../assets/icons/docx.png')}
                    className="w-8 h-8 mr-3"
                    tintColor='#1140c2'
                />
                ): extension==='txt' ? (
                    <Image
                    source={require('../../assets/icons/txt.png')}
                    className="w-8 h-8 mr-3"
                />
                ): extension==='xlsx' ? (
                    <Image
                    source={require('../../assets/icons/xls.png')}
                    className="w-8 h-8 mr-3"
                />
                ): extension==='pptx' ? (
                    <Image
                    source={require('../../assets/icons/pptx.png')}
                    className="w-8 h-8 mr-3"
                    tintColor='#ab3c26'
                />
                ): extension==='zip' ? (
                    <Image
                    source={require('../../assets/icons/zip.png')}
                    className="w-8 h-8 mr-3"
                />
                ): 
                <Image
                    source={require('../../assets/icons/docs.png')}
                    className="w-8 h-8 mr-3"
                />}
                
                <View className="flex-1">
                    <Text className="font-bold text-black">{item.displayName}</Text>
                    <Text className="text-black mt-2">{formatFileSize(item.fileSize)} - {extension}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default FileMessage