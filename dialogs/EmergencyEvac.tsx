import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface EmergencyEvacDialogProps {
  visible: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}

const EmergencyEvac: React.FC<EmergencyEvacDialogProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          {/* Emergency Icon */}
          <Icon name="warning" size={50} color="#D32F2F" style={styles.icon} />

          {/* Description */}
          <Text style={styles.title}>Emergency Evacuation</Text>
          <Text style={styles.description}>
            Download all your cloud files to local storage. 
           
          </Text>
          <Text style={[styles.description,{padding:12}]}>
          On Clicking <Text style={[{color:'#D32F2F', fontWeight:'bold'}]}>Yes</Text>, Choose the folder in which you want to save the files and give necessary permissions
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>No Thanks</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'justify',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmergencyEvac;
