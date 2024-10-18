import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '@/components/navbar';
import Hubs from '@/components/Hubs';
import InboxMobile from '@/components/InboxMobile';
import { themeSettings } from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Chat, Hub, HubsProps } from '../types';
import { setlogin } from './store/authSlice';
const colors = themeSettings("dark");
import { registerForPushNotificationsAsync } from '@/NotificationPermission';
import { Button } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
//const [mainhubs,setmainhubs]=useState<Hub[]>([]);
// "My Hubs" screen
function MyHubsScreen() {
  const { _id } = useSelector((state: any) => state.auth.user);
  const user=useSelector((state:any)=>state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const dispatch=useDispatch();
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

  useEffect(()=>{
   const tokenfornotifications=async()=>{ const pushtoken=await registerForPushNotificationsAsync();
    //(pushtoken);
    const data={pushtoken:pushtoken};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/users/${_id}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const val=await response.json();
      //(val);
      dispatch(setlogin({user:val,token:token}))

    } catch (error) {
      //(error);
    }}
    tokenfornotifications();
  },[])

  const [mainhubs,setmainhubs]=useState<Hub[]>([]);
  return (
    <SafeAreaView style={styles.container}>
      <Navbar hub={true}/>
      <View style={styles.content}>
        
        <Hubs userId={_id} setmainhubs={setmainhubs} />
      </View>
      
    </SafeAreaView>
  );
}

// "Inbox" screen (placeholder for now)
function InboxScreen() {
  const [mainchats,setmainchats]=useState<Chat[]>([]);
  return (
    <SafeAreaView style={styles.container}>
      <Navbar hub={false} setmainchats={setmainchats}/>
      <View style={styles.inbox}>
        {/* <Text style={styles.text}>Inbox coming soon!</Text> */}
        <InboxMobile setmainchats={setmainchats}/>
      </View>
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'My Hubs') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Inbox') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          // Animation for scaling the icon when active
          const scaleValue = focused ? 1.2 : 1;

          return (
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: scaleValue }] }
              ]}
            >
              <Icon
                name={iconName}
                size={size}
                color={focused ? 'black' : color}
              />
            </Animated.View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          // Animation for scaling the text when active
          const scaleValue = focused ? 1.1 : 1;

          return (
            <Animated.Text
              style={[
                {
                  color: focused ? 'black' : color,
                  fontWeight: focused ? 'bold' : 'normal',
                  transform: [{ scale: scaleValue }]
                }
              ]}
            >
              {route.name}
            </Animated.Text>
          );
        },
        tabBarActiveTintColor: 'black',  // Black for active tab
        tabBarInactiveTintColor: colors.colors.background.alt,
        tabBarStyle: {
          backgroundColor: colors.colors.primary.main,
          borderTopColor: colors.colors.primary.main,
          height: 60,
          //marginTop:100,
          paddingBottom: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          position: 'absolute',
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="My Hubs" component={MyHubsScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: colors.colors.background.alt,
  },
  content: {
    flex: 1,
    //sjustifyContent: 'center',
    //alignItems: 'center',
    marginBottom:70
  },
  inbox:{
    flex:1,
    marginBottom:70
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.colors.primary.main,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 10,
    width: 150, // Set a fixed width for the button
  },
  buttonBackground: {
    backgroundColor: colors.colors.primary.main,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.colors.primary.main,
  },
  buttonText: {
    color: '#f6f6f6',
    fontWeight: 'bold',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
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
    paddingHorizontal: 20,
    flexDirection:'row'
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white', // Accent color
  },
  menuTail: {
    position: 'absolute',
    top: -20, // Positioning the tail right above the button
    right: 20, // Adjust to align with the button
    width: 40,
    height: 40,
    backgroundColor: '#635acc',
    transform: [{ rotate: '45deg' }], // Creating the triangle effect
    borderRadius: 2,
  },
});
