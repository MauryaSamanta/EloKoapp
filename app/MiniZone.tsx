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
// Define TypeScript interfaces for the params
interface ChatScreenParams {
  chatId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
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
  const { chatId, friendId, friendName, friendAvatar } = route.params as ChatScreenParams;
  const [messages,setmessages]=useState<Message[]>([]);
  const [message,setmessage]=useState('');
  const [chat,setchat]=useState<Message>();
  const {_id,username}=useSelector((state:any)=>state.auth.user);
  const [drawer,setdrawer]=useState(false);
  const [wall,setwall]=useState('');
  const [userTyping,setuserTyping]=useState();
  const [type,settype]=useState(false);
  const navigationlibrary = useNavigation<LibraryNavProp>();
  const joinChat=async()=>{
    socket.emit('joinZone',chatId);
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/message/${chatId}`,{
        method:"GET"
      });
      const data=await response.json();
      setmessages(data);
      //console.log(messages);
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
          console.log(wall);
          //console.log(wall);
        } catch (error) {
          
        }
      }
    joinChat();
    getwallpaper();
  },[])

  useEffect(()=>{
    socket.on('UserTyping', (data) => {
      const { user, typing } = data;
      console.log(user);
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
      console.log(message);
      setmessages((prevMessages) =>
        (message.file || message.folder) && message.uuid
          ? prevMessages.map((msg) =>
              msg.uuid === message.uuid ? message : msg
          
            )
          : [...prevMessages, message]
      );
      //console.log(message);
    });
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
      <Avatar.Image size={50} source={{ uri: friendAvatar }} style={styles.avatar} />
        <Text style={[{color:'white',
                       marginTop:50, marginBottom:15,
                       fontSize:17, flexGrow:1}]}>{friendName}</Text>
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
            <ChatItem key={message._id} message={message} isOwnMessage={message.sender_id===_id} setdrawer={setdrawer} setchat={setchat}
            setmessage={setmessage}/>
          ))}
        </View>
      </ScrollView>
      {userTyping && (<TypingAnimation userTyping={userTyping} username={username}/>)}
      {/* Message Input Area */}
      <View>
        <MessageInputArea zone={chatId} qube={null} setmessages={setmessages} messagetag={''}/>
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
