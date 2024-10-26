import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Using MaterialIcons for icons
import { Message } from '@/types';
import ChatItemDialog from '@/components/ChatItemDialog';
import { useSelector } from 'react-redux';
import * as Clipboard from 'expo-clipboard';

interface MessageOptionsDialogProps {
  visible: boolean;
  onClose: () => void;
  message:Message;
  hubId?:string;
}

const MessageOptionsDialog: React.FC<MessageOptionsDialogProps> = ({
  visible,
  onClose,
  message,
  hubId
}) => {
    const {_id}=useSelector((state:any)=>state.auth.user);
    const token=useSelector((state:any)=>state.auth.token);
    const isown=message.sender_id._id===_id || message.sender_id===_id;
    const [savedText,setsavedText]=useState('Save to My Library');
   
    useEffect(()=>{
      setsavedText('Save to My Library');
    },[])
    const saveFile=async()=>{
        //("hello");
        const fileData = {
            hub_id: hubId ,
            file_url: message.file,
            file_name: message.name_file,
            name_folder: message.name_folder,
            folder: message.folder
          };
          try {
            const response = await fetch(`https://surf-jtn5.onrender.com/file/new`, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify(fileData),
            });
            const data = await response.json();
            //(data);
            if(data==='Success')
                setsavedText('Saved');
            //setShowTick(true); // Show tick mark after saving
            //setTimeout(() => setShowTick(false), 2000); // Hide tick mark after 2 seconds
          } catch (error) {
            console.error('Error saving file:', error);
          }
    }
    const deletemsg=async()=>{
      let messageid=message._id;
      //(message._id);
      onClose();
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/message/${message._id}`,{
          method:"DELETE"
        });
        ////(response);
       
        
      } catch (error) {
        
      }
    }

    const handleCopyToClipboard = async() => {

      await Clipboard.setStringAsync(message.text||'');
    };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={()=>{onClose}}
    >
      <View style={styles.overlay}>
        <ChatItemDialog message={message} isOwnMessage={message.sender_id._id===_id || message.sender_id===_id}/>
        <View style={styles.dialogBox}>
          {/* Save to My Library */}
       {message.file ? ( <TouchableOpacity style={styles.button} onPress={saveFile}
          >
            <MaterialIcons name="save" size={24} color="#635acc" style={styles.icon} 
            />
            <Text style={styles.buttonText}>{savedText}</Text>
          </TouchableOpacity>):(<></>)}
          {message.folder && message.folder.length>0 ? ( <TouchableOpacity style={styles.button} onPress={saveFile}
          >
            <MaterialIcons name="save" size={24} color="#635acc" style={styles.icon} />
            <Text style={styles.buttonText}>{savedText}</Text>
          </TouchableOpacity>):(<></>)}

          {/* Reply and Copy Text Group */}
          <View style={styles.group}>
            <TouchableOpacity style={[styles.button,{marginBottom:0, borderBottomRightRadius:0,borderBottomLeftRadius:0}]} //</View>onPress={}
            >
              <MaterialIcons name="reply" size={24} color="#635acc" style={styles.icon} />
              <Text style={styles.buttonText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{marginTop:2,borderTopRightRadius:0,borderTopLeftRadius:0}]} onPress={handleCopyToClipboard}
            >
              <MaterialIcons name="content-copy" size={24} color="#635acc" style={styles.icon} />
              <Text style={styles.buttonText}>Copy Message</Text>
            </TouchableOpacity>
          </View>

          {/* Delete Message */}
          {isown && (<TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deletemsg}
          >
            <MaterialIcons name="delete" size={24} color="#ff4444" style={styles.icon} />
            <Text style={[styles.buttonText, styles.deleteText]} >Delete Message</Text>
          </TouchableOpacity>)}

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  dialogBox: {
    width: '85%',
    backgroundColor: '#36393f',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#454545',
    borderRadius: 30,
    padding: 12,
    marginVertical: 10,
    width: '100%',
    //justifyContent: 'left',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  icon: {
    marginRight: 10,
  },
  group: {
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    //backgroundColor: '#ffebee',
    //justifyContent:'center'
  },
  deleteText: {
    color: '#ff4444',
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: '#635acc',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MessageOptionsDialog;
