import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// Define interface for props
interface FilePreviewDialogProps {
  file_url: string;
  file_name: string;
  isVisible: boolean;
  onClose: () => void; // Function to close the dialog
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ file_url, file_name, isVisible, onClose }) => {
  const screenWidth = Dimensions.get('window').width;
  const isPDF = file_name.endsWith('.pdf');
  const isImage=file_name.endsWith(".jpg") || file_name.endsWith(".jpeg")||file_name.endsWith(".png");
  const [loading,setloading]=useState(true);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={()=>{isImage && onClose();}}>
      <View style={styles.modalBackground}>
        {/* Close Button at the top right of the screen */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>

        {/* File Name at the top center of the screen */}
        <Text style={styles.fileName}>{file_name}</Text>

        {/* Image taking full width of the screen */}
        {/* <Image
          source={{ uri: file_url }}
          style={[styles.image, { width: screenWidth }]}
          resizeMode="contain"
        /> */}
          {!isPDF && isImage ? (
            <Image
              source={{ uri: file_url }}
              style={[styles.image, { width: screenWidth }]}
              resizeMode="contain"
            />
          ) : isPDF?(
            //<WebView source={{ uri: 'https://docs.google.com/viewer?url=https://res.cloudinary.com/df9fz5s3o/raw/upload/v1729439527/w9rtz25xqpxivja6wadw.pptx&embedded=true' }} style={{width:400, marginTop:60}} />
           <>
           <>
            <Pdf
            trustAllCerts={false}
              source={{ uri: file_url }}
              style={[styles.pdf, { width: screenWidth, height: '80%' }]} // Adjust height as needed
              onLoadComplete={(numberOfPages, filePath) => {
                //(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages) => {
                //(`Current page: ${page}`);
            }}
              onError={(error) => {
                //(error);
              }}
            />
            </>
            {/* <>
            <Pdf
            trustAllCerts={false}
              source={{ uri: file_url }}
              style={[styles.pdf, { width: screenWidth, height: '80%' }]} // Adjust height as needed
              onLoadComplete={(numberOfPages, filePath) => {
                //(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages) => {
                //(`Current page: ${page}`);
            }}
              onError={(error) => {
                //(error);
              }}
            />
            </> */}
         </>
          ):( 
          // <>
          //   {loading ?(<AnimatedCircularProgress
          // size={30}
          // width={4}
          // fill={75}
          // tintColor="white"
          // //onAnimationComplete={() => //('')}
          // backgroundColor="#4D4599"
          // rotation={0}
          // lineCap="round" />
          // ):(
          // <WebView source={{ uri: `https://docs.google.com/viewer?url=${file_url}&embedded=true` }} onLoad={()=>{console.log(loading)}}
          // style={{width:400, marginTop:60}} />)}
          //   </>
          <WebView source={{ uri: `https://docs.google.com/viewer?url=${file_url}&embedded=true` }} style={{width:400, marginTop:60}}
          javaScriptEnabled={true}
   domStorageEnabled={true}
   startInLoadingState={false}
   scalesPageToFit={true} />
          
        //   
        )}
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Styling
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,1.0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex:1,
    backgroundColor: 'rgba(0, 0, 0,1.0)',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
},
  closeButton: {
    position: 'absolute',
    top: 20, // Adjust for status bar or notch if necessary
    right: 20,
    zIndex: 10,
  },
  fileName: {
    position: 'absolute',
    top: 20, // Adjust to be aligned with the close button
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    zIndex: 9,
  },
  image: {
    marginTop: 80, // Push the image down to leave space for the top section
    height: 'auto',
    aspectRatio: 1, // Maintains aspect ratio for square images
  },
});

export default FilePreviewDialog;
