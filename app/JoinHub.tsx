import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from 'expo-router';
import { themeSettings } from '../constants/Colors';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { Hub, HubsProps } from '@/types';

const colors = themeSettings('dark');
interface JoinHub {
    hubs:Hub[];
    setHubs:(x:Hub[])=>void;
  }
const JoinHub: React.FC = () => {
    const route=useRoute();
    const {hubs,setHubs}=route.params as JoinHub;
  const [code, setcode] = useState('');
  const [sending, setsending] = useState(false);
  const navigation = useNavigation();
  
  const imageAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    // Animate image up and text/button up
    Animated.parallel([
      Animated.timing(imageAnim, {
        toValue: -100, // slide up the image
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: -150, // slide up text input and button
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    // Reverse animation, bring everything back down
    Animated.parallel([
      Animated.timing(imageAnim, {
        toValue: 0, // slide down the image
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 0, // slide down text input and button
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidHide', ()=>{handleBlur(); Keyboard.dismiss();});
  
    return () => {
      keyboardListener.remove(); // Clean up the listener on unmount
    };
  }, []);
  const {_id}=useSelector((state:any)=>state.auth.user);
  const joinhub=async()=>{
    setsending(true);
    const data={code:code};
    try {
        const response=await fetch(`https://surf-jtn5.onrender.com/invite/${_id}/add`,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const returnedfromback=await response.json();
        setHubs([...hubs, returnedfromback.hubData as Hub])
        navigation.goBack();
        setsending(false);
    } catch (error) {
        
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={[{ flexDirection: 'row' }]}>
          <TouchableOpacity style={[{ marginTop: 25, marginRight: 10 }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#635acc" />
          </TouchableOpacity>
          <Text style={styles.header}>Join Hub</Text>
        </View>

        <Animated.View style={[styles.section, { transform: [{ translateY: imageAnim }] }]}>
          <Image
            source={require('../assets/images/hub.png')}
            style={[{ width: 450, height: 450 }]}
          />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: inputAnim }] }}>
          <TextInput
            style={styles.input}
            placeholder="Invite code..."
            value={code}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={'#616161'}
            onChangeText={setcode}
          />

          <Text style={styles.sectionHeader}>Enter Invite Code and Start Your Journey</Text>

          <TouchableOpacity style={styles.sendButton} onPress={()=>{if(code) joinhub()}}>
            {!sending ? (
              <Text style={[{ color: 'white' }]}>Join Hub</Text>
            ) : (
              <AnimatedCircularProgress
                size={40}
                width={4}
                fill={75}
                tintColor="white"
                backgroundColor="#4D4599"
                rotation={0}
                lineCap="round"
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.background.default,
    paddingTop: 40,
    paddingHorizontal: 15,
   
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#635acc',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
    
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#635acc',
  },
  input: {
    borderWidth: 2,
    borderColor: '#635acc',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    color: 'white',
    width: 360,
  },
  sendButton: {
    backgroundColor: '#635acc',
    borderRadius: 8,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -80,
  },
});

export default JoinHub;
