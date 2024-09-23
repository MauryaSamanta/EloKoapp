import React, { useState } from 'react';
import {  Portal, Text, Button, TextInput, Provider, IconButton } from 'react-native-paper';
import { View, StyleSheet, Linking, Modal } from 'react-native';
//import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddMemberDialog = ({ visible, onClose, code }) => {
  const handleCopyToClipboard = async() => {
    await Clipboard.setStringAsync(code);
  };

  const handleSendViaWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${code}`;
    Linking.openURL(whatsappUrl).catch(() => {
      alert('Make sure WhatsApp is installed on your device');
    });
  };

  return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Hub Invite Code</Text>
          
          <Text style={[{color:'#635acc', textAlign:'center', marginBottom:20,
            fontSize:25,
            fontWeight:'bold'
          }]}>{code}</Text>
          <Text style={[{color:'#7D7D7D', textAlign:'center', marginBottom:20,
            fontSize:15}]}>valid for 2 hours</Text>
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              icon={() => <MaterialCommunityIcons name="content-copy" size={20} color="white" />}
              onPress={handleCopyToClipboard}
              style={styles.button}
            >
              Copy Code
            </Button>
            <Button
              mode="contained"
              icon={() => <MaterialCommunityIcons name="whatsapp" size={20} color="white" />}
              onPress={handleSendViaWhatsApp}
              style={styles.button}
            >
              WhatsApp
            </Button>
          </View>
          
          </View>
          </View>
        </Modal>
     
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
  dialogContainer: {
    margin: 20,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    padding: 10,
    maxHeight:'70%'
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
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default AddMemberDialog;
