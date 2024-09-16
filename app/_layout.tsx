import { Stack } from "expo-router";
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <Stack>
      <Stack.Screen name="index"  options={{ headerShown: false }} />
      <Stack.Screen name="home"  options={{ headerShown: false }} />
      <Stack.Screen name="HubHome"  options={{ headerShown: false }} />
      
    </Stack>
    </PersistGate>
    </Provider>
  );
}

