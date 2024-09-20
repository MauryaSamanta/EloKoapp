import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';

const { width: screenWidth } = Dimensions.get('window');
interface FilePreviewProps {
    file_name: string;
    file_url: string;
    isVisible:boolean;
    onClose: () => void;
  }
  
const FilePreviewDialog: React.FC<FilePreviewProps> = ({ file_name, file_url,isVisible, onClose }) => {
  // Function to handle file download
  const handleDownload = async () => {
    // try {
    //   const fileExtension = file_url.split('.').pop();
    //   const filePath = `${RNFS.DocumentDirectoryPath}/${file_name}.${fileExtension}`;

    //   const downloadOptions = {
    //     fromUrl: file_url,
    //     toFile: filePath,
    //   };

    //   const download = RNFS.downloadFile(downloadOptions);
    //   const result = await download.promise;

    //   if (result.statusCode === 200) {
    //     console.log('File downloaded successfully:', filePath);
    //     // Optionally, you can alert the user or do something after the download completes
    //   }
    // } catch (error) {
    //   console.error('Error downloading the file:', error);
    // }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>

        {/* File Name */}
        <Text style={styles.fileName}>{file_name}</Text>

        {/* Image */}
        <Image
          source={{ uri: file_url }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: 'auto', // This ensures the height scales according to the image's aspect ratio
    aspectRatio: 1, // Modify this according to the image’s actual aspect ratio if needed
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 5,
  },
  downloadButton: {
    position: 'absolute',
    top: 20,
    right: 100, // Just to the left of the close button
    backgroundColor: '#66ff66',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileName: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -50 }], // Center align the file name text
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilePreviewDialog;
