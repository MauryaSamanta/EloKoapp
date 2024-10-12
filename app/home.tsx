import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Animated } from 'react-native';
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
const Tab = createBottomTabNavigator();
//const [mainhubs,setmainhubs]=useState<Hub[]>([]);
// "My Hubs" screen
function MyHubsScreen() {
  const { _id } = useSelector((state: any) => state.auth.user);
  const user=useSelector((state:any)=>state.auth.user);
  const token=useSelector((state:any)=>state.auth.token);
  const dispatch=useDispatch();
  useEffect(()=>{
   const tokenfornotifications=async()=>{ const pushtoken=await registerForPushNotificationsAsync();
    console.log(pushtoken);
    const data={pushtoken:pushtoken};
    try {
      const response=await fetch(`https://surf-jtn5.onrender.com/users/${_id}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      const val=await response.json();
      console.log(val);
      dispatch(setlogin({user:val,token:token}))

    } catch (error) {
      console.log(error);
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
});
