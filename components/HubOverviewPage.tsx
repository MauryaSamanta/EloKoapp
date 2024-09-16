import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { themeSettings } from '../constants/Colors';
import { Member } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserProfileDialog from '@/dialogs/UserProfileDialog';
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
  owner?:Member
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
  owner
}) => {
   const [userdialog,setuserdialog]=useState(false);
   const openusercard=()=>{
    setuserdialog(true);
   }
   const closeusercard=()=>{
    setuserdialog(false);
   }

   let member=demonym?demonym:'member';
   if(members.length>1)
    member+='s';
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
      {owner && (<UserProfileDialog open={userdialog} onClose={closeusercard} user={owner}/>)}
        <View style={styles.textContainer}>
          {name && <Text style={styles.hubName}>{name}</Text>}
          {description && <Text style={styles.hubDescription}>{description}</Text>}
        </View>
        <View style={styles.memberdata}>
        <Text style={styles.owner}>
            Hub Owner:
            </Text>
            <TouchableOpacity onPress={openusercard}>
        <Image source={{uri:owner?.avatar_url}} style={styles.ownerpic}/>
        </TouchableOpacity>
            <MaterialIcons name="people-alt" size={23} color={colors.colors.primary.main} marginRight={5}  />
            <Text style={styles.members}>
            {members.length} {member}
            </Text>
        </View>
      
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
    alignItems:'center',
    flexDirection:'row',
    left:30
  },
  ownerpic: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#ccc', // Fallback color if no avatar_url
    //borderWidth: 3,
    //borderColor: '#fff', // Border color to make it stand out
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
    color:'white'
  }
});

export default HubOverviewPage;
