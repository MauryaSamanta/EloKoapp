import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, Button } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

// Define the interface for the props
interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void; // Callback when the drawer is closed
}

const MessageDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose }) => {
  const translateY = useSharedValue(screenHeight); // Initially hidden (off-screen)

  // Open or close the drawer based on the `isOpen` prop
  useEffect(() => {
    translateY.value = withSpring(isOpen ? 0 : screenHeight, {
      damping: 20,
      stiffness: 200,
    });
  }, [isOpen]);

  // Gesture handler for dragging the drawer
  const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateY.value = Math.max(0, event.translationY);
    console.log("Dragging:", event.translationY); // Add logging here
  })
  .onEnd(() => {
    console.log("Ended drag at:", translateY.value); // Log where the drag ended
    if (translateY.value > screenHeight * 0.15) {
      translateY.value = withSpring(screenHeight, {}, (finished) => {
        if (finished) runOnJS(onClose)();
      });
    } else {
      translateY.value = withSpring(0);
    }
  });


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, animatedStyle]}>
          {/* Drawer content */}
          <View style={styles.content}>
            <Text style={styles.title}>Random Content</Text>
            <Text style={styles.paragraph}>
              Here's some random content inside the drawer. You can add more meaningful content later.
            </Text>
            <Button title="Close Drawer" onPress={onClose} />
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: screenHeight * 0.5, // 50% of screen height
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, // Rounded top-left corner
    borderTopRightRadius: 20, // Rounded top-right corner
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MessageDrawer;
