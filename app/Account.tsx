import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Keyboard, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserProfileDialog from '@/dialogs/UserProfileDialog';
import { setlogin } from './store/authSlice';
import * as ImagePicker from 'expo-image-picker';
const Account = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const [showCard, setShowCard] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  //const [dataforavatar,setdata]=useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(user.bio || '');
  const [bioHeight] = useState(new Animated.Value(60)); // Initial button height
  const [showBioInput, setShowBioInput] = useState(false);
  const dispatch = useDispatch();
  
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

  const handleSaveBio = async() => {
    setIsEditingBio(false);
    setShowBioInput(false);
    Animated.timing(bioHeight, {
      toValue: 60, // Collapse back to initial height
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    //console.log('New bio:', newBio);
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

  const handleOutsideClick = () => {
    if (isEditingBio) {
      handleSaveBio();
    }
    if(isEditingUsername){
      handleSaveUsername();
    }
   
  };

  const handlesavePic=async(dataforavatar:string)=>{
    //setdata('');
    //console.log("hello");
    //console.log(dataforavatar);
    try {
        const data={username:newUsername, bio:newBio, filedata:dataforavatar};
        const response=await fetch(`https://surf-jtn5.onrender.com/users/${user._id}/avatar`,{
            method:"PATCH",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data)
        });
        //console.log(response);
        //setdata('');
        const savedUser=await response.json();
       console.log(savedUser);
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
           //console.log(dataforavatar);
           handlesavePic(data);
        }
      //console.log(result);
  
  };
 
  async function sendPushNotification(expoPushToken: string) {
    //console.log(expoPushToken);
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
    console.log(await response.json());
   } catch (error) {
    console.log(error);
   }
    
  }
  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.container}>
        <Text style={[{color:'white', marginBottom:40, fontSize:30, fontWeight:'bold', marginTop:-50}]}>Account Center</Text>
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
              <Text style={styles.username} onPress={handleEditUsername}>{newUsername}</Text>
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
            <Text style={[styles.buttonText,{fontWeight:showCard?'bold':undefined}]}>View EloKo Identity</Text>
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
          <TouchableOpacity style={[styles.button,styles.buttonContent]} >
            <Image source={require('../assets/images/color-palette.png')} style={{ width: 24, height: 24, marginRight: 10 }} />
            <Text style={[styles.buttonText,{fontWeight:showCard?'bold':undefined}]}>Your Colour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]}>
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
          </TouchableOpacity>
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
    color: '#fff',
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
  deleteButton: {
    backgroundColor: '#e53935',
    //marginTop:280
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default Account;
