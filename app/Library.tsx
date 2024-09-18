import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';  // Import DraggableFlatList

// Define the interface for the route params
interface RouteParams {
  wallpaper: string | null;
  hub: string;
  hubname?:string
}

// Define the file interface
interface File {
    _id:string;
  file_url: string;
  file_name: string;
  name_folder: string | null;
}

const Library: React.FC = () => {
  const route = useRoute();
  const { wallpaper, hub, hubname } = route.params as RouteParams;
  const token = useSelector((state: any) => state.auth.token);
  const [files, setFiles] = useState<File[]>([]);
  const handledrag = ({ data }: { data: File[] }) => {
   // setFiles(data);
  };
  //console.log(wallpaper);
  // Fetch files on component mount
  useEffect(() => {
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

    getFiles();
  }, [hub]);

  // Function to return the appropriate icon for file types
  const getFileIcon = (file: File) => {
    if (file.name_folder) {
      return  <Entypo name="folder" size={60} color="#ff9800" />;
    } else if (file.file_name.endsWith('.pdf')) {
      return <MaterialIcons name="picture-as-pdf" size={60} color="#e53935" />;
    } else if (file.file_name.match(/\.(jpg|jpeg|png|gif)$/)) {
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
      <DraggableFlatList
        data={files}
        onDragEnd={handledrag}
        keyExtractor={(item) => item._id}
        numColumns={3}
        contentContainerStyle={styles.container}
        renderItem={({ item,drag, isActive }) => (
          <TouchableOpacity style={styles.fileContainer}  onLongPress={drag} disabled={isActive}>
            {getFileIcon(item)}
           {item.file_name && ( <Text style={styles.fileName}>{truncateFileName(item.file_name)}</Text>)}
           {item.name_folder && ( <Text style={styles.fileName}>{truncateFileName(item.name_folder)}</Text>)}
          </TouchableOpacity>
        )}
      />
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
    justifyContent: 'space-between', // Equally space items horizontally in the row
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  fileContainer: {
    alignItems: 'center',
    width: '30%', // Makes sure each item takes up roughly a third of the row's width
    marginBottom: 30,
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Library;
