import React, { useEffect, useRef, useState } from 'react';
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
import CloudDialog from '@/dialogs/CloudDialog';
import FolderUploadDialog from '@/dialogs/FolderUploadDialog';
import { Audio } from 'expo-av';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CryptoJS from 'crypto-js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimerWithWave from './TimeWithWave';
import AudioPlayerWithVisualizer from './AudioPlayerWithVisualizer';
const { width } = Dimensions.get('window');
const colors = themeSettings("dark");
const socket = io('https://surf-jtn5.onrender.com');

const MessageInputArea = ({zone,qube,setmessages,messagetag,members,commkey, qubename, hubname}) => {
  const [tag,settag]=useState(messagetag||'');
  const [message, setMessage] = useState(tag||'');
  ////(message);
 ////(zone);
  const [showMenu, setShowMenu] = useState(false);
  const {_id,username,avatar_url,color}=useSelector((state)=>state.auth.user);
  const [filetoshare,setfiletoshare]=useState(null);
  const [sharefile,setsharefile]=useState(null);
  const [filedata,setfiledata]=useState('');
  const [currentuuid,setcurrentuuid]=useState('');
  const [cloud,setcloud]=useState(false);
  const [folderupload,setfolderupload]=useState(false);
  const inputRef = useRef(null);
  const [files,setfiles]=useState([]);
  const [foldername,setfoldername]=useState('');
  const [isTyping,setisTyping]=useState(false);
  const typingTimeoutRef=useRef();
  const [recording, setRecording] = useState(false);
  const [size,setsize]=useState();
  const[startrec,setstartrec]=useState(false);
  const [showrec,setshowrec]=useState(undefined);
  ////(commkey);
  const handleclosecloud=()=>{
    setcloud(false);
  }
  useEffect(()=>{
    settag(messagetag)
  },[messagetag])
  useEffect(()=>{
    setMessage(tag)
    
  },[tag])
  useEffect(()=>{
    ////(files);
  },[folderupload])
  useEffect(()=>{
    const getuuid=()=>{
      setcurrentuuid(uuid.v4());
      ////(currentuuid);
    }
    getuuid();
  },[sharefile, files]);
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
       {//console.log(result.assets[0]);
        setsharefile(result.assets[0]);
         base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setfiledata(`data:${result.assets[0].mimeType};base64,${base64}`);
         setsize((result.assets[0].size / (1024 * 1024)).toFixed(4));
         
    }
      ////(data);
    } catch (error) {
      //(error);
    }
  }
  
  const handleSend = async() => {
    if((!sharefile || sharefile?.cloud) &&!showrec )
    { if(files.length===0)
      { const encmess = CryptoJS.AES.encrypt(message, commkey).toString();
        let newMessage = {
      text: encmess,
      senderName: username,
      senderAvatar: avatar_url,
      sender_id: _id,
      name_file:sharefile?.name,
      file:sharefile?.uri,
      folder:sharefile?.folder,
      reactions: null,
      zone: zone,
      qube:qube,
      members:members,
      qubename:qubename,
      hubname:hubname,
      color:color
    };
    if(sharefile?.cloud && sharefile?.folder)
    newMessage={...newMessage, name_folder:sharefile?.name};
    setsharefile(undefined);
    setShowMenu(false);
    ////("Printing the first method");
    socket.emit('sendMessage', newMessage);
    setMessage('');}
  
  }
    else if(sharefile && sharefile.uri && sharefile.mimeType && sharefile.name){
      console.log(size);
      
      let newMessage={
        text:message,
        senderName:username,
        senderAvatar:avatar_url,
        sender_id:_id,
        name_file:sharefile.name,
        file:sharefile.uri,
        zone:zone,
        qube:qube,
        uuid:currentuuid,
         qubename:qubename,
       hubname:hubname,
       color:color
      };
      setmessages((prevmessages)=>[...prevmessages,newMessage]);
      setMessage('');
      setsharefile();
      setShowMenu(false);
      //console.log(size);
      
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
      
      formData.append("qubename",qubename);
      formData.append("hubname",hubname);
      members.forEach((member)=>{
        formData.append("members",member);
      });
      formData.append("color",color);
      formData.append("store",sharefile.uri);
      //setprogress(false); 
      
      
      try {
        
        const result = await fetch(`https://surf-jtn5.onrender.com/message/file`, {
          method: "POST",
         // headers: { "Content-Type":"multipart/form-data" },
          body: formData,
        });
        console.log(result);
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
    ////("hellooo");
    if(foldername){
      let newMessage={
        text:message,
        senderName:username,
        senderAvatar:avatar_url,
        sender_id:_id,
        name_folder:foldername,
        //filesarray:files,
        zone:zone,
        qube:qube,
        uuid:currentuuid,
        color:color
      };
      setmessages((prevmessages)=>[...prevmessages,newMessage]);
      setShowMenu(false);
      setfiles([]);
      ////(files);

      setfoldername('');
      const formData=new FormData();
      formData.append("text", message);
      formData.append("senderName", username);
      formData.append("senderAvatar", avatar_url);
      formData.append("sender_id", _id);
      files.forEach((file)=>{
       
      formData.append("files", file);});
      formData.append("foldername", foldername);
      formData.append("zone", zone);
      formData.append("qube",qube);
      formData.append("uuid",currentuuid);
       formData.append("qubename",qubename);
      formData.append("hubname",hubname);
      members.forEach((member)=>
      formData.append("members",member))
      formData.append("color",color);
      ////(JSON.stringify(formData));
      try {
        const result = await fetch(`https://surf-jtn5.onrender.com/message/folder`, {
          method: "POST",
          //  headers: { "Content-Type":"multipart/form-data" },
          body: formData,
        });
        const data=await result.json();
        //(data);
      } catch (error) {
        //("error sending folder:",error);
      }
    }

    if(showrec){
      let newMessage={
        text:message,
        senderName:username,
        senderAvatar:avatar_url,
        sender_id:_id,
        voice:showrec,
        zone:zone,
        qube:qube,
        uuid:currentuuid,
        color:color
      };
      setmessages((prevmessages)=>[...prevmessages,newMessage]);
      setRecording(undefined);
      setshowrec(undefined);
      const formData=new FormData();
      formData.append("text", message);
      formData.append("senderName", username);
      formData.append("senderAvatar", avatar_url);
      formData.append("sender_id", _id);
      formData.append("audio", {
        uri:showrec,
        type: 'audio/mpeg', 
        name: `${currentuuid}.mp3`
      });
      //formData.append("foldername", foldername);
      formData.append("zone", zone);
      formData.append("qube",qube);
      formData.append("uuid",currentuuid);
       formData.append("qubename",qubename);
      formData.append("hubname",hubname);
      members.forEach((member)=>
      formData.append("members",member))
      formData.append("color",color);
      //console.log(JSON.stringify(formData));
      try {
        const result = await fetch(`https://surf-jtn5.onrender.com/message/audio`, {
          method: "POST",
          //  headers: { "Content-Type":"multipart/form-data" },
          body: formData,
        });
        const data=await result.json();
        //(data);
      } catch (error) {
        console.log(error);
      }
    }
    
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if(sharefile)
      setsharefile(undefined);
    if(filetoshare)
      setfiletoshare(undefined);
    if(foldername)
      setfoldername('');
    if(files.length>0)
      setfiles([]);
  };

  const handlesharefromcloud=(file)=>{
    let data;
    if(file.file_name)
    data={name:file.file_name, uri:file.file_url, cloud:true}
  else
  {
    data={name:file.name_folder,folder:file.folder, cloud:true}
  }
    setsharefile(data);
    setcloud(false);
    //(file);
    ////(!sharefile);
  }

  const handleclosefolderdialog=()=>{
    ////(files[0]);
    setfolderupload(false);
    
  }

  const handletyping=(e)=>{
    setMessage(e);
    if (!isTyping) {
      setisTyping(true);
      socket.emit('StartType', { sender_name: username, qube, zone });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setisTyping(false);
      socket.emit('StopType', { sender_name: username, qube, zone });
    }, 1000); // 3 seconds of inactivity
  }

  async function startRecording() {
    if(!recording)
    {try {
      //('Requesting permissions..');
      const permission = await Audio.requestPermissionsAsync();
  
      if (permission.status === 'granted') {
        //('Starting recording..');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        setstartrec(true);
        const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 592000, // Higher sample rate for better quality
        numberOfChannels: 2, // Stereo sound
        bitRate: 312000, // Higher bitrate for better quality
      },
      ios: {
        extension: '.m4a',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100, // Standard high-quality rate
        numberOfChannels: 2, // Stereo sound
        bitRate: 128000, // Higher bitrate for better quality
        linearPCMBitDepth: 16, // 16-bit depth
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    });

    await recording.startAsync();
    setRecording(recording);
    
        //('Recording started');
      } else {
        //('Permission to record audio not granted');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }}
    else{
      stopRecording();
    }
  }
  
  // Function to stop recording
  async function stopRecording() {
    //('Stopping recording..');
    setRecording(undefined);
    setstartrec(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); // Use this URI to get the audio file
    //('Recording stopped and stored at', uri);
   // setRecording(uri);
    // const { sound } = await Audio.Sound.createAsync(
    //   { uri: uri },
    //   { shouldPlay: true }  // Automatically play the sound once loaded
    // );
    setshowrec(uri);
    //console.log(showrec);
    // Optionally handle sound playback lifecycle
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        //('Playback finished');
      }
    });
  }

  return (
    <View style={styles.container}>
      
      {/* Attachment Icon */}
      
      {!startrec && !recording && !showrec && (<TouchableOpacity onPress={toggleMenu} style={[styles.attachmentButton,
        {
            transform: [{ rotate: showMenu ? '45deg' : '0deg' }]
        }]}>
      <Entypo name="plus" size={28} color='white' />
      </TouchableOpacity>)}

      {/* Text Input */}
      {!showMenu?(<>{!startrec && !showrec?(<TextInput
        style={[styles.input]}
        ref={inputRef}
        placeholder="Message..."
        placeholderTextColor="#aaa"
        value={message}
        multiline
        onChangeText={handletyping}
        
      />):startrec?(<TimerWithWave/>):showrec&&(<AudioPlayerWithVisualizer audioUri={showrec}/>)}
      {!message.trim() && !showrec && (
        <>
        <TouchableOpacity style={styles.sendButton} onPress={() => { startRecording(); }}>
         {!recording ?( <FontAwesome name="microphone" size={24} color="white" />):
         ( <MaterialCommunityIcons name="motion-pause-outline" size={20} color="white" />)}
        </TouchableOpacity>
         
       </>
      )}
      {showrec && (
        <TouchableOpacity style={styles.sendButton} onPress={()=>{setRecording(undefined); setshowrec(undefined);}}>
          <MaterialIcons name="delete" size={26} color="#FF6347" />
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity style={styles.sendButton} onPress={() => {  }}>
      <MaterialIcons name="emoji-emotions" size={24} color="white" />
      </TouchableOpacity> */}
      </>):(
        <View style={styles.menu}>
          {!sharefile && !foldername?(<>
            <TouchableOpacity style={styles.menuItem} onPress={() => {setcloud(true)}}>
         <Entypo name="thunder-cloud" size={19} color="white" />
         <Text style={styles.menuText}>Cloud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={selectFiles}>
          <Icon name="document-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={()=>setfolderupload(true)}>
          <Icon name="folder-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Folder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="videocam-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Video</Text>
        </TouchableOpacity>
        </>):(<View>
        {sharefile?.name?.endsWith('jpeg') || sharefile?.name?.endsWith('png') || sharefile?.name?.endsWith('jpg')?
        ( <Image source={{uri:sharefile.uri}}  style={[{width:'100%', height:240,marginRight:250, borderRadius:20}]}/>
        ):sharefile?.name?.endsWith('pdf') && ( 
        <Icon name="document-outline" size={30} color="red" style={[{textAlign:'center',marginRight:200, width:'100%'}]}/>
        )}
        
      {foldername || sharefile?.folder ? (<FontAwesome name="folder-open" size={30} color="orange" style={[{textAlign:'center',marginRight:200, width:'100%', alignContent:'center'}]}/>):(<></>)}
       {sharefile && ( <Text style={[{color:'white', 
           marginLeft:20,
           marginTop:10, 
           fontSize:10,
           textAlign:'center'
           }]}>{sharefile.name}</Text>)}
            {foldername ? ( <Text style={[{color:'white', 
           marginLeft:20,
           marginTop:10, 
           fontSize:10,
           textAlign:'center'
           }]}>{foldername}</Text>):(<></>)}
          
        </View>)}
      </View>
      )}

      {/* Send Button */}
      <TouchableOpacity onPress={()=>{if(message.trim() || sharefile || filetoshare || foldername || showrec)handleSend();}} style={styles.sendButton}>
        <Icon name="send" size={28} color="#fff" />
      </TouchableOpacity>
      <CloudDialog visible={cloud} onClose={handleclosecloud} handlesharefromcloud={handlesharefromcloud}/>
      <FolderUploadDialog visible={folderupload} onClose={()=>handleclosefolderdialog()} setFiles={setfiles} setNameFolder={setfoldername}/>
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
