import { Stack } from "expo-router";
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
      <Stack.Screen name="index"  options={{ headerShown: false }} />
      <Stack.Screen name="home"  options={{ headerShown: false }} />
      <Stack.Screen name="HubHome"  options={{ headerShown: false }} />
      <Stack.Screen name="Library"  options={{ headerShown: false }} />
    </Stack>
    </GestureHandlerRootView>
    </PersistGate>
    </Provider>
  );
}

