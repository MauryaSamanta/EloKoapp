import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const CreateZoneDialog = ({ visible, onClose, setZones,qube }) => {
  const [zoneName, setZoneName] = useState('');
  const token=useSelector((state)=>state.auth.token);
  const handleCreateZone = async() => {
    if (zoneName.trim()) {
      // Handle Zone creation logic here
      //console.log('Zone Created:', { zoneName });
      const data={name:zoneName};
     // console.log(qube._id);
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/zone/${qube._id}/new`,{
            method:"POST",
            headers:{Authorization: `Bearer ${token}`,"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const val=await response.json();
        if(val.savedZone)
        setZones(prevZones=>[...prevZones,val.savedZone]);
      } catch (error) {
        console.log(error);
      }
      setZoneName('');

      onClose(); // Close the modal after creation
    } else {
      alert('Zone Name cannot be empty.');
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
          <Text style={styles.header}>Create New Zone</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Zone Name"
            value={zoneName}
            onChangeText={setZoneName}
            placeholderTextColor={'#616161'}
          />

          <View style={styles.buttonContainer}>
            
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCreateZone}>
              <Text style={styles.buttonText}>Create Zone</Text>
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
    color: '#635acc', // Primary color for consistency
  },
  input: {
    height: 45,
    borderColor: '#635acc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: 'white',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateZoneDialog;
