import { Stack } from "expo-router";
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Platform, Linking, ActivityIndicator } from "react-native";
import Constants from 'expo-constants';
import { usePushNotifications } from "@/usePushNotifications";
import messaging from '@react-native-firebase/messaging';
const NAVIGATION_IDS = ['home'];

function buildDeepLinkFromNotificationData(data:any) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === 'home') {
    return 'myapp://home';
  }
  if (navigationId === 'settings') {
    return 'myapp://settings';
  }
  const postId = data?.postId;
  if (typeof postId === 'string') {
    return `myapp://post/${postId}`
  }
  console.warn('Missing postId')
  return null
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: 'home',
      Post: 'post/:id',
      Settings: 'settings'
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url)
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
}

export default function RootLayout() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const { expoPushToken, notification } = usePushNotifications();
  // useEffect(()=>{
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //   });
  // },[])
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
      <Stack.Screen name="index"  options={{ headerShown: false }} />
      <Stack.Screen name="home"  options={{ headerShown: false }} />
      <Stack.Screen name="HubHome"  options={{ headerShown: false }} />
      <Stack.Screen name="Library"  options={{ headerShown: false }} />
      <Stack.Screen name="Account"  options={{ headerShown: false }} />
      <Stack.Screen name="MiniZone"  options={{ headerShown: false }} />
      <Stack.Screen name="HubSetting"  options={{ headerShown: false }} />
      <Stack.Screen name="Requests"  options={{ headerShown: false }} />
    </Stack>
    </GestureHandlerRootView>
    </PersistGate>
    </Provider>
  );
}

