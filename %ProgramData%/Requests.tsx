import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { themeSettings } from '../constants/Colors';
import { useSelector } from 'react-redux';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
const colors = themeSettings("dark");

interface FriendRequest{
    _id:string;
    createdAt:string;
    receiver_id:string;
    sender_id:{
        _id:string;
        avatar_url:string;
        username:string;
    }
}
const Requests: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
  ]);
  const [username, setUsername] = useState('');
  const {_id}=useSelector((state:any)=>state.auth.user);
  const [exist,setexist]=useState(true);
  const [friend,setfriend]=useState(false);
  const [sending,setsending]=useState(false);
  const [accepting,setaccepting]=useState(false);
  const navigation=useNavigation();
  const handleSendRequest = async() => {
    if(username==='')
      return;
    const val={senderid:_id,recname:username};
    setsending(true);
    try {
        const response=await fetch(`https://surf-jtn5.onrender.com/request/create`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(val)
        });
        const data=await response.json();
        if(data)
          setsending(false);
        if(data==='User doesnot exist')
          setexist(false);
        else if(data==='Friend')
          setfriend(true);
        else
        setUsername('');
    } catch (error) {
        //(error);
    }
    
  };
  useEffect(()=>{
        const getrequest=async()=>{
            try {
                const response=await fetch(`https://surf-jtn5.onrender.com/request/${_id}`,{
                    method:"GET"
                });
                const data=await response.json();
                setFriendRequests(data);
            } catch (error) {
                
            }
        }
        getrequest();
  },[]);

  const handleaccept=async(request:FriendRequest)=>{
    const data={reqid:request._id,userid:_id,senderid:request.sender_id._id};
    setaccepting(true);
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/chat/new`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const res=await response.json();
      if(res)
        setaccepting(false);
      setFriendRequests(prev => prev.filter(req => req._id !== request._id));

    } catch (error) {
      //(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[{flexDirection:'row'}]}>
        <TouchableOpacity style={[{marginTop:25,marginRight:10}]} onPress={()=>navigation.goBack()}>
      <Ionicons name="arrow-back-outline" size={24} color="#635acc"/>
      </TouchableOpacity>
      <Text style={styles.header}>Add Friends</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Friend Requests</Text>
        {friendRequests.length>0?(<FlatList
          data={friendRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
                <View style={[{flexDirection:'row',alignItems:'center'}]}>
              <Avatar.Image source={{uri:item.sender_id.avatar_url}} size={50}/>
              <Text style={[styles.username,{marginLeft:10}]}>{item.sender_id.username}</Text>
              </View>
              <TouchableOpacity style={styles.acceptButton} onPress={()=>{handleaccept(item)}}>
              {!accepting?(  <>
              <MaterialIcons name="connect-without-contact" size={24} color="white" />
                <Text style={[styles.buttonText,{marginLeft:7}]}>Accept</Text>
                </>):( <AnimatedCircularProgress
          size={40}
          width={4}
          fill={75}
          tintColor="white"
          //onAnimationComplete={() => //('')}
          backgroundColor="#4D4599"
          rotation={0}
          lineCap="round" />

                )}
              </TouchableOpacity>
            </View>
          )}
        />):(
          <View style={[{alignItems:'center', justifyContent:'center'}]}>
            <Text style={[{alignItems:'center', color:'#7D7D7D', fontSize:15}]}>No pending friend requests</Text>
            </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Send Friend Request</Text>
        <View style={[{flexDirection:'row', justifyContent:'space-between'}]}>
        <TextInput
          style={styles.input}
          placeholder="Type username..."
          value={username}
          onChangeText={(e)=>{setUsername(e); setexist(true);setfriend(false);}}
          placeholderTextColor={'#616161'}
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
        {!sending?(<FontAwesome name="send-o" size={24} color="white" />):(
          <AnimatedCircularProgress
          size={40}
          width={4}
          fill={75}
          tintColor="white"
         // onAnimationComplete={() => //('')}
          backgroundColor="#4D4599"
          rotation={0}
          lineCap="round" />
        )}
        </TouchableOpacity>
        </View>
        {!exist && (<Text style={[{alignItems:'center', fontSize:13, color:'#635acc'}]}>Username does not exist. Check the username.</Text>)}
        {friend && (<Text style={[{alignItems:'center', fontSize:13, color:'#635acc'}]}>You are already friends with them.</Text>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.background.default, // Light background
    paddingTop: 40,
    paddingHorizontal:15
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#635acc', // Your primary color
  },
  section: {
    marginBottom: 30,
    padding: 0,
    backgroundColor: 'transparent',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#635acc', // Your primary color
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1D1D1D',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    //borderBottomColor: '#ddd',
   // borderBottomWidth: 1,
  },
  username: {
    fontSize: 16,
    color: 'white',
  },
  acceptButton: {
    backgroundColor: '#635acc', // Your primary color
    borderRadius: 55,
    padding: 10,
    flexDirection:'row'
  },
  sendButton: {
    backgroundColor: '#635acc', // Your primary color
    borderRadius: 50,
    width:50,
    height:50,
    //padding: 10,
    justifyContent:'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#7D7D7D',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    color:'white',
    width:300
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    
  },
});

export default Requests;
