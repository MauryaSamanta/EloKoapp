import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';  // Import DraggableFlatList
import Draggable from 'react-native-draggable';
import { ScrollView } from 'react-native-gesture-handler';
import FolderDialog from '@/dialogs/FolderDialog';
import FilePreviewDialog from '@/dialogs/FilePreviewDialog';
import LibraryFolderIcon from '@/components/LibraryFolderIcon';
import { set } from 'date-fns';

//import FilePreviewDialog from '@/dialogs/FilePreviewDialog';
// Define the interface for the route params
interface RouteParams {
  wallpaper: string | null;
  hub: string;
  hubname?:string
}

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


const Library: React.FC = () => {
  const route = useRoute();
  const { wallpaper, hub, hubname } = route.params as RouteParams;
  const token = useSelector((state: any) => state.auth.token);
  const [files, setFiles] = useState<File[]>([]);
  const itemRefs = useRef<(TouchableOpacity | null)[]>([]);
  let coordinates: { _id:string; name:string; key: string; x: number; y: number }[] = [];
  const [selectedfolder,setselectedfolder]=useState<File>();
  const [dragfile,setdragfile]=useState<File>();
  const [folderdialog,setfolderdialog]=useState(false);
  const [selectedfile,setselectedfile]=useState<File>();
  const [showfile,setshowfile]=useState(false);
  const handleDrag = (e: any, gestureState: any, item:File) => {
    const { moveX, moveY } = gestureState;
    setdragfile(item);
    // Find names of coordinates that are near the current position
    const nearNames = coordinates
      .filter((coord) => 
        Math.abs(coord.x - moveX) <= 80 &&
        Math.abs(coord.y - moveY) <= 80
      )
      .map((coord) => coord._id); // Get the names
    
    if (nearNames.length > 0) {
     console.log('Near coordinates:', nearNames[0]);
     //setselectedfolder(nearNames[0]);
     //folderselect(nearNames[0]);
    }
    //setselectedfolder(nearNames[0]);
    
  
    console.log('Move X:', moveX); // This will log the x-coordinate during the drag
  };
  const handlerelease=(e: any, gestureState: any)=>{
    const { moveX, moveY } = gestureState;
    const nearNames = coordinates
    .filter((coord) => 
      Math.abs(coord.x - moveX) <= 80 &&
      Math.abs(coord.y - moveY) <= 80
    )
    .map((coord) => coord._id); // Get the names
    if(nearNames.length>0)
      {//setselectedfolder(nearNames[0]);
        //console.log(selectedfolder);
        addFiletoFolder(nearNames[0]);
      }
  }
  const addFiletoFolder=async(folder:string)=>{
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/file/${dragfile?._id}/${folder}`,{
        method:"PATCH"
      });
      const file=await response.json();
      if (response.ok) {
        // setFiles((prevFiles) =>
        //   prevFiles.map((f) => {
        //     if (f._id === folder) {
        //       return {
        //         ...f,
        //         folder: [
        //           ...f.folder,
        //           {
        //             file_name: dragfile?.file_name,
        //             file_url: dragfile?.file_url,
        //           },
        //         ],
        //       };
        //     }
        //     return f;
        //   })
        // );
        setFiles(files.filter((file) => file._id !== dragfile?._id));
        getFiles();
      }
    } catch (error) {
      
    }
  }
  const getFiles = async () => {
    const hubId = hub;

    try {
      const response = await fetch(`https://surf-jtn5.onrender.com/file/${hubId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      const files = await response.json();

      // Sorting: Folders first, then files
      const sortedFiles = files.sort((a: File, b: File) => {
        if (a.name_folder && !b.name_folder) return -1;
        if (!a.name_folder && b.name_folder) return 1;
        return 0;
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };
  useEffect(() => {
    getFiles();
  }, [hub]);

  const handlefile=(file:File)=>{
    if(file.name_folder)
    { console.log('ok');
      setselectedfolder(file);
      setfolderdialog(true);
    }
    else if(file.file_name)
    { console.log("hello");
      setselectedfile(file);
      setshowfile(true);
    }
    
  }
  const handlefileclose=()=>{
    setshowfile(false);
    setselectedfile(undefined);
  }

  const handleclosedialog=()=>{
    setfolderdialog(false);
  }

  // Function to return the appropriate icon for file types
  const getFileIcon = (file: File) => {
    if (file.name_folder) {
      // return  <Entypo name="folder" size={60} color={"#ff9800"} />;
      return <LibraryFolderIcon folder={file.folder}/>;
    } else if (file.file_name.endsWith('.pdf')) {
      return <MaterialIcons name="picture-as-pdf" size={60} color="#e53935" />;
    } else if (file.file_name.match(/\.(jpg|jpeg|png|gif)$/)) {
      return  <Image source={{ uri: file.file_url }} style={{ width: 60, height: 60, borderRadius: 8 }} />;
    } else {
      return <MaterialIcons name="insert-drive-file" size={60} color="#2196f3" />;
    }
  };

  

  // Truncate long filenames to 9 characters with ellipsis
  const truncateFileName = (name: string) => {
    return name.length > 8 ? `${name.substring(0, 8)}...` : name;
  };

  useEffect(() => {
   
    itemRefs.current.forEach((ref, index) => {
      if (ref && files[index].name_folder) {
        //console.log(files[index].name_folder);
        ref.measure((x, y, width, height, pageX, pageY) => {
          if(files[index].name_folder)
          coordinates.push({ _id:files[index]._id, name:files[index].name_folder,key: files[index]._id, x: pageX, y: pageY });
          console.log(coordinates);
        });
      }
    });

    // You can log the coordinates or do something with them
    //console.log(coordinates);
  }, [ handleDrag]); // Re-run when files change


  return (
    <ImageBackground
      source={wallpaper ? { uri: wallpaper } : undefined}
      style={[styles.background, { backgroundColor: wallpaper ? '#635acc' : 'rgba(44, 44, 44, 0.8)' }]}
      imageStyle={wallpaper ? styles.wallpaper : undefined}
      //borderRadius={50}
    >
       <View style={{  backgroundColor:'#635acc', justifyContent:'center', borderBottomEndRadius:20 }}>
        <Text style={[{color:'white',
                       marginLeft:20,marginTop:50, marginBottom:15,
                       fontSize:17}]}>
                        {hubname} 
        </Text>
       </View>
       <ScrollView contentContainerStyle={styles.container}>
        {files.map((item:File, index)=>
          
          <TouchableOpacity style={styles.fileContainer}  ref={(ref) => (itemRefs.current[index] = ref)}  onPress={()=>handlefile(item)}
          key={item._id}>
            <Draggable
          disabled={Boolean(item.name_folder)}
          renderSize={80}
          shouldReverse={true} // Reset to the original position after release
          onDrag={(e, gestureState)=>{handleDrag(e,gestureState,item)}}
          onDragRelease={(e,gestureState)=>{handlerelease(e,gestureState);}}
          onShortPressRelease={()=>handlefile(item)}
        >
            {getFileIcon(item)}
           {item.file_name && ( <Text style={styles.fileName}>{truncateFileName(item.file_name)}</Text>)}
           {item.name_folder && ( <Text style={styles.fileName}>{truncateFileName(item.name_folder)}</Text>)}
           </Draggable>
          </TouchableOpacity>
          
        )}
        {selectedfolder && (<FolderDialog file={selectedfolder} isVisible={folderdialog} onClose={handleclosedialog}/>)}
        {selectedfile && (<FilePreviewDialog file_url={selectedfile.file_url} file_name={selectedfile.file_name} isVisible={showfile} 
        onClose={handlefileclose}/> )}
        </ScrollView>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  wallpaper: {
    //opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Equally space items horizontally in the row
    paddingVertical: 50,
    paddingHorizontal: 30,
    height:'100%'
  },
  fileContainer: {
    alignItems: 'center',
    width: '30%', // Makes sure each item takes up roughly a third of the row's width
    marginBottom: 80,
    padding:20
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Library;
