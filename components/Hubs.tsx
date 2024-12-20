import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, FlatList,Image, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; 
import { Avatar, Menu, TextInput } from 'react-native-paper';
import HexagonImage from './HexagonImage';
import { io } from 'socket.io-client';
import { Hub, HubsProps } from '../types'; // Import the types
import { themeSettings } from '../constants/Colors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FontAwesome } from '@expo/vector-icons';
import CreateHubDialog from '@/dialogs/CreateHubDialog';
const colors = themeSettings("dark");
const socket = io('https://surf-jtn5.onrender.com');
type NavigationType = NavigationProp<RootStackParamList>;
type HubsNavigationProp = {
  navigate: (screen: string, params?: any) => void;
};
type JoinNavigationProp = {
  navigate: (screen: string, params?: any) => void;
};
const Hubs: React.FC<HubsProps> = ({ userId,setmainhubs }) => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<any>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null); // To track the active card
  const token = useSelector((state: any) => state.auth.token);
  const navigation = useNavigation<NavigationType>();
  const navigationhub = useNavigation<HubsNavigationProp>();
  const navigationjoin=useNavigation<JoinNavigationProp>();
  const bounceAnim = useRef(new Animated.Value(1)).current; // Animated value for scaling
  const [hubsloading, sethubloading]=useState(false);
  const [startdialog,setstartdialog]=useState(false);

  const handlestarthub=()=>{
    setstartdialog(true);
    toggleMenu();
  }
  useFocusEffect(
    useCallback(() => {
      const fetchHubs = async () => {
        sethubloading(true);
        try {
          const response = await fetch(`https://surf-jtn5.onrender.com/hub`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          sethubloading(false);
          setHubs(data);
          //console.log(hubs);
        } catch (error) {
          console.error('Error fetching hubs:', error);
        }
      };

      fetchHubs();

      // Set up socket listener for hub deletion
      const handleDeleteHub = (hubid: string) => {
        setHubs((prevHubs) => prevHubs.filter((hub) => hub._id !== hubid));
      };

      socket.on('deleteHub', handleDeleteHub);

      // Clean up the socket listener when the component is unmounted or the screen is blurred
      return () => {
        socket.off('deleteHub', handleDeleteHub);
      };
    }, [userId, navigationhub]) // Add dependencies as needed
  );

  const handleMenuOpen = (event: any, hub: Hub) => {
    setMenuAnchor(event.currentTarget);
    setSelectedHub(hub);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedHub(null);
  };

  const handleLeaveHub = async () => {
    if (!selectedHub) return;
    const membershipData = { userid: userId };

    try {
      await fetch(`https://surf-jtn5.onrender.com/hub/${selectedHub._id}/member`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membershipData),
      });
      setHubs(hubs.filter((hub) => hub?._id !== selectedHub._id));
      handleMenuClose();
    } catch (error) {
      //(error);
    }
  };

  const handleDeleteHub = async () => {
    if (!selectedHub) return;

    try {
      await fetch(`https://surf-jtn5.onrender.com/hub/${selectedHub._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHubs(hubs.filter((hub) => hub?._id !== selectedHub._id));
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting hub:', error);
    }
  };

  const handlePressIn = (hub:Hub) => {
    setActiveCard(hub._id);
    Animated.spring(bounceAnim, {
      toValue: 1.05, // Slight bounce effect
      useNativeDriver: true,
    }).start();
    // const hubId=hub._id;
    // const ownerId=hub.owner_id;
    // const {name,description, avatar_url,banner_url,demonym}=hub;
    // const data={name,description,avatar_url,banner_url,demonym,hubId,ownerId};
    // ////(name);
    // navigationhub.navigate("HubHome",data);
  };

  const handlePressOut = () => {
    Animated.spring(bounceAnim, {
      toValue: 1, // Reset to normal size
      useNativeDriver: true,
    }).start(() => setActiveCard(null));
  };
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu
  const scaleAnim = useState(new Animated.Value(0))[0]; // Initialize animation value for scale

  const toggleMenu = () => {
    if (menuOpen) {
      // Close menu animation
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      // Open menu animation
      setMenuOpen(true); // Ensure menu is rendered before animating
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={[styles.container,hubsloading && {justifyContent:'center', alignItems:'center'}]}>
      {hubsloading && (<AnimatedCircularProgress
          size={80}
          width={6}
          fill={75}
          tintColor="#635acc"
         // onAnimationComplete={() => //('')}
          backgroundColor="#454545"
          rotation={0}
          lineCap="round" />)}
      {hubs.length > 0 && !hubsloading? (
        <FlatList
          data={hubs}
          renderItem={({ item }) => (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [{ scale: activeCard === item._id ? bounceAnim : 1 }],
                  borderColor: activeCard === item._id ? colors.colors.primary.main : 'transparent',
                  borderWidth: activeCard === item._id ? 2 : 0,
                },
              ]}
            >
              <TouchableOpacity
                onPressIn={() => handlePressIn(item)}
                onPressOut={handlePressOut}
                onPress={() => {
                  const { name, description, avatar_url, banner_url, demonym } = item;
                  const hubId=item._id;
                  
                  const ownerId=item.owner_id;
                  const data={name,description,avatar_url,banner_url,demonym,hubId,ownerId, setHubs};
                  navigationhub.navigate("HubHome",data);
                  //  navigation.navigate('HubHome', {
                  //   name,
                  //   description,
                  //   avatar_url,
                  //   banner_url,
                  //   demonym,
                  //   hubId: item._id,
                  // });
                }}
              >
                <View style={styles.cardContent}>
                   <HexagonImage uri={item.avatar_url}/>
                  {/* <Avatar.Image
                    size={50}
                    source={{ uri: item.avatar_url || 'default-avatar-url' }}
                    style={styles.avatar}
                  /> */}
                  <Text style={styles.hubName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={(e) => handleMenuOpen(e, item)}>
                <Text style={styles.menuButton}>...</Text>
              </TouchableOpacity>
              <Menu
                anchor={menuAnchor}
                visible={Boolean(menuAnchor)}
                onDismiss={handleMenuClose}
              >
                {item.owner_id === userId ? (
                  <Menu.Item onPress={handleDeleteHub} title="Delete Hub" />
                ) : (
                  <Menu.Item onPress={handleLeaveHub} title="Leave Hub" />
                )}
              </Menu> */}
            </Animated.View>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : hubs.length===0 && !hubsloading && (
        
        <ImageBackground source={require('../assets/images/hub.png')}
         style={[{ justifyContent:'center',alignContent:'center'}]}
          resizeMode="contain"
         >
         
          <TextInput
            style={[styles.hubcode]}
            placeholder="Enter Hub Code"
            placeholderTextColor="#aaa" 
            autoFocus={false}
          />
          <View style={[{paddingHorizontal:120}]}>
          <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}>Join Hub</Text>
          </TouchableOpacity>
          </View>
          <Text style={[{ fontSize:40, color:'white', marginTop:300, fontWeight:500}]}>Join Hub using code or Build your own Hub</Text>
          </ImageBackground>
          
      )}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={toggleMenu} // Toggle menu on press
        >
          <FontAwesome
            name={menuOpen ? "times" : "plus"} // Change icon based on menu state
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* Sexy Menu */}
        {menuOpen && (
          <Animated.View
            style={[
              styles.menu,
              {
                transform: [{ scaleY: scaleAnim }], // Animate scale from 0 to 1
                opacity: scaleAnim, // Animate opacity for smooth transition
              },
            ]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handlestarthub}>
            <Image source={require('../assets/images/rocket.png')}
         style={[{  width:30, height:30, marginRight:5}]}
          resizeMode="contain"/>
              <Text style={styles.menuText}>Start a New Hub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={()=>{toggleMenu();navigationjoin.navigate('JoinHub',{hubs,setHubs})}}>
            <Image source={require('../assets/images/join.png')}
         style={[{  width:30, height:30, marginRight:5}]}
          resizeMode="contain"/>
              <Text style={styles.menuText}>Join a Hub</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <CreateHubDialog open={startdialog} onClose={()=>setstartdialog(false)} userId={userId}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    borderRadius: 10,
    backgroundColor: colors.colors.background.default,
    marginVertical: 8,
    elevation: 7,
    padding: 16,
    //position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  avatar: {
    marginRight: 16,
  },
  hubName: {
    fontSize: 18,
    color: '#f6f6f6',
    fontWeight: 'bold',
   
  },
  menuButton: {
    fontSize: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  hubcode:{
    height: 50,
    borderColor: '#635acc', // Use your primary color
    //borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    
    opacity:0.8,
    color: "#f6f6f6",
    backgroundColor: '#1D1D1D', // Slightly darker background for better contrast
    
  },
  button: {
    backgroundColor: colors.colors.primary.main,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    //width:100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  buttonText: {
    color: colors.colors.background.default,
    fontSize: 18,
    fontWeight: '500',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#635acc',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // To add a slight shadow
  },
  // Menu styles
  menu: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    backgroundColor: '#635acc',
    borderRadius: 10,
    width:200,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomRightRadius:0
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection:'row',
    alignItems:'center'

  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white', // Accent color
  },
});

export default Hubs;
