import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For edit icons
import * as ImagePicker from 'expo-image-picker';


const Qube = () => {
  const route = useRoute();
  const {
    qube
    
  } = route.params;

  // Local state to handle editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingDemon, setIsEditingDemon] = useState(false);
//   const [tempHubName, setTempHubName] = useState(hubname);
//   const [tempDemon, setTempDemon] = useState(demon);
//   const [tempdesc,settempdesc]=useState(desc);
//   const [tempavatar,settempavatar]=useState(avatar);
//   const [tempbanner,settempbanner]=useState(banner);
  //7506807587
  // Function to close keyboard when clicked outside
  const dismissKeyboard = useCallback(() => {
    setIsEditingName(false);
    setIsEditingDescription(false);
    setIsEditingDemon(false);
    Keyboard.dismiss();
    
    //editdetails();
  }, []);

 
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      
      <View style={styles.container}>
      <View style={[{ 
   
    marginBottom:20, 
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 8, // Shadow blur radius
    elevation: 8, // Android shadow
  }]}>
    <Text style={[{textAlign:'center', color:'white', fontSize:30, marginTop:50, marginBottom:5, fontWeight:400}]}>
      Qube Settings
    </Text>
</View>
        {/* Avatar Section */}
       
        <View style={[{padding:20}]}>
        {/* Hub Name */}
        <View style={styles.infoSection}>
            <View>
          <Text style={styles.label}>Hub Name:</Text>

          </View>
          {isEditingName ? (
            <TextInput
              style={styles.input}
              value={qube.name}
              //onChangeText={setTempHubName}
              autoFocus={true}
            //   onSubmitEditing={() => {
            //     sethubname(tempHubName);
            //     setIsEditingName(false);
            //     editdetails();
            //   }}
            />
          ) : (
           
            <TouchableOpacity onPress={() => setIsEditingName(true)}>
              <Text style={styles.infoText}>{qube.name}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hub Description */}
        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Hub Description:</Text>
          {isEditingDescription ? (
            <>
            <TextInput
              style={styles.input}
              multiline={true}
              value={tempdesc} // Assuming hub description is the same as hub name for now
              onChangeText={settempdesc}
              onBlur={() => {
                settempdesc(tempdesc);
                setIsEditingDescription(false);
                editdetails();
              }}
              autoFocus={true}
              // onSubmitEditing={() => {
              //   settempdesc(tempdesc);
              //   setIsEditingDescription(false);
              //   editdetails();
              // }}
              returnKeyType='done'
            />
            <TouchableOpacity><Text>Save</Text></TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
              <Text style={styles.infoText}>{tempdesc}</Text>
            </TouchableOpacity>
          )}
        </View> */}

        {/* Demonym */}
        {/* <View style={styles.infoSection}>
          <Text style={styles.label}>Hub Demonym:</Text>
          {isEditingDemon ? (
            <TextInput
              style={styles.input}
              value={tempDemon}
              onChangeText={setTempDemon}
              onSubmitEditing={() => {
                setdemon(tempDemon);
                setIsEditingDemon(false);
                editdetails();
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingDemon(true)}>
              <Text style={styles.infoText}>{tempDemon}</Text>
            </TouchableOpacity>
          )}
        </View> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles for making the screen beautiful and smooth
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 20,
    //paddingTop:50,
    backgroundColor: '#1f1f1f',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#854be3',
    borderRadius: 15,
    padding: 5,
  },
  bannerSection: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  editIconBanner: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#854be3',
    borderRadius: 15,
    padding: 5,
  },
  infoSection: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: '#d1d1d1',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    color: 'white',
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    fontSize: 18,
    color: 'white',
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 8,
  },
});

export default Qube;
