import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Button, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AddIcon from 'react-native-vector-icons/MaterialIcons';
import NotificationsIcon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/MaterialIcons';
import { Chat } from '@/types'; // Adjust the import path as needed
import { Member } from '@/types';
import { themeSettings } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; 
const colors = themeSettings("dark");
interface InboxMobileProps {
  // Define any props here if needed
  setmainchats:(chat:Chat[])=>void;

}

interface InboxMobileState {
  chats: Chat[];
  filteredChats: Chat[];
  showFriend: boolean;
  showReq: boolean;
  chat: Chat | null;
  searchQuery: string;
}

type NavigationType = NavigationProp<RootStackParamList>;
type ChatNavProp = {
  navigate: (screen: string, params?: any) => void;
};



const InboxMobile: React.FC<InboxMobileProps> = ({setmainchats}) => {
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const userId = useSelector((state: { auth: { user: { _id: string } } }) => state.auth.user._id);
  const [showFriend, setShowFriend] = useState<boolean>(false);
  const [showReq, setShowReq] = useState<boolean>(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigationchat = useNavigation<ChatNavProp>();
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`https://surf-jtn5.onrender.com/chat/${userId}`, {
          method: 'GET'
        });
        const data = await response.json();
        setChats(data.chats || []);
        setmainchats(chats);
        setFilteredChats(data.chats || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const filtered = chats.filter(chat =>
      chat.members.find(member => member._id.toString() !== userId)?.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery, chats, userId]);

  const handleAddFriend = () => setShowFriend(true);
  const handleCloseFriend = () => setShowFriend(false);
  const handleReq = () => setShowReq(true);
  const handleCloseReq = () => setShowReq(false);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Button
          icon={() => <AddIcon name="add" size={24} color="white" />}
          mode="contained"
          onPress={handleAddFriend}
          style={styles.button}
        >
          Add Friends
        </Button>
        <Button
          icon={() => <NotificationsIcon name="notifications" size={24} color="white" />}
          mode="contained"
          onPress={handleReq}
          style={styles.button}
        >
          Friend Requests
        </Button>
      </View> */}

      <TextInput
        placeholder="Search chats"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor='#616161'
      />

      <Text style={styles.title}>Conversations</Text>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {setChat(item);
            const chatId=item._id;
            const members=item.members;
            const friendId=item.members.find(member=>member?._id.toString()!==userId)?._id
            const friendName=item?.members.find(member => member._id.toString() !== userId)?.username
            const friendAvatar=item?.members.find(member => member._id.toString() !== userId)?.avatar_url
            const friendkey=item?.members.find(member => member._id.toString() !== userId)?.public_key
            ////(friendkey)
            navigationchat.navigate("MiniZone",{chatId,friendId,friendName, friendAvatar,friendkey, members});
          }} style={styles.listItem}>
            <Avatar.Image size={50} source={{ uri: item.members.find(member => member._id.toString() !== userId)?.avatar_url }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.username}>{item.members.find(member => member._id.toString() !== userId)?.username}</Text>
              
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{searchQuery ? 'You have no friends with such username.' : 'No recent chats. Start a conversation!'}</Text>}
      />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#0a0909',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 25,
    backgroundColor: colors.colors.primary.main,
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 8,
    color: '#fff',
    paddingLeft:20
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
  },
  avatar: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    color: '#fff',
    //fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b0b0b0',
    marginTop: 32,
  },
});

export default InboxMobile;
