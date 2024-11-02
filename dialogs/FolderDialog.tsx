import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import FilePreviewDialog from './FilePreviewDialog';
import Draggable from 'react-native-draggable';
import Pdf from 'react-native-pdf';
// Define the file interface
interface File {
  _id: string;
  file_url?: string;
  file_name?: string;
  name_folder?: string ;
  folder: {
    file_name?: string;
    file_url?: string;
  }[];
}

interface FolderDialogProps {
  file: File;
  isVisible: boolean;
  onClose: () => void;
  movefile: (file:any)=>void;
}

// Folder Dialog component
const FolderDialog: React.FC<FolderDialogProps> = ({ file, isVisible, onClose, movefile }) => {
  const [showfile,setshowfile]=useState(false);
  const [selectedfile,setselectedfile]=useState<File>();
  const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0 });
  const [editing,setediting]=useState(false);
  const [newname,setnewname]=useState(file.name_folder);
  // Get modal dimensions when it renders
  const handleModalLayout = (event:any) => {
    const { width, height } = event.nativeEvent.layout;
    setModalDimensions({ width, height });
  };
  
  const handleDragRelease = (event:any, gestureState:any, item:any) => {
    const { moveX, moveY } = gestureState;
    ////(moveX);
    const modalWidth = modalDimensions.width;
    const modalHeight = modalDimensions.height;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    //(modalWidth)
    // Checking if the draggable item is outside the modal boundaries
    if (
      moveX < (screenWidth - modalWidth) / 2 ||
      moveY < (screenHeight - modalHeight) / 2 ||
      moveX > (screenWidth + modalWidth) / 2 ||
      moveY > (screenHeight + modalHeight) / 2
    ) {
      movefile(item);
      onClose(); // Run your custom function when dragged outside
    }
  };

  const handleclosefile=()=>{
    setshowfile(false);
    setselectedfile(undefined);
  }
  // Function to return the appropriate icon for file types inside the folder
  const getFileIcon = (file_name: string, file_url:string) => {
    if (file_name.endsWith('.pdf')) {
      //style={{ width: 60, height: 60, borderRadius: 8 }}
      return <Pdf
      trustAllCerts={false}
        source={{ uri: file_url, cache:true }}
        style={{ width: 60, height: 60, borderRadius: 8 }}
        singlePage={true}
        scale={2}
        progressContainerStyle={[{backgroundColor:'#eee'}]}
      
        onLoadComplete={(numberOfPages, filePath) => {
          //(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page,numberOfPages) => {
          //(`Current page: ${page}`);
      }}
        onError={(error) => {
          //(error);
        }}
      />;
    } else if (file_name.match(/\.(jpg|jpeg|png|gif)$/)) {
      return <Image source={{ uri: file_url }} style={{ width: 60, height: 60, borderRadius: 8 }} />;
    } else if(file_name.match(/\.(ppt|pptx)$/))
      {
        return <Image source={require(`../assets/images/ppt.png`)} style={{ width: 60, height: 60, borderRadius: 8 }} />;
      } else if(file_name.match(/\.(doc|docx)$/))
        {
          return <Image source={require(`../assets/images/doc (1).png`)} style={{ width: 60, height: 60, borderRadius: 8 }} />;
        }else if(file_name.match(/\.(xls|xlsx)$/))
          {
            return <Image source={require(`../assets/images/xls.png`)} style={{ width: 60, height: 60, borderRadius: 8 }} />;
          }
    else {
      return <MaterialIcons name="insert-drive-file" size={60} color="#2196f3" />;
    }
  };

  // Truncate long filenames to 9 characters with ellipsis
  const truncateFileName = (name: string) => {
    return name.length > 9 ? `${name.substring(0, 9)}...` : name;
  };

  const handlefile=(file:any)=>{
    if(file.file_url && file.file_name){
      setshowfile(true);
      setselectedfile(file);
    }
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={()=>{setediting(false);setnewname(file.name_folder);onClose()}}>
      <View style={styles.modalBackground} >
      {!editing?(<Text style={styles.folderTitle} onPress={()=>setediting(true)}>{file.name_folder}</Text>):(
         <TextInput
         style={styles.usernameInput}
         value={newname}
         onChangeText={setnewname}
         //onBlur={handleSaveUsername} // Save when clicking outside
         autoFocus={true}
         returnKeyType="done"
         //onSubmitEditing={handleSaveUsername} // Save on pressing "Enter"
       />
      )}
        <View style={styles.dialogContainer} onLayout={handleModalLayout}>
       
          {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
          </TouchableOpacity> */}

          <View style={styles.folderContentsContainer}>
            {file.folder.length === 0 ? (
              <Text style={styles.noFilesText}>This folder is empty</Text>
            ) : (
              file.folder.map((item, index) => (
                <TouchableOpacity key={index} style={styles.fileContainer} onPress={()=>handlefile(item)} >
                   <Draggable
          //disabled={Boolean(item.name_folder)}
          renderSize={80}
          //shouldReverse={true} // Reset to the original position after release
          // onDrag={(e, gestureState)=>{handleDrag(e,gestureState,item)}}
          // onDragRelease={(e,gestureState)=>{handlerelease(e,gestureState);}}
          onDragRelease={(e, gestureState)=>handleDragRelease(e,gestureState,item )}
           onShortPressRelease={()=>handlefile(item)}
        >
                  {item.file_name && item.file_url && getFileIcon(item.file_name, item.file_url)}
                 {item.file_name && ( <Text style={styles.fileName}>{truncateFileName(item.file_name)}</Text>)}
                 </Draggable>
                </TouchableOpacity>
              ))
            )}
            {selectedfile?.file_url && selectedfile?.file_name && (<FilePreviewDialog file_url={selectedfile.file_url} file_name={selectedfile.file_name}
             isVisible={showfile} onClose={handleclosefile}/> )}
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
    marginBottom: 80,
    padding:20
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
  usernameInput: {
    color: '#fff',
    fontSize: 20,
    //fontWeight: 'bold',
    marginTop:100,
    marginBottom:20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    //width: 200,
  },
});

export default FolderDialog;
