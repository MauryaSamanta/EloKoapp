import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const CreateQubeDialog = ({ visible, onClose, setQubes, hub }) => {
  const [qubeName, setQubeName] = useState('');
  const [qubeNickname, setQubeNickname] = useState('');
  const [error, setError] = useState('');
  const token=useSelector((state)=>state.auth.token);
  const handleCreateQube = async() => {
    if (qubeNickname.length > 5) {
      setError('Nickname must be 5 letters or less.');
    } else {
      const data={qube_name:qubeName, nick_name:qubeNickname};
      //console.log(JSON.stringify(data));
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/qube/${hub}/new`,{
            method:"POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type":"application/json" },
            body:JSON.stringify(data)
        });
        const val=await response.json();
        if(val.savedQube)
        setQubes(prevQubes=>[...prevQubes,val.savedQube]);
      } catch (error) {
        console.log(error);
      }
      setError('');
      onClose(); // Close the modal after creation
      setQubeName('');
      setQubeNickname('');
    }
  };

  const handleNicknameChange = (text) => {
    if (text.length <= 5) {
      setQubeNickname(text);
      setError('');
    } else {
      setError('Nickname must be 5 letters or less.');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Create New Qube</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Qube Name"
            value={qubeName}
            onChangeText={setQubeName}
            placeholderTextColor={'#616161'}
          />

          <TextInput
            style={styles.input}
            placeholder="Qube Nickname (5 letters)"
            value={qubeNickname}
            onChangeText={handleNicknameChange}
            maxLength={5}
            placeholderTextColor={'#616161'}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCreateQube}>
              <Text style={styles.buttonText}>Create Qube</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#1D1D1D',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#635acc', // Primary color
  },
  input: {
    height: 45,
    borderColor: '#635acc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#635acc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color:'black'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateQubeDialog;
