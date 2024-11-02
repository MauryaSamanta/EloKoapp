import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Pressable, Button } from 'react-native';
import { Avatar } from 'react-native-paper';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons'; // Icons for PDF, Folder, etc.
import UserProfileDialog from '@/dialogs/UserProfileDialog';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Message, Member } from '@/types';
import MessageDrawer from '@/drawers/MessageDrawer';
import { useSelector } from 'react-redux';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Pdf from 'react-native-pdf';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
//import Video, {VideoRef} from 'react-native-video';
//import { useVideoPlayer, VideoView } from 'expo-video';
import { Video, ResizeMode } from 'expo-av';
import AudioPlayerWithVisualizer from './AudioPlayerWithVisualizer';
import AudioPlayerChat from './AudioPlayerChat';
interface ChatItemProps {
  message: Message;
  isOwnMessage: boolean;
  setdrawer:(x:boolean)=>void;
  setchat(x:Message):void;
  setmessage(x:string):void;
  setmessages:React.Dispatch<React.SetStateAction<Message[]>>;
}

const { width } = Dimensions.get('window');

const ChatItem: React.FC<ChatItemProps> = ({ message, isOwnMessage, setdrawer, setchat,setmessage, setmessages}) => {
  const [user, setUser] = useState<Member>();
  const [showCard, setShowCard] = useState(false);
  let { _id,sender_id, text, voice, senderAvatar, file, senderName, name_file, name_folder, createdAt, color,key, store  } = message;
  const [bgcolor,setbgcolor]=useState('transparent');
  const userlog=useSelector((state:any)=>state.auth.user);
  const [status, setStatus] = useState<any>({});
  const [downloading,setdownload]=useState(false);
  const ref=useRef<any>(null)
  let player=undefined
  const [fill, setFill] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFill((prevFill) => (prevFill >= 100 ? 0 : prevFill + 1));
  //   }, 50); // Adjust the interval time for speed

  //   return () => clearInterval(interval);
  // }, [downloading]);

  const showUser = async () => {
    if(!isOwnMessage)
    {try {
      const response = await fetch(`https://surf-jtn5.onrender.com/users/${sender_id._id || sender_id}`, {
        method: "GET"
      });
      const member = await response.json();
      setUser(member);
      setShowCard(true);
    } catch (error) {
      console.error(error);
    }}
  };
  const closeUser = () => {
    setShowCard(false);
  };

  const formatMessageTime = (date: any) => {
    const messageDate = parseISO(date);
    if (isToday(messageDate)) {
      return `Today ${format(messageDate, 'hh:mm a')}`;
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'hh:mm a')}`;
    } else {
      return format(messageDate, 'MMM dd hh:mm a');
    }
  };

  const renderHighlightedMessage = (text: string) => {
    const parts = text?.split(/(#\w+)/g);
    return parts.map((part, index) => (
      part.match(/#\w+/) ? (
        <Text key={index} style={styles.hashtag} onPress={()=>{setmessage(part);}}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    ));
  };
  
  const handlepressin=()=>{
    setbgcolor('rgba(153, 153, 153, 0.2)');
    
  }
  const handlepressout=()=>{
    setbgcolor('transparent');
  }

  const downloadfile=async()=>{
    const documentDir = FileSystem.documentDirectory&& FileSystem.documentDirectory + Date.now() + "_" + name_file; // Unique path
    setdownload(true);
    if(file && documentDir)
    {const fileres = await FileSystem.downloadAsync(file, documentDir);
      
    const storageKey = key;
    if(storageKey)
   { const storing=await AsyncStorage.setItem(storageKey, documentDir?documentDir:'');
    const x=await AsyncStorage.getItem(storageKey);
    setmessages((prevMessages:Message[]) => {
      const targetMessage = prevMessages.find((message) => message._id === _id);
      if (targetMessage && x) {
        targetMessage.file = x;
      }
      return [...prevMessages];
    });
  }
  setdownload(false);
}
  }
  
  return (
  <Pressable onLongPress={()=>{if(createdAt){setdrawer(true); setchat(message);}}} onPressIn={handlepressin} onPressOut={handlepressout} >
    {message.key && (<View style={[{position:'absolute',left:isOwnMessage? 10:null,right:isOwnMessage?null:10, top:'50%', borderRadius:100, 
    borderColor:'#7D7D7D'
      ,borderWidth:1, alignItems:'center', justifyContent:'center'
    }]} >
      <Ionicons name="information" size={22} color="#7D7D7D" onPress={()=>{console.log('pressed')}} />
    </View>)}
    <View style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row', marginBottom: 20, backgroundColor:bgcolor, borderRadius:20 }}>
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        <View style={[styles.header, isOwnMessage && { justifyContent: 'flex-end' }]}>
          {!isOwnMessage && (
            <>
              <Avatar.Image size={40} source={{ uri: sender_id.avatar_url || senderAvatar }} style={styles.avatar} />
              <Text style={[styles.senderName,{color:sender_id.color||color||'white'}]} onPress={showUser}>{sender_id.username || senderName}</Text>
             {createdAt ? ( <Text style={styles.timestamp}>{formatMessageTime(createdAt)}</Text>):(
                 <Text style={[styles.timestamp,{marginRight:10,marginTop:0}]}>sending...</Text>
             )}
            </>
          )}
          {isOwnMessage && (
            <>
             {createdAt ? ( <Text style={[styles.timestamp,{marginRight:10,marginTop:0}]}>{formatMessageTime(createdAt)}</Text>):(
              <Text style={[styles.timestamp,{marginRight:10,marginTop:0}]}>sending...</Text>
             )}
              <Text style={[styles.senderName,{color:sender_id.color||color||'white'}]}>{sender_id.username || senderName}</Text>
              <Avatar.Image size={35} source={{ uri: sender_id.avatar_url || senderAvatar }} style={styles.ownAvatar} />
            </>
          )}
        </View>

        {user && <UserProfileDialog open={showCard} user={user} onClose={closeUser} />}

        <View style={[styles.content, { marginLeft:  !file && !isOwnMessage?50:0 }]}>
          
          {name_folder && (
            <View style={[{backgroundColor:'#4D4599', padding:5, borderRadius:8, marginBottom:30}]}>
              <Entypo name="folder" size={40} color="#ff9800" />
              <Text style={[styles.fileName]}>{name_folder}</Text>
            </View>
          )}

          {file && (
            <View style={styles.fileContainer}>
              {name_file?.endsWith('.pdf') ? (
                <View style={[{backgroundColor:'#4D4599', padding:5, borderRadius:8, marginBottom:30}]}>
                  {/* <MaterialIcons name="picture-as-pdf" size={40} color="#d32f2f" /> */}
                  {/* <Text style={styles.fileName}>{name_file}</Text> */}
                 
                     {file?.endsWith('.pdf')?(<Pdf
                     trustAllCerts={false}
                       source={{ uri: file, cache:true }}
                       style={[styles.image,{height:165}]}
                       singlePage={true}
                       scale={2.3}
                       progressContainerStyle={[{backgroundColor:'#eee'}]}
                     
                       onLoadComplete={(numberOfPages, filePath) => {
                         //(`Number of pages: ${numberOfPages}`);
                       }}
                       onPageChanged={(page,numberOfPages) => {
                         //(`Current page: ${page}`);
                     }}
                       onError={(error) => {
                         //(error);
                       }}
                     />):(<View style={[{backgroundColor:'rgba(255,255,255,0.5)', height:200, width:250, justifyContent:'center', alignItems:'center'
                      , borderRadius:8
                     }]}>
                        {!downloading?(<Entypo name="download" size={50} color="#292929" onPress={()=>{downloadfile();}}/>):(
                          <AnimatedCircularProgress
                          size={30}
                          width={4}
                          fill={fill}
                          tintColor="white"
                          //onAnimationComplete={() => //('')}
                          backgroundColor="#4D4599"
                          rotation={0}
                          lineCap="round" />
                        )}
                     </View>)}
                  
                  <Text style={[styles.fileName,{position:'absolute',
                   top:170, 
                   backgroundColor:'#4D4599', 
                   borderBottomRightRadius:8
                    ,paddingHorizontal:10, 
                    textAlign:'left', 
                    width:260,
                    //height:60, 
                    left:-10,
                    borderBottomLeftRadius:8,
                    padding:8,
                    borderTopLeftRadius:-8}]} >{name_file}</Text>
                </View>
              ) : name_file?.endsWith('.mp4') ?(
                <View style={[{position:'relative'}]}>
                <Video
                ref={ref}
                style={styles.image}
                source={{
                  uri: file,
                }}
                //useNativeControls
                //resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
              <View style={styles.buttonContainer}>
        <TouchableOpacity
          //title={status?.isPlaying ? 'Pause' : 'Play'}
          style={[{backgroundColor:'#635acc', borderRadius:50, padding:15}]}
          onPress={() =>
            {if(ref && ref.current)
              status.isPlaying ? ref.current.pauseAsync() : ref.current.playAsync()
            }
          }
        >
          <AntDesign name={status.isPlaying?"pause":"caretright"} size={24} color="#292929" />
          </TouchableOpacity>
      </View>
              </View>

              ):name_file?.endsWith('.doc') || name_file?.endsWith('.docx') || name_file?.endsWith('.xslx') || name_file?.endsWith('.ppt')
              || name_file?.endsWith('.pptx')?(
                <View style={[{backgroundColor:'#4D4599', padding:3, borderRadius:8, flexDirection:'row', width:'100%'}]}>
                  <View style={[{backgroundColor:'#382F66', padding:12,borderRadius:8, flexDirection:'row', width:'100%', alignItems:'center'}]}>
                  {name_file?.endsWith('.doc') || name_file?.endsWith('.docx')?(<Entypo name="text-document-inverted" size={30} color="#635acc" />
                  ):
                   name_file?.endsWith('.xslx')?(<Entypo name="spreadsheet" size={30} color="green" />)
                   :(<MaterialCommunityIcons name="presentation" size={30} color="red" />)}
                   <Text style={[styles.fileName,{marginRight:20}]}>{name_file}</Text>
                   {!file?.endsWith('.doc') && !file?.endsWith('.docx') && !file?.endsWith('.xslx') && file?.endsWith('.ppt')
              && file?.endsWith('.pptx') &&(
                <>
              {!downloading?(<Entypo name="download" size={50} color="#292929" onPress={()=>{downloadfile();}}/>):(<AnimatedCircularProgress
                          size={30}
                          width={4}
                          fill={fill}
                          tintColor="white"
                          //onAnimationComplete={() => //('')}
                          backgroundColor="#4D4599"
                          rotation={0}
                          lineCap="round" />)}
              </>
            )}
                   </View>
                </View>
              ):(
                <Image source={{ uri: file }} style={styles.image} /> 
              )}
              
            </View>
          )}

          {(text || voice) && (
            <View >
              {text && <Text style={[styles.text,isOwnMessage && {textAlign:'right', paddingRight:34}]}>{renderHighlightedMessage(text)}</Text>}
              {voice && <AudioPlayerChat audioUri={voice}/>}
            </View>
          )}
        </View>
      </View>
    </View>
   
    </Pressable>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 10,
  },
  ownAvatar: {
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize:16
  },
  timestamp: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 5,
  },
  content: {
    flexDirection: 'column',
    width:'100%'
  },
  text: {
    color: 'white',
    fontSize: 16,
    
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fileName: {
    marginLeft: 10,
    color: 'white',
    fontSize:16
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 8,
  },
  hashtag: {
    color: '#854be3',
  },
  buttonContainer: {
    position: 'absolute', // Position the button absolutely
    top: '37%', // Center vertically
    left: '37%', // Center horizontally
   
    //transform: [{ translateX: -50 }, { translateY: -50 }], // Offset by half the button size
  },
});

export default ChatItem;
