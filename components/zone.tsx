import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Message,Zone } from '@/types';
import MessageInputArea from './MessageInputArea';
import { useSelector } from 'react-redux';
import ChatItem from './ChatItem';
// // Define TypeScript interfaces for the props
// interface Message {
//   content: string;
// }

interface ZoneScreenProps {
  selectedZone: Zone;
 // handleOpenStoreDialog: () => void;
  //messages?: Message[]; // Messages is optional, default is an empty array
}

const ZoneScreen: React.FC<ZoneScreenProps> = ({
  selectedZone,
  //handleOpenStoreDialog,
  //messages = [],
}) => {
    const {_id}=useSelector((state:any)=>state.auth.user);
  const [messages,setmessages]=useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(()=>{
    const getmessages=async()=>{
        try {
            const response=await fetch(`https://surf-jtn5.onrender.com/message/${selectedZone._id}`,{
                method:"GET"
            });
            const messagechunk=await response.json();
            setmessages(messagechunk);
        } catch (error) {
            
        }
    }
    getmessages();
  },[selectedZone]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, []);
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.zoneName}>{selectedZone?.name}</Text>

        <TouchableOpacity style={styles.storeButton} //onPress={handleOpenStoreDialog}
        >
          <Text style={styles.storeButtonText}>#store</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Area */}
      <ScrollView contentContainerStyle={styles.scrollArea}  ref={scrollViewRef}>
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeText}>Welcome to the {selectedZone?.name} Zone</Text>
          <Text style={styles.subText}>Talk with your Qube members here. We organize your files for you!</Text>

          {/* Messages */}
          {messages?.map((message:Message, index) => (
            <ChatItem message={message} isOwnMessage={message.sender_id===_id}/>
          ))}
        </View>
      </ScrollView>
      <View >
      <MessageInputArea/>
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