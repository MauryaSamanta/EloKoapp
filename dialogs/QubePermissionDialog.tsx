import { Qube } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSelector } from 'react-redux';

interface QubePermissionDialogProps {
  visible: boolean; // Control the visibility of the dialog
  onClose: () => void; // Function to close the dialog
  onsendRequest: () => void; // Function to handle send request action
  qube:Qube
}

const QubePermissionDialog: React.FC<QubePermissionDialogProps> = ({
  visible,
  onClose,
onsendRequest,
qube
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const {_id}=useSelector((state:any)=>state.auth.user);
  const [sent,setsent]=useState(false);
  const [loading,setloading]=useState(false);
  // Function to start rotation animation
  const startImageRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000, // Rotation duration
        easing: Easing.linear, // Easing for smooth rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  // Start rotation animation when the component is mounted
  useEffect(() => {
    
  const checkstatusofrequest=async()=>{
    const data={qubeid:qube?._id, user_id:_id};
    setloading(true);
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/qubepermit/check`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const status=await response.json();
      if(status==='True')
        setsent(true);
      else
      setsent(false);
    setloading(false);
    } catch (error) {
      
    }
  }
    checkstatusofrequest();
    startImageRotation();
  }, []);

  // Interpolate rotateValue to get degrees for rotation
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
        
      <View style={styles.overlay}>
        <View style={styles.container}>
            <Animated.Image source={require('../assets/images/favorite.png')} style={[{width:50, height:50, marginBottom:10},
          { transform: [{ rotate }] }]}/>
          <Text style={styles.title}>This is an Exclusive Qube!</Text>
          <Text style={styles.description}>
            You need permission to join this Qube. 
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={()=>{if(!sent){onsendRequest();setsent(true); setTimeout(() => {
              onClose();
            }, 1000); }}}
          >
            {loading?(<AnimatedCircularProgress
          size={30}
          width={4}
          fill={75}
          tintColor="white"
          //onAnimationComplete={() => //('')}
          backgroundColor="#4D4599"
          rotation={0}
          lineCap="round" />): <Text style={styles.buttonText}>{!sent?"Send Join Request to Owner":"Join Request Sent"}</Text>}
           
          </TouchableOpacity>
         
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  container: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#292929', // Dark background
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700', // Golden color
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD700', // Golden-ish color
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#292929', // Dark color for button text
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: '#635acc', // Custom color
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default QubePermissionDialog;
