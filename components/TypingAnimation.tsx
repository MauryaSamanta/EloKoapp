import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const TypingAnimation = ({ userTyping, username }: { userTyping: string; username: string }) => {
  const typingDots = Array.from({ length: 3 }, (_, i) => new Animated.Value(0));

  React.useEffect(() => {
    const animations = typingDots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            delay: index * 200,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      )
    );

    Animated.stagger(200, animations).start();

    return () => typingDots.forEach(dot => dot.stopAnimation());
  }, [typingDots]);

  if (userTyping === username || userTyping === '') return null;

  return (
    <View style={styles.container}>
      <Text style={styles.typingText}>{userTyping} is typing</Text>
      <View style={styles.dotsContainer}>
        {typingDots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: dot,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:16,
    paddingBottom:16
  },
  typingText: {
    fontWeight: 'bold',
    color: '#635acc',
    marginRight: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#635acc',
    borderRadius: 4,
  },
});

export default TypingAnimation;
