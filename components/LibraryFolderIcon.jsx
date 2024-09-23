import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
const FolderIcon = ({ folderFiles }) => {
  const getFileIcon = (file) => {
    // Check if the file is an image (adjust for more file types if needed)
    if (file.file_url?.endsWith('.png') || file.file_url?.endsWith('.jpg') || file.file_url?.endsWith('.jpeg')) {
      return (
        <Image source={{ uri: file.file_url }} style={styles.fileImage} />
      );
    } else {
      // If not an image, return a default PDF icon
      return (
        <MaterialIcons name="picture-as-pdf" size={20} color="#e53935" />
      );
    }
  };

  // Limit to 6 items for the folder icon view
  const displayedFiles = folderFiles.slice(0, 6);

  return (
    <View style={styles.folderIcon}>
      <View style={styles.gridContainer}>
        {displayedFiles.map((file, index) => (
          <View key={index} style={styles.gridItem}>
            {getFileIcon(file)}
          </View>
        ))}
      </View>
    </View>
  );
};

// Example Usage
const LibraryFolderIcon = ({ folder }) => {
  return (
    <View style={styles.libraryContainer}>
     
      <FolderIcon folderFiles={folder} />
    </View>
  );
};

const styles = StyleSheet.create({
  libraryContainer: {
    alignItems: 'center',
    //margin: 10,
  },
  folderIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#C7BCFF', // Light gray background for the folder icon
    borderRadius: 25,
    padding: 5,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33%', // 3 items per row
    padding: 2,
  },
  fileImage: {
    width: '100%',
    height: 20, // Adjust the size of the icons
    resizeMode: 'cover',
  },
});

export default LibraryFolderIcon;
