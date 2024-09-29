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
import { Platform } from "react-native";
import Constants from 'expo-constants';

export default function RootLayout() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  
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

