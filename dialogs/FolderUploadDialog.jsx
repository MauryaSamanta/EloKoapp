import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FolderUploadDialog = ({ visible, onClose, setFiles, setNameFolder }) => {
  const [folderName, setFolderName] = useState('');
  const [files, setLocalFiles] = useState([]);

  // Handle folder name input
  const handleFolderNameChange = (name) => {
    setFolderName(name);
    setNameFolder(name); // Prop function to set the folder name
  };

  // Handle file upload using Expo Document Picker
  const handleAddFile = async () => {
    if (files.length >= 10) {
      Alert.alert('Limit Reached', 'You can upload up to 10 files.');
      return;
    }
    console.log("hello");
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });

  
      const fileUri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      
      const fileData = {
        uri: result.assets[0].uri,
        name:result.assets[0].name,
        type:result.assets[0].mimeType
      };

      setLocalFiles((prevFiles) => [...prevFiles, fileData]);
      setFiles((prevFiles) => [...prevFiles, fileData]); // Prop function to set the files array
      //console.log(files);
    
  };

  // Handle file deletion
  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setLocalFiles(updatedFiles);
    setFiles(updatedFiles); // Prop function to update files array
  };

  // Render each uploaded file
  const renderFileItem = ({ item, index }) => (
    
    <View style={styles.fileItem}>
      <Text style={styles.fileName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDeleteFile(index)}>
        <MaterialCommunityIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={()=>{onClose();setLocalFiles([]); setFolderName('')}}>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Create New Folder</Text>

          <TextInput
            placeholder="Enter Folder Name"
            value={folderName}
            onChangeText={handleFolderNameChange}
            style={styles.textInput}
            placeholderTextColor={'#616161'}
          />

          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No files added yet.</Text>}
            style={styles.fileList}
          />

          <TouchableOpacity style={styles.buttonContainer} onPress={handleAddFile}>
            <Text style={[{color:'white'}]}>Add File</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    margin: 20,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'white'
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color:'white'
  },
  fileList: {
    maxHeight: 150,
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  fileName: {
    flex: 1,
    marginRight: 10,
    color:'white'
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor:'#635acc',
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    borderRadius:20
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default FolderUploadDialog;
