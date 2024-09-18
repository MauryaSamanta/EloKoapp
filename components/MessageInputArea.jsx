import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library
import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for the mic icon
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { themeSettings } from '../constants/Colors';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
const { width } = Dimensions.get('window');
const colors = themeSettings("dark");
const socket = io('https://surf-jtn5.onrender.com');

const MessageInputArea = ({zone,qube,setmessages}) => {
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const {_id,username,avatar_url}=useSelector((state)=>state.auth.user);
  const [filetoshare,setfiletoshare]=useState(null);
  const [sharefile,setsharefile]=useState();
  const [filedata,setfiledata]=useState('');
  const [currentuuid,setcurrentuuid]=useState('');
  useEffect(()=>{
    const getuuid=()=>{
      setcurrentuuid(uuid.v4());
      console.log(currentuuid);
    }
    getuuid();
  },[sharefile]);
  const selectFiles=async()=>{
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // To allow all file types or specify types like 'application/pdf', 'image/*'
        copyToCacheDirectory: true,
        multiple: false, // Set true if you want to allow multiple file selection
      });
      let base64;
      let data;
      if(result.assets)
       {setsharefile(result.assets[0]);
         base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setfiledata(`data:${result.assets[0].mimeType};base64,${base64}`);
        //console.log(filedata);
    }
      //console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSend = async() => {
    if(!filetoshare && !sharefile)
    {let newMessage = {
      text: message,
      senderName: username,
      senderAvatar: avatar_url,
      sender_id: _id,
      // name_file:filetoshare?.file_name,
      // file: filetoshare?.file_url,
      // folder:filetoshare?.folder,
      // name_folder:filetoshare?.name_folder,
      reactions: null,
      zone: zone,
      qube:qube
    };
    // if(zone && qube)
    // {
    //   newMessage={...newMessage,zone:zone};
    // }
    socket.emit('sendMessage', newMessage);
    setMessage('');}
    else if(sharefile && sharefile.uri && sharefile.mimeType && sharefile.name){
      console.log("hello");
      let newMessage={
        text:message,
        senderName:username,
        senderAvatar:avatar_url,
        sender_id:_id,
        name_file:sharefile.name,
        file:sharefile.uri,
        zone:zone,
        qube:qube,
        uuid:currentuuid
      };
      setmessages((prevmessages)=>[...prevmessages,newMessage]);
      setMessage('');
      setsharefile();
      setShowMenu(false);
      const formData=new FormData();
      formData.append("text", message);
      formData.append("senderName", username);
      formData.append("senderAvatar", avatar_url);
      formData.append("sender_id", _id);
      formData.append("file", {
        uri:sharefile.uri,
        type:sharefile.mimeType,
        name:sharefile.name
      });
      formData.append("zone", zone);
      formData.append("qube",qube);
      formData.append("uuid",currentuuid);
      //setprogress(false);
      try {
        const result = await fetch(`https://surf-jtn5.onrender.com/message/file`, {
          method: "POST",
          body: formData,
        });
        const data = await result.json();
        if(data)
        {
          setmessages((prevMessages) => 
            prevMessages.filter((msg) => msg.file !== sharefile.uri)
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
      
    }
    
    
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if(sharefile)
      setsharefile(undefined);
  };

  return (
    <View style={styles.container}>
      
      {/* Attachment Icon */}
      <TouchableOpacity onPress={toggleMenu} style={[styles.attachmentButton,
        {
            transform: [{ rotate: showMenu ? '45deg' : '0deg' }]
        }]}>
      <Entypo name="plus" size={28} color='white' />
      </TouchableOpacity>

      {/* Text Input */}
      {!showMenu?(<><TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#aaa"
        value={message}
        multiline
        onChangeText={setMessage}
      />
      {!message.trim() && (
        <TouchableOpacity style={styles.sendButton} onPress={() => { /* handle mic press */ }}>
          <FontAwesome name="microphone" size={24} color="white" />
          
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.sendButton} onPress={() => { /* handle mic press */ }}>
      <MaterialIcons name="emoji-emotions" size={24} color="white" />
      </TouchableOpacity></>):(
        <View style={styles.menu}>
          {!sharefile?(<>
        <TouchableOpacity style={styles.menuItem} onPress={selectFiles}>
          <Icon name="document-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="folder-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Folder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="mic-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="videocam-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Video</Text>
        </TouchableOpacity>
        </>):(<View>
        {sharefile.name.endsWith('jpeg') || sharefile.name.endsWith('png') || sharefile.name.endsWith('jpg')?
        ( <Image source={{uri:sharefile.uri}}  style={[{width:'100%', height:240,marginRight:250, borderRadius:20}]}/>
        ):( 
        <Icon name="document-outline" size={30} color="red" style={[{textAlign:'center',marginRight:200, width:'100%'}]}/>
        )}
        <Text style={[{color:'white', 
           marginLeft:20,
           marginTop:10, 
           fontSize:10,
           textAlign:'center'
           }]}>{sharefile.name}</Text>
           
        </View>)}
      </View>
      )}

      {/* Send Button */}
      <TouchableOpacity onPress={()=>{if(message.trim() || sharefile || filetoshare)handleSend();}} style={styles.sendButton}>
        <Icon name="send" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    //width: width,
    paddingVertical: 10,
    backgroundColor: '#4D4599',
   borderTopLeftRadius:10,
   borderTopRightRadius:10
    //borderTopWidth: 1,
    //borderTopColor: '#ddd',
    //paddingHorizontal: 10,
  },
  attachmentButton: {
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#382F66',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: 'white',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sendButton: {
    backgroundColor: colors.colors.primary.main,
    padding: 10,
    borderRadius: 25,
    marginRight:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  menu: {
    backgroundColor: '#4D4599',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    //width: '100%',
    //justifyContent:'space-around',
    flexDirection:'row'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight:10
  },
  menuText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  micButton: {
    //position: 'absolute',
    right: 10, // Adjust the position to fit your design
    backgroundColor: '#555',
    borderRadius: 25,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageInputArea;
