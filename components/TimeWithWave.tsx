import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const TimerWithWave: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const waveAnimation = new Animated.Value(0);

  // Start the timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Format time to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Infinite wave animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnimation]);

  // Interpolating wave animation
  const waveScale = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Timer display */}
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>

      {/* Animated wave */}
      <Animated.View
        style={[
          styles.wave,
          {
            transform: [{ scaleY: waveScale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382F66',
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 10,
    fontSize: 16,
    color: 'white',
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timerText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    //marginBottom: 20,
  },
  wave: {
    width: '100%',
    height: 10,
    borderRadius: 25,
    backgroundColor: '#635acc',
    opacity: 0.7,
  },
});

export default TimerWithWave;
