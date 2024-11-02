import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Keyboard, Animated, Easing, TouchableWithoutFeedback,
   ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserProfileDialog from '@/dialogs/UserProfileDialog';
import { setlogin } from './store/authSlice';
import * as ImagePicker from 'expo-image-picker';
import EmergencyEvac from '@/dialogs/EmergencyEvac';
import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';
import { shareAsync } from 'expo-sharing';
const Account = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const [showCard, setShowCard] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  //const [dataforavatar,setdata]=useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [changingcolor,setchangingcolor]=useState(false);
  const [newBio, setNewBio] = useState(user.bio || '');
  const [bioHeight] = useState(new Animated.Value(60)); // Initial button height
  const [showBioInput, setShowBioInput] = useState(false);
  const dispatch = useDispatch();
  const [colourHeight]=useState(new Animated.Value(60));
  const [selectedColor,setSelectedColor]=useState<any>(user.color || '');
  const [emergencydiag,setemergencydiag]=useState(false);
  const colors = [
  '#1E90FF', '#2F4F4F', '#4682B4', '#556B2F', '#8B4513', 
  '#D2691E', '#B22222', '#5F9EA0', '#6A5ACD', '#CD5C5C', 
  '#8A2BE2', '#696969',

  // Womanly or Neutral colors
  '#FF69B4', '#FFD700', '#FFB6C1', '#7FFFD4', '#FF6347', 
  '#DAA520', '#BA55D3', '#FFE4C4', '#F08080', '#ADFF2F', 
  '#00FA9A', '#F0E68C',
  ];
  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  const handleSaveUsername = async() => {
    setIsEditingUsername(false);
    Keyboard.dismiss();
    try {
        const data={username:newUsername, bio:newBio};
        const response=await fetch(`https://surf-jtn5.onrender.com/users/${user._id}/avatar`,{
            method:"PATCH",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data)
        });
        const savedUser=await response.json();
        dispatch(setlogin({user:savedUser,token:token}))
    } catch (error) {
        
    }
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
    setShowBioInput(true);
    Animated.timing(bioHeight, {
      toValue: 200, // Expanded height
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    
  };
  const handleeditcolor = () => {
    // setIsEditingBio(true);
    setchangingcolor(true);
    Animated.timing(colourHeight, {
      toValue: 150, // Expanded height
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    
  };

  const handleSaveBio = async() => {
    setIsEditingBio(false);
    setShowBioInput(false);
    Animated.timing(bioHeight, {
      toValue: 60, // Collapse back to initial height
      duration: 230,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    ////('New bio:', newBio);
    try {
        const data={username:newUsername, bio:newBio};
        const response=await fetch(`https://surf-jtn5.onrender.com/users/${user._id}/avatar`,{
            method:"PATCH",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data)
        });
        const savedUser=await response.json();
        dispatch(setlogin({user:savedUser,token:token}))
    } catch (error) {
        
    }
  };

  const handleclosecolor=async()=>{
    setchangingcolor(false);
    Animated.timing(colourHeight, {
      toValue: 60, // Collapse back to initial height
      duration: 230,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

  }
  const handlesavecolor=async(color:string)=>{
    const data={color:color};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/users/${user._id}/color`,{
        method:'PATCH',
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(data)
      });
      const savedUser=await response.json();
      dispatch(setlogin({user:savedUser,token:token}))
      ////(savedUser);
    } catch (error) {
      
    }
  }


  const handleOutsideClick = () => {
    if (isEditingBio) {
      handleSaveBio();
    }
    if(isEditingUsername){
      handleSaveUsername();
    }
    if(changingcolor){
      handleclosecolor();
    }
   
  };

  const handlesavePic=async(dataforavatar:string)=>{
    //setdata('');
    ////("hello");
    ////(dataforavatar);
    try {
        const data={username:newUsername, bio:newBio, filedata:dataforavatar};
        const response=await fetch(`https://surf-jtn5.onrender.com/users/${user._id}/avatar`,{
            method:"PATCH",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data)
        });
        ////(response);
        //setdata('');
        const savedUser=await response.json();
       //(savedUser);
        dispatch(setlogin({user:savedUser,token:token}))
    } catch (error) {
        
    }
  }

  const selectImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        
        base64:true
      });
      let photo ;
      if(result?.assets)
        {
           const data=`data:image/jpeg;base64,${result.assets[0].base64}`;
           //setdata(data);
           ////(dataforavatar);
           handlesavePic(data);
        }
      ////(result);
  
  };
 
  async function sendPushNotification(expoPushToken: string) {
    ////(expoPushToken);
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
   try {
    const response=await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    //(await response.json());
   } catch (error) {
    //(error);
   }
    
  }
  async function requestExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const onConfirm=async()=>{
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/file/${user._id}`,{
        method:"POST"
      });
      const data=await response.json();
      console.log(data);
      console.log(data);

    // Directory to temporarily store files
    const tempDir = `${FileSystem.cacheDirectory}EloKoDownloads/`;

    // Ensure the directory exists
    const dirExists = await FileSystem.getInfoAsync(tempDir);
    if (!dirExists.exists) {
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
    }

    // Download each file to the temporary directory
    const filePaths = [];
    for (const file of data) {
      const { file_name, file_url } = file;
      const filePath = `${tempDir}${file_name}`;
      
      // Download or move the file based on URL type
      if(file_url && file_name)
      {if (file_url?.startsWith('https')) {
        // Download file from cloud URL
        await FileSystem.downloadAsync(file_url, filePath);
      } else if (file_url?.startsWith('file')) {
        const fileInfo = await FileSystem.getInfoAsync(file_url);
        if (fileInfo.exists) {
        await FileSystem.copyAsync({ from: file_url, to: filePath });
        }
      }
      filePaths.push({file_url:filePath, file_name:file_name}); }// Add to array of file paths
    }
    console.log(filePaths);
    // Share all files at once
    saveFile(filePaths)

    setemergencydiag(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveFile(uri:any[]) {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  
      if (permissions.granted) {
        for(var i=0;i<uri.length;i++)
        {  const fileUrl = uri[i].file_url;
           const fileInfo = await FileSystem.getInfoAsync(fileUrl);
           if(fileInfo.exists)
          {const base64 = await FileSystem.readAsStringAsync(uri[i].file_url, { encoding: FileSystem.EncodingType.Base64 });
  
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, uri[i].file_name, '*/*')
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
        }
        }
      } 
    } 
  }
  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.container}>
        <Text style={[{color:'white', marginBottom:40, fontSize:30, fontWeight:'bold', marginTop:-50}]}>Profile Center</Text>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={120} source={{ uri: user.avatar_url }} />
          <IconButton
            icon="pencil"
            size={20}
           
            style={styles.editIcon}
            onPress={() => selectImage()}
          />
        </View>

        {/* Username with edit functionality */}
        <View style={styles.usernameContainer}>
          {isEditingUsername ? (
            <TextInput
              style={styles.usernameInput}
              value={newUsername}
              onChangeText={setNewUsername}
              onBlur={handleSaveUsername} // Save when clicking outside
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleSaveUsername} // Save on pressing "Enter"
            />
          ) : (
            <>
              <Text style={[styles.username,{color:user.color||'#fff'}]} onPress={handleEditUsername}>{newUsername}</Text>
              <IconButton
                icon="pencil"
                size={20}
                style={styles.usernameEditIcon}
                onPress={handleEditUsername}
              />
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button,styles.buttonContent]} onPress={() => setShowCard(true)}>
            <Image source={require('../assets/images/flag.png')} style={{ width: 24, height: 24, marginRight: 10 }} />
            <Text style={[styles.buttonText,{fontWeight:showCard?'bold':undefined}]}>View EloKo Card</Text>
          </TouchableOpacity>

          {/* Edit Bio button with animated height */}
          <Animated.View style={[styles.button, { height: bioHeight }]}>
            <TouchableOpacity onPress={handleEditBio} disabled={isEditingBio}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="edit-note" size={24} color="white" style={{ marginRight: 10 }} />
                <Text style={[styles.buttonText,{fontWeight:isEditingBio?'bold':undefined}]}>Edit Bio</Text>
              </View>
            </TouchableOpacity>

            {showBioInput && (
              <TextInput
                style={styles.bioInput}
                multiline={true}
                value={newBio}
                onChangeText={setNewBio}
                onBlur={handleSaveBio} // Save on clicking outside
                autoFocus={true}
                returnKeyType="done"
              />
            )}
          </Animated.View>
          <View>
            <Animated.View style={[styles.button,{height:colourHeight}]}>
          <TouchableOpacity  onPress={handleeditcolor}>
            <View style={styles.buttonContent}>
            <Image source={require('../assets/images/color-palette.png')} style={{ width: 24, height: 24, marginRight: 10 }} />
            <Text style={[styles.buttonText,{fontWeight:changingcolor?'bold':undefined}]}>Your Colour</Text>
            </View>
          </TouchableOpacity>
          <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.colorPalette}
>
  {colors.map((color, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.colorCircle,
        { backgroundColor: color || 'transparent' }, // "null" as transparent
        selectedColor === color ? styles.selectedColor : null // Highlight selected color
      ]}
      onPress={() => {setSelectedColor(color); handlesavecolor(color);}} // Handle color selection
    />
  ))}

</ScrollView>
          </Animated.View>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={()=>{setemergencydiag(true)}}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Emergency Evacuation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
          </TouchableOpacity>
          <EmergencyEvac visible={emergencydiag} onConfirm={onConfirm} onCancel={()=>{setemergencydiag(false)}}/>
          </View>
          {user && <UserProfileDialog open={showCard} onClose={handleCloseCard} user={user} />}
        </View>
        <View style={[{flexDirection:'row', position:!isEditingBio && !isEditingUsername?'absolute':'relative', bottom:0}]}>
            <Text style={[{color:'#7D7D7D', marginTop:13, marginRight:-7}]}>enjoy with</Text>
        <Image
          source={require('../assets/images/EloKoMainLogo.png')} // Update with the correct path
          style={[{width:140, height:50}]}
        />
        </View>
      </View>
      
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#f6f6f6',
    borderRadius: 50,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginLeft: 40,
  },
  username: {
    //color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  usernameInput: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: 200,
  },
  usernameEditIcon: {
    marginLeft: 10,
    //backgroundColor: '#f6f6f6',
    color:"#f6f6f6"
  },
  buttonContainer: {
    width: '95%',
  },
  button: {
    backgroundColor: '#454545',
    borderRadius: 30,
    padding: 18,
    marginBottom: 15,
    //justifyContent: 'center',
    overflow: 'hidden',
    //flexDirection:'row'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    padding:1
    //fontWeight: 'bold',
  },
  bioInput: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#333',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    
  },
  colorPalette: {
    paddingVertical: 10, // Add some vertical space
    paddingHorizontal: 5, // Add horizontal space for swiping
  },
  colorCircle: {
    width: 40, // Size of the color circles
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5, // Space between circles
    borderWidth: 2, // Border to highlight selection
    borderColor: 'transparent', // Default border color is transparent
  },
  selectedColor: {
    borderColor: '#fff', // White border for selected color
    borderWidth: 3,
  },
  deleteButton: {
    borderWidth:2,
    borderColor:'#e53935'
    //backgroundColor: '#e53935',
    //marginTop:280
  },
  deleteButtonText: {
    color: '#e53935',
    fontWeight:'bold'
  },
});

export default Account;
