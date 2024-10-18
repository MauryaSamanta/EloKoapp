import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Message,Qube,Zone } from '@/types';
import MessageInputArea from './MessageInputArea';
import { useSelector } from 'react-redux';
import ChatItem from './ChatItem';
import TagStoreDialog from '@/dialogs/TagStoreDialog';
import { io } from 'socket.io-client';
import MessageDrawer from '@/drawers/MessageDrawer';
import MessageOptionsDialog from '@/dialogs/MessageOptionsDialog';
import { Hub } from '@/types';
import TypingAnimation from './TypingAnimation';
import CryptoJS from 'crypto-js';
//import MessageDrawer from '@/drawers/MessageDrawer';

// // Define TypeScript interfaces for the props
// interface Message {
//   content: string;
// }

interface ZoneScreenProps {
  selectedZone: Zone;
  selectedQube?:Qube;
  hubId?:string;
  members?:any[];
  hubname?:string;
  commkey:string;
 // handleOpenStoreDialog: () => void;
  //messages?: Message[]; // Messages is optional, default is an empty array
}
const socket = io('https://surf-jtn5.onrender.com');
const ZoneScreen: React.FC<ZoneScreenProps> = ({
  selectedZone,
  selectedQube,
  hubId,
  members,
  hubname,
  commkey
  //handleOpenStoreDialog,
  //messages = [],
}) => {
    const {_id,username}=useSelector((state:any)=>state.auth.user);
    
  const [messages,setmessages]=useState<Message[]>([]);
  const [tagdialog,settagdialog]=useState(false);
  const [drawer,setdrawer]=useState(false);
  const [chat,setchat]=useState<Message>();
  const [message,setmessage]=useState('');
  const [userTyping,setuserTyping]=useState();
  const [type,settype]=useState(false);
  //const [commkey,setcommkey]=useState('');
  //(commkey);
  const opentagdialog=()=>{
    settagdialog(true);
  }
  const closettagdialog=()=>{
    settagdialog(false);
  }
  const scrollViewRef = useRef<ScrollView>(null);
 
  useEffect(()=>{
   

    const getmessages=async()=>{
        try {
            const response=await fetch(`https://surf-jtn5.onrender.com/message/${selectedZone._id}`,{
                method:"GET"
            });
            const data=await response.json();
            const decryptedMessages = data.map((message:any) => {
              try {
                // Attempt to decrypt the message text
                const decryptedText = CryptoJS.AES.decrypt(message.text, commkey).toString(CryptoJS.enc.Utf8);
                message.text = decryptedText;
            } catch (error) {
                console.error("Error decrypting message:", error);
                message.text = "Decryption failed"; // Fallback if decryption fails
            }
              return message;
            });
            setmessages(decryptedMessages);
        } catch (error) {
            
        }
    }
    const joinZone=async()=>{
      socket.emit('joinZone', selectedZone._id);
    }
    
    getmessages();
    joinZone();
  },[selectedZone]);

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
      if(message.text)
      message.text = CryptoJS.AES.decrypt(message.text, commkey).toString(CryptoJS.enc.Utf8);
      setmessages((prevMessages) =>
        (message.file || message.folder) && message.uuid
          ? prevMessages.map((msg) =>
              msg.uuid === message.uuid ? message : msg
          
            )
          : [...prevMessages, message]
      );
     
    });
    socket.on('deleteMessage',(delmessage)=>{
      setmessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== delmessage)
      );
    })
    return () => {
        
      socket.off('receiveMessage');
      
    };
   
  },[])

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  useEffect(()=>{
    //(message);
  },[message])
  return (
    <View style={styles.container}>
      {/* Header Section */}
     
      <View style={[styles.header,{backgroundColor:'transparent'}]}>
        <Text style={styles.zoneName}>{selectedQube?.name}</Text>

        <TouchableOpacity style={styles.storeButton} onPress={opentagdialog}
        >
          <Text style={styles.storeButtonText}>#store</Text>
        </TouchableOpacity>
      </View>
      <TagStoreDialog open={tagdialog} qubeid={selectedQube?._id} onClose={closettagdialog}/>
      
      {/* Scrollable Area */}
      <ScrollView contentContainerStyle={styles.scrollArea}  ref={scrollViewRef}>
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeText}>Welcome to the {selectedQube?.name} Qube</Text>
          <Text style={styles.subText}>Talk with your Qube members here. We organize your files for you!</Text>

          {/* Messages */}
          {messages?.map((message:Message, index) => (
            <ChatItem key={message._id} message={message} isOwnMessage={message.sender_id._id===_id || message.sender_id===_id} setdrawer={setdrawer} setchat={setchat}
            setmessage={setmessage}/>
          ))}
          
        </View>
        
      </ScrollView>
      {userTyping && (<TypingAnimation userTyping={userTyping} username={username}/>)}
      <View >
      
      <MessageInputArea qube={selectedQube?._id} zone={selectedZone?._id} setmessages={setmessages} messagetag={message} members={members} qubename={selectedQube?.name} hubname={hubname} commkey={commkey}/>
      {chat && (<MessageOptionsDialog visible={drawer} onClose={()=>setdrawer(false)} message={chat} hubId={hubId}/>)}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36393f',
    //padding: 18,
    paddingBottom:0,

    width:'100%',
    margin:0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding:18
  },
  zoneName: {
    fontSize: 16,
    color: 'white',
  },
  storeButton: {
    backgroundColor: '#854be3',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  storeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollArea: {
    flexGrow: 1,
  },
  messageContainer: {
    backgroundColor: '#36393f',
    borderRadius: 8,
    padding: 16,
    paddingTop:0
  },
  welcomeText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 16,
  },
  subText: {
    fontSize: 13,
    color: '#9e9e9e',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: 'white',
    marginBottom: 12,
  },
});

export default ZoneScreen;
