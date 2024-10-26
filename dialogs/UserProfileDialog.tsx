import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Alert, Animated, Easing } from 'react-native';
import Svg, { ClipPath, Polygon, Rect, Defs, Image as SvgImage } from 'react-native-svg';
import { Member } from '@/types';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
//import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Share from 'react-native-share';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
//import { Share } from 'react-native';
//import Share from 'react-native-share';
interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: Member;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to format the date
const formatDate = (dateString: string): string => {
    // Ensure the dateString is a valid date
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Return a default message if the date is invalid
    }
    
    // Format the date with options
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

// HexagonImage Component
const HexagonImage: React.FC<{ uri?: string; style?: any }> = ({ uri, style }) => {
  
  return (
    <View style={[styles.hexagonContainer, style]}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="hexagonClip">
            <Polygon points="50,1 90,25 90,75 50,99 10,75 10,25" />
          </ClipPath>
        </Defs>

        {uri ? (
          <SvgImage
            href={{ uri }}
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#hexagonClip)"
          />
        ) : (
          <Rect
            width="100"
            height="100"
            fill="#ccc" // Fallback color
            clipPath="url(#hexagonClip)"
          />
        )}
      </Svg>
    </View>
  );
};

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;
  const {_id}=useSelector((state:any)=>state.auth.user);
  const modalRef = useRef(); // Reference for capturing the modal content
  const [loading,setloading]=useState(false);
  const [friendreq,setfriendreq]=useState(false);
  const [friend,setfriend]=useState(false);
  const [rendered,setrendered]=useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setrendered(true);
    }, 500 ); // 500 seconds in milliseconds

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []);
  const captureModal = async () => {
    setloading(true);
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
      const message = "Check out my EloKo Card! Open the app here: https://www.eloko.com/home";
      // Share the image

      // await Sharing.shareAsync(uri,{
      //   dialogTitle:message
      // });
      // await Share.share({
      //   title:'hello',
      //   url:uri,
      //   message:'greate photo'
      // })

      Share.open({message:message,url:uri}).then((res) => {
        //(res);
      })
      .catch((err) => {
        //(err);
      });
      setloading(false);
      
    } catch (error) {
      console.error('Failed to capture modal content:', error);
    }
  };

  const sendRequest=async()=>{
    setloading(true);
    const val={senderid:_id,recname:user.username};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/request/create`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(val)
      });
      const data=await response.json();
      if(data)
        {setloading(false);
          setfriendreq(true);
        }
      // if(data==='User doesnot exist')
      //   setexist(false);
      // else if(data==='Friend')
      //   setfriend(true);
      // else
      // setUsername('');
  } catch (error) {
      //(error);
  }
  }

  useEffect(()=>{
    const getfriendstat=async()=>
    { //('hello');
      const response=await fetch(`https://surf-jtn5.onrender.com/request/${_id}/${user._id}`,{
      method:'GET'
    });
    const status=await response.json();
  
    if(status==='friend')
      setfriend(true);
    else if(status==='sent')
      setfriendreq(true);
    else 
      setfriendreq(false);
}
   getfriendstat();
  },[open])
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Animation Effect: Flip when the modal becomes visible
  useEffect(() => {
    if (open) {
      Animated.timing(flipAnimation, {
        toValue: 1, // Flip to 180 degrees
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Reset the animation when modal is hidden
      Animated.timing(flipAnimation, {
        toValue: 0, // Flip back to 0 degrees
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [open, flipAnimation]);

  // Interpolating the flip animation to rotate on Y-axis
  const flipInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const flipStyle = {
    transform: [{ rotateY: flipInterpolate }],
  };
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
       <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay} >
        <Animated.View style={[styles.container, flipStyle,rendered && {shadowColor: '#FFD700',    // Glow color (gold)
    shadowOffset: { width: 0, height: 0 },  // Center the shadow evenly
    shadowOpacity: 1,          // Make it fully visible
    shadowRadius: 20, 
    elevation: 20,borderColor: 'gold', }]} ref={modalRef as any}>
            <View style={styles.EloKo}>
        <Text style={[styles.username,{color:"white"}]}>EloKo Card</Text>
         
          </View>
          <View style={styles.header}>
          
            <HexagonImage uri={user.avatar_url} style={styles.hexagonImage} />
            <Text style={[styles.username,{color:user.color || '#ffffff'}]}>{user.username}</Text>
          </View>

          {user.bio && (
            <View style={styles.bioContainer} >
              <Text style={styles.bioTitle}>About Me</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <FontAwesome6 name="calendar-day" size={24} color="gold" style={styles.infoicon} />
            <Text style={[styles.infoText,{fontWeight:'400'}]}>Member Since: {formatDate(user.created_at)}</Text>
          </View>

        </Animated.View>
        {user._id===_id ? (<TouchableOpacity style={[{flexDirection:'row',marginTop:10, borderColor:'white', borderWidth:1, padding:10
          , borderRadius:20, borderStyle:'dashed'
        }]} onPress={()=>{if(!loading)captureModal()}}>
          {!loading?(<>
          <Feather name="share" size={20} color="#635acc" style={[{marginRight:10}]} />
      <Text style={[{alignItems:'center', color:'#635acc', fontWeight:'bold',
          fontSize:15, 
        }]}>Share as image</Text>
        </>):
        (<AnimatedCircularProgress
          size={30}
          width={4}
          fill={75}
          tintColor="#635acc"
         // onAnimationComplete={() => //('')}
          backgroundColor="#4D4599"
          rotation={0}
          lineCap="round" />)}
        </TouchableOpacity>):(
          <TouchableOpacity style={[{flexDirection:'row',marginTop:10, borderColor:'white', borderWidth:1, padding:10
            , borderRadius:20, borderStyle:'dashed'
          }]} onPress={()=>{if(!loading && !friendreq && !friend)sendRequest()}}>
            {!loading && !friendreq && !friend?(<>
            
            <Ionicons name="person-add-sharp" size={20} color="#35fc03" style={[{marginRight:10}]} />
        <Text style={[{alignItems:'center', color:'#35fc03', fontWeight:'bold',
            fontSize:15, 
          }]}>Send Friend Request</Text>
          </>):
          loading && !friendreq?(<AnimatedCircularProgress
            size={30}
            width={4}
            fill={75}
            tintColor="#635acc"
            //onAnimationComplete={() => //('')}
            backgroundColor="#4D4599"
            rotation={0}
            lineCap="round" />):friendreq && (
              <>
            
            
            <AntDesign name="Safety" size={20} color="#635acc" style={[{marginRight:10}]} />
        <Text style={[{alignItems:'center', color:'#635acc', fontWeight:'bold',
            fontSize:15, 
          }]}>Friend Request Sent</Text>
          </>
            )}
          </TouchableOpacity>
        )}
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    width: SCREEN_WIDTH - 70,
    backgroundColor: '#635acc',
    
    borderWidth: 3,
    borderRadius: 16,
    padding: 20,

    // Android elevation
    //elevation: 20,   // Works for Android, adds a shadow-like effect

    // iOS shadow (for glowing effect)
    // shadowColor: '#FFD700',    // Glow color (gold)
    // shadowOffset: { width: 0, height: 0 },  // Center the shadow evenly
    // shadowOpacity: 1,          // Make it fully visible
    // shadowRadius: 20,          // Increase to make the glow softer and wider

    // Adding a slight inner shadow to enhance the glow effect
    overflow: 'visible',        // Ensures shadow does not get clipped
  },
  closeButton: {
    alignSelf: 'flex-end',
    //marginBottom: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#ffffff',
  },
  EloKo:{
    alignItems: 'center',
    marginBottom: 30,
    justifyContent:'space-between'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hexagonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  hexagonImage: {
    width: 80,
    height: 80,
  
  },
  username: {
    fontSize: 20,
    //color: '#ffffff',
    fontWeight: 'bold',
    elevation:20,
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 4, // Shadow blur
  },
  bioContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioText: {
    color: '#ffffff',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:'center',
    justifyContent:'center'
  },
  infoicon:{
    marginRight:5
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign:'center'
  },
});

export default UserProfileDialog;
