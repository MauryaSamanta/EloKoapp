import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Avatar, IconButton, Menu, Divider, Dialog, Portal } from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons'; // Icons for PDF, Folder, etc.
import { Message } from '@/types';
interface ChatItemProps{
    message:Message,
    isOwnMessage:boolean
};

const ChatItem:React.FC<ChatItemProps> = ({ message, isOwnMessage }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const { sender_id, text, voice, senderAvatar, file, senderName, name_file, folder, name_folder, createdAt } = message;

  const handleMenuOpen = () => setMenuVisible(true);
  const handleMenuClose = () => setMenuVisible(false);
  const handleDialogOpen = () => setDialogVisible(true);
  const handleDialogClose = () => setDialogVisible(false);

  const formatMessageTime = (date:any) => {
    const messageDate = parseISO(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'hh:mm a');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'hh:mm a')}`;
    } else {
      return format(messageDate, 'MMM dd hh:mm a');
    }
  };

  const renderHighlightedMessage = (text:string) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => (
      part.match(/#\w+/) ? (
        <Text key={index} style={styles.hashtag} onPress={() => console.log(part)}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    ));
  };

  return (
    <PaperProvider>
        <View style={[{justifyContent:isOwnMessage?'flex-end':'flex-start'}]}>
    <View style={[styles.container, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
      

      <View style={styles.messageContainer}>
        {isOwnMessage?(<View style={styles.header}>
            <Text style={styles.timestamp}>{formatMessageTime(createdAt)}</Text>
          <Text style={[styles.senderName,{marginLeft:10,marginRight:10}]}>{senderName}</Text>
          <Avatar.Image size={40} source={{ uri: senderAvatar }} style={styles.avatar} />
         </View>):(
            <View style={styles.header}>
            <Avatar.Image size={40} source={{ uri: senderAvatar }} style={styles.avatar} />
            <Text style={[styles.senderName,{marginRight:10}]}>{senderName}</Text>
          <Text style={styles.timestamp}>{formatMessageTime(createdAt)}</Text>
        </View>
        )}
         
        <View style={[styles.content]}>
          {name_folder && (
            <View style={styles.fileContainer}>
              <Entypo name="folder" size={40} color="#ff9800" />
              <Text style={styles.fileName}>{name_folder}</Text>
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
              {text && <Text style={[styles.text,{marginLeft:!isOwnMessage?50:0}]}>{renderHighlightedMessage(text)}</Text>}
              {voice && <Text style={styles.text}>[Audio Message]</Text>}
            </View>
          )}
        </View>

        {/* {isOwnMessage && (
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={handleMenuOpen}
            style={styles.menuButton}
          />
        )} */}

        <Portal>
          <Menu
            visible={menuVisible}
            onDismiss={handleMenuClose}
            anchor={{ x: 0, y: 0 }}
            style={styles.menu}
          >
            <Menu.Item onPress={() => { }} title="Save to My Library" />
            {isOwnMessage && (
              <>
                <Divider />
                <Menu.Item onPress={() => { }} title="Delete Message" titleStyle={styles.deleteText} />
              </>
            )}
          </Menu>
        </Portal>
      </View>
    </View>
    </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  ownMessage: {
    flexDirection:"row-reverse"
  },
  otherMessage: {
    //justifyContent: 'flex-start',
    flexDirection:'row'
  },
  avatar: {
    marginRight: 10,
  },
  messageContainer: {
    //flex: 1,
    //flexDirection:'flex-end'
    //maxWidth: '75%',
  },
  header: {
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
  },
  senderName: {
    fontWeight: 'bold',
    color:'white'
  },
  timestamp: {
    color: 'grey',
    fontSize: 12,
    marginTop:2
  },
  content: {
   // backgroundColor: '#0078d4',
    //padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize:16,
    marginTop:0
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
  menuButton: {
    alignSelf: 'flex-start',
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 0,
  },
  deleteText: {
    color: '#ed0e0e',
  },
  hashtag: {
    color: '#854be3',
  },
});

export default ChatItem;