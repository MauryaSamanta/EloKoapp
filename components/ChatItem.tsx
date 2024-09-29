import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Avatar } from 'react-native-paper';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons'; // Icons for PDF, Folder, etc.
import UserProfileDialog from '@/dialogs/UserProfileDialog';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Message, Member } from '@/types';
import MessageDrawer from '@/drawers/MessageDrawer';

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
  const { sender_id, text, voice, senderAvatar, file, senderName, name_file, name_folder, createdAt } = message;
  const [bgcolor,setbgcolor]=useState('transparent');
  
  const showUser = async () => {
    try {
      const response = await fetch(`https://surf-jtn5.onrender.com/users/${sender_id}`, {
        method: "GET"
      });
      const member = await response.json();
      setUser(member);
      setShowCard(true);
    } catch (error) {
      console.error(error);
    }
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
        <Text key={index} style={styles.hashtag} onPress={()=>{setmessage(part);console.log(part)}}>{part}</Text>
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
              <Avatar.Image size={40} source={{ uri: senderAvatar }} style={styles.avatar} />
              <Text style={styles.senderName} onPress={showUser}>{senderName}</Text>
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
              <Text style={styles.senderName}>{senderName}</Text>
              <Avatar.Image size={30} source={{ uri: senderAvatar }} style={styles.ownAvatar} />
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
                <>
                  <MaterialIcons name="picture-as-pdf" size={40} color="#d32f2f" />
                  <Text style={styles.fileName}>{name_file}</Text>
                </>
              ) : (
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
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  hashtag: {
    color: '#854be3',
  },
});

export default ChatItem;
