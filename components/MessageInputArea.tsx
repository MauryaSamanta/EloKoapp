import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library
import Entypo from '@expo/vector-icons/Entypo';
import { themeSettings } from '../constants/Colors';
const { width } = Dimensions.get('window');
const colors = themeSettings("dark");
const MessageInputArea = () => {
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSend = () => {
    // Handle sending message logic here
    setMessage('');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <View style={styles.container}>
      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={false}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="document-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="folder-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>Folder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="mic-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="videocam-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Attachment Icon */}
      <TouchableOpacity onPress={toggleMenu} style={[styles.attachmentButton,
        {
            transform: [{ rotate: showMenu ? '45deg' : '0deg' }]
        }]}>
      <Entypo name="plus" size={28} color='white' />
      </TouchableOpacity>

      {/* Text Input */}
      {!showMenu?(<TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#aaa"
        value={message}
        multiline
        onChangeText={setMessage}
      />):(
        <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="folder-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Folder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="mic-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="videocam-outline" size={19} color="#fff" />
          <Text style={styles.menuText}>Video</Text>
        </TouchableOpacity>
      </View>
      )}

      {/* Send Button */}
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <Icon name="send" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    //width: width,
    paddingVertical: 10,
    backgroundColor: '#4D4599',
   borderTopLeftRadius:10,
   borderTopRightRadius:10
    //borderTopWidth: 1,
    //borderTopColor: '#ddd',
    //paddingHorizontal: 10,
  },
  attachmentButton: {
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#382F66',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: 'white',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sendButton: {
    backgroundColor: colors.colors.primary.main,
    padding: 10,
    borderRadius: 25,
    marginRight:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  menu: {
    backgroundColor: '#4D4599',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    //width: '100%',
    flexDirection:'row'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight:10
  },
  menuText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default MessageInputArea;
