import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';

interface QubePermissionDialogProps {
  visible: boolean; // Control the visibility of the dialog
  onClose: () => void; // Function to close the dialog
  onsendRequest?: () => void; // Function to handle send request action
}

const QubePermissionDialog: React.FC<QubePermissionDialogProps> = ({
  visible,
  onClose,
onsendRequest,
}) => {
  const sendreq=async()=>{

  }
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
        
      <View style={styles.overlay}>
        <View style={styles.container}>
            <Image source={require('../assets/images/favorite.png')} style={[{width:50, height:50, marginBottom:10}]}/>
          <Text style={styles.title}>This is an Exclusive Qube!</Text>
          <Text style={styles.description}>
            You need permission to join this Qube. 
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onsendRequest}
          >
            <Text style={styles.buttonText}>Send Join Request to Owner</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  container: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#292929', // Dark background
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700', // Golden color
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD700', // Golden-ish color
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#292929', // Dark color for button text
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: '#635acc', // Custom color
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default QubePermissionDialog;
