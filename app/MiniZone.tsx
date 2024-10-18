import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import MessageInputArea from '@/components/MessageInputArea';
import { io } from 'socket.io-client';
import ChatItem from '@/components/ChatItem';
import MessageOptionsDialog from '@/dialogs/MessageOptionsDialog';
import { Message,Qube,Zone } from '@/types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; 
import TypingAnimation from '@/components/TypingAnimation';
import CryptoJS from 'crypto-js';
// Define TypeScript interfaces for the params
interface ChatScreenParams {
  chatId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  friendkey:string;
  members:any;
}
type NavigationType = NavigationProp<RootStackParamList>;
type LibraryNavProp = {
    navigate: (screen: string, params?: any) => void;
  };
// interface ChatScreenProps {
//   route: RouteProp<{ params: ChatScreenParams }, 'params'>;
// }
const socket = io('https://surf-jtn5.onrender.com');
const MiniZone: React.FC = () => {
    const route=useRoute();
  const { chatId, friendId, friendName, friendAvatar,friendkey, members } = route.params as ChatScreenParams;
  ////(friendkey);
  const [messages,setmessages]=useState<Message[]>([]);
  const [message,setmessage]=useState('');
  const [chat,setchat]=useState<Message>();
  const {_id,username, public_key}=useSelector((state:any)=>state.auth.user);
  //(public_key)
  const [drawer,setdrawer]=useState(false);
  const [wall,setwall]=useState('');
  const [userTyping,setuserTyping]=useState();
  const [type,settype]=useState(false);
  const navigationlibrary = useNavigation<LibraryNavProp>();
 // //(friendkey)
  const joinChat=async()=>{
    socket.emit('joinZone',chatId);
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/message/${chatId}`,{
        method:"GET"
      });
      const data=await response.json();
      const decryptedMessages = data.map((message:any) => {
        if (message.sender_id._id === _id) {
          // Decrypt with the user's own public_key
          message.text = CryptoJS.AES.decrypt(message.text, friendkey).toString(CryptoJS.enc.Utf8);
        } else {
          // Decrypt with the friend's key
          message.text = CryptoJS.AES.decrypt(message.text, public_key).toString(CryptoJS.enc.Utf8);
        }
        return message;
      });
  
      setmessages(decryptedMessages);
      //setmessages(data);

      ////(messages);
    } catch (error) {
      
    }

  }
  useEffect(()=>{
    const getwallpaper=async()=>{
        try {
          const response=await fetch(`https://surf-jtn5.onrender.com/wall/${_id}/${chatId}`,{
            method:"GET"
          });
          const data=await response.json();
          setwall(data[0].wall_url);
          //(wall);
          ////(wall);
        } catch (error) {
          
        }
      }
    joinChat();
    getwallpaper();
  },[])

  useEffect(()=>{
    socket.on('UserTyping', (data) => {
      const { user, typing } = data;
      //(user);
      if (typing) {
        // Show "user is typing" indicator
        setuserTyping(user);
        settype(true);
      } else {
        // Hide "user is typing" indicator
        setuserTyping(undefined);
        settype(false);
      }
    });
    socket.on('receiveMessage', (message) => {
     /// //(message.sender_id);
      if (message.sender_id === _id && message.text) {
        // Decrypt with the user's own public_key
       // //('hello');
        message.text = CryptoJS.AES.decrypt(message.text, friendkey).toString(CryptoJS.enc.Utf8);
      } else {
        // Decrypt with the friend's key
        ////('not hello');
        message.text = CryptoJS.AES.decrypt(message.text, public_key).toString(CryptoJS.enc.Utf8);
      }
      setmessages((prevMessages) =>
        
        (message.file || message.folder) && message.uuid
          ? prevMessages.map((msg) =>
              msg.uuid === message.uuid ? message : msg
          
            )
          : [...prevMessages, message]
      );
      ////(message);
    });
    return () => {
      // Remove the specific listener
      socket.off('receiveMessage');
      
      // Optionally close the socket connection
      //socket.disconnect();
    };
    //socket.off('receiveMessage');
  },[])
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    // Scroll to the bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={{  backgroundColor:'#635acc',  borderBottomEndRadius:20, flexDirection:'row', padding:10 }}>
        <TouchableOpacity style={{  backgroundColor:'#635acc',  borderBottomEndRadius:20, flexDirection:'row', flexGrow:1 }}>
      <Avatar.Image size={50} source={{ uri: friendAvatar }} style={styles.avatar} />
        <Text style={[{color:'white',
                       marginTop:50, marginBottom:15,
                       fontSize:17}]}>{friendName}</Text>
                       </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
            const data={hub:chatId, wallpaper:wall, hubname:friendName};
            navigationlibrary.navigate("Library",data);
          }} style={styles.libraryButton}>
            <Text style={{ color: 'white' }}>Open Library</Text>
          </TouchableOpacity>
      </View>

      {/* Scrollable Area for Chat Messages */}
      <ScrollView contentContainerStyle={[styles.scrollArea,messages.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : {}]}  ref={scrollViewRef}>
        <View style={styles.messageContainer}>
         {messages.length>0 && ( <Text style={styles.welcomeText}>Start of your legendary converstaion with {friendName}</Text>)}
         {messages.length===0 && (<Text style={[styles.welcomeText,{textAlign:'center',borderWidth:5, padding:50, borderStyle:'dashed',
            borderColor:'#635acc', borderRadius:30, fontSize:30, color:'#635acc', fontWeight:'bold'
         }]}>Drop your first text</Text>)}
          {messages?.map((message:Message, index) => (
            <ChatItem key={message._id} message={message} isOwnMessage={message.sender_id._id===_id||message.sender_id===_id} setdrawer={setdrawer} setchat={setchat}
            setmessage={setmessage}/>
          ))}
        </View>
      </ScrollView>
      {userTyping && (<TypingAnimation userTyping={userTyping} username={username}/>)}
      {/* Message Input Area */}
      <View>
        <MessageInputArea zone={chatId} qube={null} setmessages={setmessages} messagetag={''} members={members} commkey={friendkey}  />
      </View>
      {chat && (<MessageOptionsDialog visible={drawer} onClose={()=>setdrawer(false)} message={chat} hubId={chatId}/>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36393f',
    //padding: 18,
    width: '100%',
  },
  header: {
    backgroundColor:'#635acc',
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop:45
  },
  avatar:{
    marginTop:36,
    marginRight:16
  },
  friendName: {
    fontSize: 18,
    color: 'white',
  },
  libraryButton: {
    backgroundColor: '#4D4599',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 20,
    elevation: 5,
    marginTop:35,
    justifyContent:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  scrollArea: {
    flexGrow: 1,
  },
  messageContainer: {
    backgroundColor: '#36393f',
    borderRadius: 8,
    padding: 16,
  },
  welcomeText: {
    fontSize: 15,
    color: '#999999',
    textAlign:'center',
    marginBottom: 16,
  },
});

export default MiniZone;
