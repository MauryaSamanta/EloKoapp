import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Animated, PanResponder} from 'react-native';
import UserProfileDialog from './UserProfileDialog';

// Sample Member Interface
 interface Member {
  _id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  public_key?: string;
  created_at: string;
  color?:string;
  isOwner?: boolean;  // Adding owner flag for demo
}

const MembersListDialog = ({ visible, onClose, members, hub, owners,setowners }: { visible: boolean, onClose: () => void, members: any[], hub?:string
  ,owners?:Member[] 
  ,setowners:(x:Member[])=>void;
 }) => {
   const [userdialog,setuserdialog]=useState();
  // Render individual member item
  const renderMember = ({ item }: { item: any }) => {
    //console.log(item);
    return (
      <View style={[{ flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        padding: 10,
        backgroundColor: '#292929',
        borderRadius: 10,
        overflow:'scroll'}]} >
        {/* Avatar */}
        <TouchableOpacity style={styles.memberContainer} onPress={()=>setuserdialog(item)}>
        <Image 
          source={{ uri: item.avatar_url||''}} 
          style={[styles.avatar,!item.avatar_url && {backgroundColor:'#635acc'}]} 
        />

        {/* Username */}
        <View style={styles.memberInfo} >
        <Text style={[styles.username, { color: item.color || 'white' }]}>
  {item.username.length > 14 ? `${item.username.slice(0, 12)}...` : item.username}
</Text>
        </View>
        </TouchableOpacity>
        {/* Owner Button */}
       
          <TouchableOpacity style={styles.ownerButton} onPress={()=>addnewowner(item._id)}>
            <Text style={styles.ownerButtonText}>Promote to Owner</Text>
          </TouchableOpacity>
    
      </View>
    );
  };

  const addnewowner=async(userid:string)=>{
    const data={hubid:hub, user:userid};
    //console.log(JSON.stringify(data));
    try {
        const response=await fetch(`https://surf-jtn5.onrender.com/hub/owners`,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const res=await response.json();
        const user=res.founduser;
        let updated:Member[]=[];
        updated=members.filter(member => member._id !== user._id);
        updated=[];
        if(owners)
        updated=[...owners,user];
       setowners(updated);
    } catch (error) {
        
    }
  }

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow swipe only if the user is moving down
        return gestureState.dy > 20; // You can adjust this threshold
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy); // Track the vertical swipe
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) { // Adjust this threshold to determine swipe down sensitivity
          // If swiped down enough, close the modal
          closeModal();
        } else {
          // If not, animate it back to the original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  
  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 1000, // Move the modal out of view
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      onClose(); // Close the modal after the animation
    });
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Members</Text>

          <FlatList
            data={members}
            keyExtractor={(item) => item._id}
            renderItem={renderMember}
            showsVerticalScrollIndicator={false}
          />
          {members.length===0 && (
            <View style={[{alignItems:'center'}]}>
            <Text style={[{ justifyContent:'center', color:'#616161', fontSize:16}]}>Looks deserted.</Text>
            <Image source={require('../assets/images/leaf.png')} style={[{width:80,height:80}]}/>
            <Text style={[{ justifyContent:'center', color:'#635acc', fontSize:20, fontWeight:'bold'}]}>Add Members to grow your Hub</Text>
            </View>
          )}
          {userdialog && <UserProfileDialog open={Boolean(userdialog)} onClose={()=>setuserdialog(undefined)} user={userdialog}/>}
         
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position:'absolute',
    width: '100%',
    //height:500,
    backgroundColor: '#292929',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    bottom:0,
    zIndex:4,
    elevation: 10, // Higher values will give a stronger shadow effect
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Adjust the offset for depth
    shadowOpacity: 0.4, // Control the darkness of the shadow
    shadowRadius: 8,    // Control the blur effect
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color:'white'
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 15,
    //padding: 10,
    backgroundColor: '#292929',
    borderRadius: 10,
   // overflow:'scroll'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  ownerButton: {
    backgroundColor: '#635acc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ownerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MembersListDialog;
