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
import * as ImagePicker from 'expo-image-picker';
import { set } from 'date-fns';

//import FilePreviewDialog from '@/dialogs/FilePreviewDialog';
// Define the interface for the route params
interface RouteParams {
  wallpaper: string | null;
  hub: string;
  hubname?:string;
  setwall:(x:string)=>void;
}

// Define the file interface
interface File {
  _id: string;
  file_url: string;
  file_name: string;
  name_folder: string ;
  folder: {
    file_name?: string;
    file_url?: string;
  }[];
}


const Library: React.FC = () => {
  const route = useRoute();
  const { wallpaper, hub, hubname,setwall } = route.params as RouteParams;
  const token = useSelector((state: any) => state.auth.token);
  const user=useSelector((state:any)=>state.auth.user);
  const [files, setFiles] = useState<File[]>([]);
  const itemRefs = useRef<(TouchableOpacity | null)[]>([]);
  let coordinates: { _id:string; name:string; key: string; x: number; y: number }[] = [];
  const [selectedfolder,setselectedfolder]=useState<File>();
  const [dragfile,setdragfile]=useState<File>();
  const [folderdialog,setfolderdialog]=useState(false);
  const [selectedfile,setselectedfile]=useState<File>();
  const [showfile,setshowfile]=useState(false);
  const [wall,setwallpaper]=useState(wallpaper);
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
     //('Near coordinates:', nearNames[0]);
     //setselectedfolder(nearNames[0]);
     //folderselect(nearNames[0]);
    }
    //setselectedfolder(nearNames[0]);
    
  
    //('Move X:', moveX); // This will log the x-coordinate during the drag
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
        ////(selectedfolder);
        addFiletoFolder(nearNames[0]);
      }
  }
  const addFiletoFolder=async(folder:string)=>{
    setFiles(files.filter((file) => file._id !== dragfile?._id));
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/file/${dragfile?._id}/${folder}`,{
        method:"PATCH"
      });
      const file=await response.json();
      if (response.ok) {
        
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

  const removefilefromfolder=async(filedata:any)=>{
      const data={
        userid:user._id, 
        hubid:hub,
        file_name: filedata.file_name,
        file_url: filedata.file_url, 
        folderid:selectedfolder?._id
      }
      try {
        const response=await fetch(`https://surf-jtn5.onrender.com/file/remove`,{
          method:"PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(data)
        });
        setFiles(prevFiles => prevFiles.map(folder => 
          folder._id === selectedfolder?._id 
            ? { ...folder, folder: folder.folder.filter(file => !(file.file_name === filedata.file_name && file.file_url === filedata.file_url)) }
            : folder
        ));
        setFiles(prevFiles => prevFiles.filter(folder => !(folder.name_folder && folder.folder.length === 0)));

        const newfile=await response.json();
         setFiles((prevFiles)=>[...prevFiles,newfile]);
      } catch (error) {
        
      }
      setselectedfolder(undefined);
  }
  useEffect(() => {
    getFiles();
  }, [hub]);

  const handlefile=(file:File)=>{
    if(file.name_folder)
    { //('ok');
      setselectedfolder(file);
      setfolderdialog(true);
    }
    else if(file.file_name)
    { //("hello");
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
        ////(files[index].name_folder);
        ref.measure((x, y, width, height, pageX, pageY) => {
          if(files[index].name_folder)
          coordinates.push({ _id:files[index]._id, name:files[index].name_folder,key: files[index]._id, x: pageX, y: pageY });
          //(coordinates);
        });
      }
    });

    // You can log the coordinates or do something with them
    ////(coordinates);
  }, [ handleDrag]); // Re-run when files change

  const selectwall=async()=>{

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64:true
    });
    const formData=new FormData();
    if(result.assets)
    {formData.append("avatar",
    {uri:result.assets[0].uri,
    type:result.assets[0].mimeType,
    name:result.assets[0].fileName
    }as any);
    formData.append("id",user._id);
    //(JSON.stringify(formData));
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/wall/${hub}`,{
        method:"PATCH",
        body:formData
      });
      const data=await response.json();
      setwall(data.wall_url);
      setwallpaper(data.wall_url);
    } catch (error) {
      //(error);
    }}
    else
    return null;
  }

  return (
    <ImageBackground
      source={wall ? { uri: wall } : undefined}
      style={[styles.background, { backgroundColor: wallpaper ? '#635acc' : 'rgba(44, 44, 44, 0.8)' }]}
      imageStyle={wallpaper ? styles.wallpaper : undefined}
      //borderRadius={50}
    >
       <View style={{  backgroundColor:'#635acc', justifyContent:'space-between',flexDirection:'row', borderBottomEndRadius:20 }}>
        <Text style={[{color:'white',
                       marginLeft:20,marginTop:50, marginBottom:15,
                       fontSize:17}]}>
                        {hubname} 
        </Text>
        <TouchableOpacity onPress={selectwall}>
        <MaterialIcons name="now-wallpaper" size={30} color="white" style={[{marginTop:50, marginRight:30}]} />
        </TouchableOpacity>
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
        {selectedfolder && (<FolderDialog file={selectedfolder} isVisible={folderdialog} onClose={handleclosedialog} movefile={removefilefromfolder}/>)}
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
