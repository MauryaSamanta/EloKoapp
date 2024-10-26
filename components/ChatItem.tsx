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
//import Video, {VideoRef} from 'react-native-video';
//import { useVideoPlayer, VideoView } from 'expo-video';
import { Video, ResizeMode } from 'expo-av';
interface ChatItemProps {
  message: Message;
  isOwnMessage: boolean;
  setdrawer:(x:boolean)=>void;
  setchat(x:Message):void;
  setmessage(x:string):void;
}

const { width } = Dimensions.get('window');

const ChatItem: React.FC<ChatItemProps> = ({ message, isOwnMessage, setdrawer, setchat,setmessage }) => {
  const [user, setUser] = useState<Member>();
  const [showCard, setShowCard] = useState(false);
  const { sender_id, text, voice, senderAvatar, file, senderName, name_file, name_folder, createdAt, color } = message;
  const [bgcolor,setbgcolor]=useState('transparent');
  const userlog=useSelector((state:any)=>state.auth.user);
  const [status, setStatus] = useState<any>({});
  const ref=useRef<any>(null)
  let player=undefined
  
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
  
  return (
  <Pressable onLongPress={()=>{if(createdAt){setdrawer(true); setchat(message);}}} onPressIn={handlepressin} onPressOut={handlepressout}>
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

        <View style={[styles.content, { marginLeft: !isOwnMessage ? 50 : 0 }]}>
          {name_folder && (
            <View style={styles.fileContainer}>
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
                  <Image source={{ uri: file.replace(/\.pdf$/, '.jpg') }} style={[styles.image,{position:'relative',height:165}]} /> 
                  <Text style={[styles.fileName,{position:'absolute',
                   top:170, 
                   backgroundColor:'#4D4599', 
                   borderBottomRightRadius:8
                    ,paddingHorizontal:10, 
                    textAlign:'center', 
                    width:260,
                    height:40, 
                    left:-10,
                    borderBottomLeftRadius:8,
                    paddingTop:8,
                    borderTopLeftRadius:-8}]}>{name_file}</Text>
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
                <View style={styles.fileContainer}>
                  {name_file?.endsWith('.doc') || name_file?.endsWith('.docx')?(<Entypo name="text-document-inverted" size={30} color="#635acc" />
                  ):
                   name_file?.endsWith('.xslx')?(<Entypo name="spreadsheet" size={30} color="green" />)
                   :(<MaterialCommunityIcons name="presentation" size={30} color="red" />)}
                   <Text style={[styles.fileName,{marginRight:20}]}>{name_file}</Text>
                </View>
              ):(
                <Image source={{ uri: file }} style={styles.image} /> 
              )}
            </View>
          )}

          {(text || voice) && (
            <View>
              {text && <Text style={[styles.text,isOwnMessage && {textAlign:'right', paddingRight:34}]}>{renderHighlightedMessage(text)}</Text>}
              {voice && <Text style={styles.text}>[Audio Message]</Text>}
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
