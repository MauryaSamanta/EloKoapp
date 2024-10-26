import React, { useEffect, useRef, useState } from 'react';
import {  Portal, Text, Button, TextInput, Provider, IconButton } from 'react-native-paper';
import { View, StyleSheet, Linking, Modal, TouchableOpacity, Image, Animated, PanResponder } from 'react-native';
//import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Sharing from 'expo-sharing';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
const AddMemberDialog = ({ visible, onClose, code, hubname, hub_avatar,hub_desc }) => {
  const handleCopyToClipboard = async() => {
    await Clipboard.setStringAsync(code);
  };
  const modalRef = useRef();
  const [flipped, setFlipped] = useState(false);
  const [flippedstuff,setflippedstuff]=useState(false);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      //onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 3) {
          console.log('hello');
          flip(); // Call the flip function on right swipe
        }
      },
    })
  ).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(()=>
  {
    setFlipped(false);
  },[]);
  const flip = () => {
    setFlipped(!flipped);
    Animated.timing(rotateAnim, {
      toValue: 0.5,  // Halfway point of the animation
      duration: 150, // Half the total duration (half of 400ms)
      useNativeDriver: false, 
    }).start(() => {
      // Call setflippedstuff when halfway through the animation
      setflippedstuff(!flippedstuff);
  
      // Continue the second half of the animation
      Animated.timing(rotateAnim, {
        toValue: flipped ? 0 : 1,
        duration: 150, // Remaining half of the animation
        useNativeDriver: false,
      }).start();
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const captureModal = async () => {
    //setloading(true);
    try {
      // Capture the view and save as a JPEG
      const uri = await captureRef(modalRef, {
        format: 'jpg',
        quality: 1.0,
      });
  
      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return;
      }
      const message = code;
     
      Share.open({message:message,url:uri}).then((res) => {
        //(res);
      })
      .catch((err) => {
        console.log(err) //(err);
      });
      //setloading(false);
      
    } catch (error) {
      console.error('Failed to capture modal content:', error);
    }
  };

  return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={[styles.modalContainer,  {...panResponder.panHandlers} ]}>
                <Animated.View style={[styles.dialogContainer, { transform: [{ rotateY: rotateInterpolate }] }]} ref={modalRef}>
          {/* <Text style={styles.dialogTitle}>{hubname}</Text> */}
          {!flippedstuff?(<>
          <View style={[{alignItems:'center', padding:20, paddingTop:60}]}>
          <Image source={{ uri: hub_avatar }} style={[styles.avatar]}  />
          </View>
          <Text style={[{color:'black', textAlign:'center', marginBottom:20,
            fontSize:17,
            fontWeight:'bold',
            marginTop:0,

          }]} adjustsFontSizeToFit
          numberOfLines={1} // Keep the text on a single line
          minimumFontScale={0.5} >{hubname}</Text>
           <Text style={[{color:'#1D1D1D', textAlign:'center', marginBottom:20,
            fontSize:15,
            marginTop:-10

          }]} adjustsFontSizeToFit
          numberOfLines={1} // Keep the text on a single line
          minimumFontScale={0.5} >{hub_desc}</Text>
          </>):(
            <View style={[{backgroundColor:'#635acc', flex:1,borderRadius: 40, paddingTop:50, justifyContent:'center' }]}>
               <View style={[styles.stripContainer,{marginBottom:130, borderTopColor:'#FFB300', borderBottomColor:'#FFB300',borderWidth:1}]}>
               <FontAwesome6 name="crown" size={20} color="#FFB300" />
        <Text style={[styles.stripText, styles.fixText,{marginHorizontal:10}]} numberOfLines={1} ellipsizeMode='clip' adjustsFontSizeToFit>{hubname}</Text>
        <FontAwesome6 name="crown" size={20} color="#FFB300" />
      </View>
             <Text style={[styles.fixText,{color:'white', textAlign:'center', marginBottom:20,
            fontSize:35,
            fontWeight:'bold',
            marginTop:-30,
            paddingHorizontal:10
          }]} 
          //numberOfLines={2} // Keep the text on a single line
          minimumFontScale={0.5} >{code}</Text>
           <Text style={[styles.fixText,{color:'#B5B5B5', textAlign:'center', marginBottom:20,
            fontSize:17,
           

          }]} adjustsFontSizeToFit
          numberOfLines={1} // Keep the text on a single line
          minimumFontScale={0.5} >Join Our Hub Using this Code</Text>
           <View style={[styles.stripContainer,{marginTop:60}]}>
        <Text style={[styles.stripText, styles.fixText]} numberOfLines={1}  ellipsizeMode="clip">JOIN CODE JOIN CODE JOIN CODE JOIN CODE JOIN CODE JOIN CODE JOIN CODE</Text>
      </View>
            </View>
          )}
          
          </Animated.View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              //icon={() =>}
              onPress={handleCopyToClipboard}
              style={[styles.button,flipped && {backgroundColor:'#292929'}]}
            >
               <MaterialCommunityIcons name="content-copy" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              //icon={() => }
              onPress={flip}
              style={[styles.button,flipped && {backgroundColor:'#292929'}]}
            >
              {!flipped?(<Image source={require('../assets/images/password.png')} style={[{width:30,height:30}]}/>):(
                <Image source={require('../assets/images/info.png')} style={[{width:30,height:30}]}/>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              //icon={() => }
              onPress={captureModal}
              style={[styles.button,flipped && {backgroundColor:'#292929'}]}
            >
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
          </View>
          
        </Modal>
     
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    
      },
  dialogContainer: {
    margin: 20,
    backgroundColor: '#EDEDED',
    borderRadius: 40,
    //padding: 10,
    maxHeight:'80%',
    height:500,
    //backfaceVisibility: 'hidden'
  },
  dialogTitle: {
    fontSize: 20,
    //fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'white'
  },
  textInput: {
    marginBottom: 20,
    
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:40,
    marginBottom: 20,
  },
  button: {
    //flex: 1,
    backgroundColor:'#635acc',
    padding:20,
    borderRadius:50,
    alignItems:'center',
    marginHorizontal: 5,
    justifyContent:'center'
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  avatar:{
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ccc', // Fallback color if no avatar_url
    borderWidth: 3,
    borderColor: '#fff', // Border color to make it stand out
   // marginBottom: 10,
   
  },
  fixText: {
    transform: [{ rotateY: '180deg' }], // Fix the text so it doesn't flip
  },
  stripContainer: {
    backgroundColor: '#382F66',
    paddingVertical: 10,
    //transform: [{ rotate: '-5deg' }], 
    //width:354.5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
  },
  stripText: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 3,
    
  },
});

export default AddMemberDialog;
