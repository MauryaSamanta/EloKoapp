import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { themeSettings } from '../constants/Colors';
import { Hub, Member } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserProfileDialog from '@/dialogs/UserProfileDialog';
import AddMemberDialog from '@/dialogs/AddMemberDialog';
import { useSelector } from 'react-redux';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import MembersListDialog from '@/dialogs/MembersListDialog';
import OwnersListDialog from '@/dialogs/OwnersListDialog';
const colors = themeSettings("dark");
// Define the props interface for HubOverviewPage
interface HubOverviewPageProps {
  name?: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  demonym?: string;
  hubId?: string;
  members:Member[],
  owners?:Member[],
  ownerId?:string[],
  setHubs:()=>void;
  setowners:(x:Member[])=>void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Main Hub Overview Page Component
const HubOverviewPage: React.FC<HubOverviewPageProps> = ({
  name,
  description,
  avatar_url,
  banner_url,
  demonym,
  members,
  owners,
  hubId,
  ownerId,
  setHubs,
  setowners
}) => {
   const [userdialog,setuserdialog]=useState(false);
   const [code,setcode]=useState('');
   const [addmemberdialog,setaddmemberdialog]=useState(false);
   const [memberdialog,setmemberdialog]=useState(false);
   const [ownerdialog,setownerdialog]=useState(false);
   const token=useSelector((state:any)=>state.auth.token);
   const {_id}=useSelector((state:any)=>state.auth.user);
   const [requests,setrequests]=useState<any[]>();
   useEffect(()=>{const getreqs=async()=>{
    const data={hub:hubId};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/qubepermit/getreqs`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const reqs=await response.json();
      setrequests(reqs);
      //console.log(requests);
    } catch (error) {
      
    }
  }
  if(ownerId?.includes(_id))
    getreqs();
},[])
   const invite=async()=>{
    try {
      const response = await fetch(`https://surf-jtn5.onrender.com/invite/${hubId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setcode(data.code);
      //(data);
    } catch (error) {
      console.error(error);
    }
    setaddmemberdialog(true);
   };
   const closeadddialog=()=>{
    setaddmemberdialog(false);
   }
   const openusercard=()=>{
    setuserdialog(true);
   }
   const closeusercard=()=>{
    setuserdialog(false);
   }

   let member=demonym?demonym:'member';
   if(members.length>1)
    member+='s';

   const processreq=async(req:any, x:string)=>{
    const data={qube_id:req.qube_id._id,user_id:req.user_id._id, hub_id:req.hub_id, status:x, req_id:req._id};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/qubepermit/process`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      setrequests(prevRequests => prevRequests?.filter(request => request._id !== req._id));
    } catch (error) {
      
    }
   }
  // console.log(members.length);
  return (
    <View style={styles.container}>
      {/* Hub Banner */}
      {banner_url ? (
        <Image source={{ uri: banner_url }} style={styles.banner} />
      ) : (
        <View style={styles.banner} />
      )}
       {avatar_url ? (
       
          <Image source={{ uri: avatar_url }} style={styles.avatar}  />
        
        ) : (
          <View style={styles.avatar} />
        )}
      {/* Hub Avatar and Details */}
      {/* {owners.length>0 && (<UserProfileDialog open={userdialog} onClose={closeusercard} user={owner}/>)} */}
        <View style={styles.textContainer}>
          {name && <Text style={styles.hubName}>{name}</Text>}
          {description && <Text style={styles.hubDescription}>{description}</Text>}
        </View>
        <View style={styles.memberdata}>
          <View style={[{flexDirection:'row', alignItems:'center'}]}>
        <Text style={styles.owner}>
            {owners && owners.length>1? "Hub Owners:":"Hub Owner:"}
            </Text>
            <TouchableOpacity style={[{flexDirection:'row'}]} onPress={()=>setownerdialog(true)}>
              {owners?.map((owner,index)=>(index<8&&<Image source={{uri:owner?.avatar_url}} style={[styles.ownerpic,index>0&&{marginLeft:-30}]}/>))}
        
        </TouchableOpacity>
        {ownerId?.includes(_id) && (<TouchableOpacity onPress={()=>setmemberdialog(true)}
          >
            <Image source={require('../assets/images/plus.png')} style={{ width: 24, height: 24, marginRight:15 }} />
            </TouchableOpacity>)}
        </View>
        <View style={[{flexDirection:'row', alignItems:'center', marginTop:16}]}>
            <MaterialIcons name="people-alt" size={23} color={colors.colors.primary.main} marginRight={5}  />
            <Text style={styles.members}>
            {members.length} {member}
            </Text>
            <TouchableOpacity onPress={()=>invite()}>
            <Image source={require('../assets/images/plus.png')} style={{ width: 24, height: 24, marginLeft: -10 }} />
            </TouchableOpacity>
            </View>
            {code && (<AddMemberDialog visible={addmemberdialog} code={code} onClose={closeadddialog} hubname={name} hub_avatar={avatar_url} hub_banner={banner_url}/>)}
        </View>
        {members && (<MembersListDialog visible={memberdialog} onClose={()=>setmemberdialog(false)} 
        members={members.filter(member => !owners?.some(owner => owner._id === member._id))}
        hub={hubId} 
        owners={owners}
        setowners={setowners}
        />)}
          {owners && (<OwnersListDialog visible={ownerdialog} onClose={()=>setownerdialog(false)} members={owners} 
          hub={hubId} setHubs={setHubs} setowners={setowners} owners={owners}/>)}
        {requests && requests.length>0 && (<View  style={[{left:30, marginTop:30}]}>
          <Image source={require('../assets/images/megaphone.png')} style={[{width:36, height:36, marginBottom:10}]}/>
          {requests?.map((req)=>(
            <View style={[{flexDirection:'row',alignContent:'center', alignItems:'center'}]}>
              <Image source={{uri:req.user_id.avatar_url}} style={[{borderRadius:50,width:30,height:30, marginRight:7}]}/>
              <Text style={[{color:'white', fontSize:14}]}>{req.user_id.username} wants to join {req.qube_id.name} qube</Text>
              <TouchableOpacity style={[{marginLeft:5, borderRadius:50,borderColor:'green',borderWidth:2, paddingHorizontal:5,backgroundColor:'rgba(0,128,0,0.5)'  }]}
              onPress={()=>processreq(req,'accept')}>
              <AntDesign name="check" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity style={[{marginLeft:5, paddingHorizontal:5,backgroundColor:'rgba(255,0,0,0.2)',borderRadius:50,borderColor:'red',borderWidth:2, }]}
               onPress={()=>processreq(req,'not')}>
              <Entypo name="cross" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>)}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.colors.background.default
  },
  banner: {
    width: SCREEN_WIDTH,
    height: 200,
    backgroundColor: '#eee', // Fallback color if no banner_url
    borderRadius:10
    //position: 'relative',
  },
  detailsContainer: {
   // position: 'absolute',
    bottom: -40, // Overlaps with the banner
    left: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 40,
    backgroundColor: '#ccc', // Fallback color if no avatar_url
    borderWidth: 3,
    borderColor: '#fff', // Border color to make it stand out
   // marginBottom: 10,
    position: 'relative',
    top: -40, // Adjust to hang from the banner
    left:10
  },
  textContainer: {
    // /alignItems: 'left',
    left:30,
    
    top:-25
  },
  hubName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom:5
  },
  hubDescription: {
    fontSize: 16,
    color: 'white',
    //textAlign: 'center',
  },
  memberdata:{
    //justifyContent:'space-between',
    //alignItems:'center',
    //flexDirection:'row',
    left:30
  },
  ownerpic: {
    width: 45,
    height: 45,
    borderRadius: 40,
    backgroundColor: '#ccc', // Fallback color if no avatar_url
     borderWidth:2, 
     borderColor:'white',
    marginRight:10
    
  },
  members:{
    fontSize:16,
    fontWeight:'bold',
    marginRight:15,
    color:colors.colors.primary.main
  },
  owner:{
    fontSize:16,
    fontWeight:'bold',
    marginRight:8,
    color:'white',
    //flexDirection:'row'
  }
});

export default HubOverviewPage;
