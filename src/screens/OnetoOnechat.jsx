// Imports dependencies.
import React, {useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
//To initialize Agora SDK
import AgoraContext from '../context/AgoraContext';
//Authorize User
import {login, logout} from '../agora/authAgora'
import {sendmsg} from '../agora/messageListener'


const OneToOneChat = () => {
  const { chatClient, isInitialized, appKey, chatManager } = useContext(AgoraContext);
  const title = 'AgoraChatQuickstart';
  //Logged In user
  const [username, setUsername] = React.useState('rida1234sahd');
  //Logged In user token
  const [chatToken, setChatToken] = React.useState('007eJxTYPD8scZknUg11we1Te+vnVjI98760xudE4u337xmnvLRt+SbAkOioaGFkaWxcVJaopGJeZqRhZGFsVFiYqKhuWmSmYGFyZ1F/9MaAhkZGi5kMTEysDIwAiGIr8JgmpRoZGaQbKBrYWBprmtomJqmm2SRaKlraZpkbmpuZppimZYCANHMKt0=');
  // Person you want to send the message
  const [targetId, setTargetId] = React.useState('');
  // Message Content
  const [content, setContent] = React.useState('');
  
  // Renders the UI.
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter username"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter chatToken"
            onChangeText={text => setChatToken(text)}
            value={chatToken}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.eachBtn} 
          onPress={() => login(isInitialized, chatClient, username, chatToken)}
          >
            SIGN IN
          </Text>
          <Text style={styles.eachBtn} 
          onPress={() => logout(isInitialized, chatClient)}
          >
            SIGN OUT
          </Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter the username you want to send"
            onChangeText={text => setTargetId(text)}
            value={targetId}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter content"
            onChangeText={text => setContent(text)}
            value={content}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.btn2} 
          onPress={() => sendmsg(isInitialized,chatClient,targetId,content)}
          >
            SEND TEXT
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// Sets UI styles.
const styles = StyleSheet.create({
  titleContainer: {
    height: 60,
    backgroundColor: '#6200ED',
  },
  title: {
    lineHeight: 60,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  inputCon: {
    marginLeft: '5%',
    width: '90%',
    height: 60,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputBox: {
    marginTop: 15,
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonCon: {
    marginLeft: '2%',
    width: '96%',
    flexDirection: 'row',
    marginTop: 20,
    height: 26,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eachBtn: {
    height: 40,
    width: '28%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  btn2: {
    height: 40,
    width: '45%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
});
export default OneToOneChat;
