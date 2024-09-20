import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';

// Define the file interface
interface File {
  _id: string;
  file_url: string;
  file_name: string;
  name_folder: string | null;
  folder: {
    file_name?: string;
    file_url?: string;
  }[];
}

interface FolderDialogProps {
  file: File;
  isVisible: boolean;
  onClose: () => void;
}

// Folder Dialog component
const FolderDialog: React.FC<FolderDialogProps> = ({ file, isVisible, onClose }) => {

  // Function to return the appropriate icon for file types inside the folder
  const getFileIcon = (file_name: string) => {
    if (file_name.endsWith('.pdf')) {
      return <MaterialIcons name="picture-as-pdf" size={60} color="#e53935" />;
    } else if (file_name.match(/\.(jpg|jpeg|png|gif)$/)) {
      return <FontAwesome name="picture-o" size={60} color="#34ebc0" />;
    } else {
      return <MaterialIcons name="insert-drive-file" size={60} color="#2196f3" />;
    }
  };

  // Truncate long filenames to 9 characters with ellipsis
  const truncateFileName = (name: string) => {
    return name.length > 9 ? `${name.substring(0, 9)}...` : name;
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalBackground} >
      <Text style={styles.folderTitle}>{file.name_folder}</Text>
        <View style={styles.dialogContainer}>
       
          {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
          </TouchableOpacity> */}

          <View style={styles.folderContentsContainer}>
            {file.folder.length === 0 ? (
              <Text style={styles.noFilesText}>This folder is empty</Text>
            ) : (
              file.folder.map((item, index) => (
                <TouchableOpacity key={index} style={styles.fileContainer}>
                  {item.file_name && getFileIcon(item.file_name)}
                 {item.file_name && ( <Text style={styles.fileName}>{truncateFileName(item.file_name)}</Text>)}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
     // backdropFilter: 'blur(10px)'
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: 'rgba(99, 90, 204, 0.6)',
    borderRadius: 10,
    padding: 20,
    //justifyContent:'space-evenly'
    //alignItems: 'left',
  },
  folderTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: '#ff1744',
    borderRadius: 5,
  },
  folderContentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fileContainer: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  noFilesText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FolderDialog;
