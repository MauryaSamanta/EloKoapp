import React, { useRef, useState } from 'react';
import {  Portal, Text, Button, TextInput, Provider, IconButton } from 'react-native-paper';
import { View, StyleSheet, Linking, Modal, TouchableOpacity, Image } from 'react-native';
//import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Sharing from 'expo-sharing';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
const AddMemberDialog = ({ visible, onClose, code, hubname, hub_avatar,hub_banner }) => {
  const handleCopyToClipboard = async() => {
    await Clipboard.setStringAsync(code);
  };
  const modalRef = useRef();
  
  const captureModal = async () => {
    //setloading(true);
    try {
      // Capture the view and save as a JPEG
      const uri = await captureRef(modalRef, {
        format: 'jpg',
        quality: 1.0,
      });
  
      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return;
      }
      const message = code;
      // Share the image

      // await Sharing.shareAsync(uri,{
      //   dialogTitle:message
      // });
      // await Share.share({
      //   title:'hello',
      //   url:uri,
      //   message:'greate photo'
      // })

      Share.open({message:message,url:uri}).then((res) => {
        //(res);
      })
      .catch((err) => {
        console.log(err) //(err);
      });
      //setloading(false);
      
    } catch (error) {
      console.error('Failed to capture modal content:', error);
    }
  };

  return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.dialogContainer} ref={modalRef}>
          {/* <Text style={styles.dialogTitle}>{hubname}</Text> */}
          <Image source={{uri:hub_banner}} style={{height: 130, borderTopLeftRadius:10, borderTopRightRadius:10}}/>
          <Image source={{ uri: hub_avatar }} style={styles.avatar}  />
          <Text style={[{color:'white', textAlign:'center', marginBottom:20,
            fontSize:25,
            fontWeight:'bold',
            marginTop:-20,

          }]} adjustsFontSizeToFit
          numberOfLines={1} // Keep the text on a single line
          minimumFontScale={0.5} >{hubname}</Text>
          <Text style={[{color:'#7D7D7D', textAlign:'center', marginBottom:40,
            fontSize:16}]}>Join our awesome hub using the code</Text>
          
          
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              //icon={() =>}
              onPress={handleCopyToClipboard}
              style={styles.button}
            >
               <MaterialCommunityIcons name="content-copy" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              //icon={() => }
              onPress={captureModal}
              style={styles.button}
            >
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
          </View>
          
        </Modal>
     
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        
      },
  dialogContainer: {
    margin: 20,
    backgroundColor: '#1D1D1D',
    borderRadius: 20,
    //padding: 10,
    maxHeight:'80%'
  },
  dialogTitle: {
    fontSize: 20,
    //fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'white'
  },
  textInput: {
    marginBottom: 20,
    
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:40,
    marginBottom: 20,
  },
  button: {
    //flex: 1,
    backgroundColor:'#635acc',
    padding:13,
    borderRadius:50,
    alignItems:'center',
    marginHorizontal: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  avatar:{
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#ccc', // Fallback color if no avatar_url
    borderWidth: 3,
    borderColor: '#fff', // Border color to make it stand out
   // marginBottom: 10,
    position: 'relative',
    top: -40, // Adjust to hang from the banner
    left:10
  }
});

export default AddMemberDialog;
