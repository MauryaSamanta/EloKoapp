import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as FileSystem from 'expo-file-system';

const CloudDialog = ({ visible, onClose, handlesharefromcloud }) => {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'media', title: 'Media' },
    { key: 'docs', title: 'Docs' },
    { key: 'folders', title: 'Folders' },
  ]);
  const { colors } = useTheme();
  const { _id } = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`https://surf-jtn5.onrender.com/file/${_id}`, {
          method: 'POST',
        });
        const data = await response.json();
        setFiles(data);
        //console.log(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    if (visible) {
      fetchFiles();
    }
  }, [visible]);

  const filterFiles = (type) => {
    //console.log(files[0].file_name);
    //console.log(type);
    if (type === 'media') {
      //console.log(files.filter((file) => file?.file_name?.endsWith('jpg')));
      return files.filter((file) => file?.file_name?.endsWith('jpg'));
    } else if (type === 'docs') {
      return files.filter((file) => file?.file_name?.endsWith('pdf'));
    } else {
      return files.filter((file) => file?.name_folder);
    }
    
  };

  const renderMediaTab = () => (
    
    <FlatList
      data={filterFiles('media')}
      numColumns={3}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlesharefromcloud(item)}>
          <Image source={{ uri: item.file_url }} style={styles.image} />
        </TouchableOpacity>
      )}
    />
  );

  const renderDocsTab = () => (
    <FlatList
      data={filterFiles('docs')}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlesharefromcloud(item)} style={styles.fileItem}>
          <Text style={styles.fileIcon}>📄</Text>
          <Text style={styles.fileName}>{item.file_name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderFoldersTab = () => (
    <FlatList
      data={filterFiles('folders')}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlesharefromcloud(item)} style={styles.fileItem}>
          <Text style={styles.fileIcon}>📁</Text>
          <Text style={styles.fileName}>{item.name_folder}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderScene = SceneMap({
    media: renderMediaTab,
    docs: renderDocsTab,
    folders: renderFoldersTab,
  });
   const layout = useWindowDimensions();
   
   
   const TabBar = ({ index, setIndex }) => {
    return (
      <View style={styles.tabBarContainer}>
        {['Media', 'Docs', 'Folders'].map((tab, tabIndex) => (
          <TouchableOpacity
            key={tabIndex}
            onPress={() => setIndex(tabIndex)}
            style={[styles.tab, index === tabIndex && styles.activeTab]}>
            <Text style={[styles.tabText, index === tabIndex && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={[styles.title, { color: 'white' }]}>Your Files and Folders</Text>
          <TabBar index={index} setIndex={setIndex} />
          {index===0 && (
            renderMediaTab()
          )}
          {index===1 && (
            renderDocsTab()
          )}
          {index==2 && (
            renderFoldersTab()
          )}
           
          
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
    backgroundColor: '#36393f',
    borderRadius: 10,
    padding: 10,
    maxHeight:'70%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    
  },
  image: {
    width: 100,
    height: 100,
    margin: 2,
    borderRadius: 5,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  fileIcon: {
    marginRight: 10,
    fontSize: 20,
  },
  fileName: {
    fontSize: 16,
    color:'white'
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    borderRadius: 5,
  },
  activeTab: {
    //backgroundColor: '#635acc', // Change to your active tab color
  },
  tabText: {
    color: 'white',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
    color:'#635acc'
  },
});

export default CloudDialog;
