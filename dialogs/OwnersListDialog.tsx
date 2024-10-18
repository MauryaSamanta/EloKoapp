import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import UserProfileDialog from './UserProfileDialog';
import { Hub } from '@/types';
import { useSelector } from 'react-redux';

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

const OwnersListDialog = ({ visible, onClose, members, hub, setHubs, setowners,owners }: { visible: boolean, onClose: () => void, members: any[], 
    hub?:string, setHubs: (hubs: Hub[] | ((prevHubs: Hub[]) => Hub[])) => void ,owners?:Member[] ;
    setowners:(x:Member[])=>void;
 }) => {
    const [userdialog,setuserdialog]=useState();
  // Render individual member item
  const {_id}=useSelector((state:any)=>state.auth.user);
  const isOwner= members.some(member => member._id === _id);
  const removeowner=async(userid:string)=>{
    const data={hubid:hub, user:userid};
    //console.log(JSON.stringify(data));
    try {
        const response=await fetch(`https://surf-jtn5.onrender.com/hub/removeowners`,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const res=await response.json();
        const user=res.founduser;
        let updated:Member[]=[];
        if (owners) {
            updated = owners.filter(member => member._id !== user._id);
          }
         setowners(updated);
    } catch (error) {
        
    }
  }
  const renderMember = ({ item }: { item: any }) => {
    //console.log(item);
    return (
      <TouchableOpacity style={styles.memberContainer} onPress={()=>setuserdialog(item)}>
        {/* Avatar */}
        <Image 
          source={{ uri: item.avatar_url||''}} 
          style={[styles.avatar,!item.avatar_url && {backgroundColor:'#635acc'}]} 
        />

        {/* Username */}
        <View style={styles.memberInfo}>
        <Text style={[styles.username, { color: item.color || 'white' }]}>
  {item.username.length > 14 ? `${item.username.slice(0, 14)}...` : item.username}
</Text>

        </View>
        {item._id!==_id && isOwner &&(<TouchableOpacity style={styles.ownerButton} onPress={()=>removeowner(item._id)}>
            <Text style={styles.ownerButtonText}>Dismiss Owner</Text>
          </TouchableOpacity>)}
       
    
      </TouchableOpacity>
    );
  };


  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Hub Owners</Text>

          <FlatList
            data={members}
            keyExtractor={(item) => item._id}
            renderItem={renderMember}
            showsVerticalScrollIndicator={false}
          />
        {userdialog && <UserProfileDialog open={Boolean(userdialog)} onClose={()=>setuserdialog(undefined)} user={userdialog}/>}
         
        </View>
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
    borderRadius: 10,
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
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#292929',
    borderRadius: 10,
    overflow:'scroll'
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

export default OwnersListDialog;
