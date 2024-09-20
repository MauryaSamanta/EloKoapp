import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';

interface Item {
  key: string;
  name: string;
}

const librarytest: React.FC = () => {
  const [data, setData] = useState<Item[]>([
    { name: '1', key: 'one' },
    { name: '2', key: 'two' },
    { name: '3', key: 'three' },
    { name: '4', key: 'four' },
    { name: '5', key: 'five' },
    { name: '6', key: 'six' },
    { name: '7', key: 'seven' },
    { name: '8', key: 'eight' },
    { name: '9', key: 'nine' },
    { name: '0', key: 'zero' },
  ]);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  // PanResponder to handle dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        const index = Math.floor(gestureState.y0 / 120); // Determine which item was touched
        setDraggingIndex(index);

        // Store the initial y offset (or x if needed)
        pan.setOffset({ x: 23, y:45}); // setOffset stores the current position
        pan.setValue({ x: 0, y: 0 }); // Reset pan value to avoid interfering with movements
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        const dropIndex = Math.floor(gestureState.moveY / 120); // Determine the drop position
        if (draggingIndex !== null && dropIndex >= 0 && dropIndex < data.length) {
          const updatedData = [...data];
          const draggedItem = updatedData.splice(draggingIndex, 1)[0]; // Remove dragged item
          updatedData.splice(dropIndex, 0, draggedItem); // Reinsert item at new position
          setData(updatedData);
        }
        setDraggingIndex(null);
        pan.flattenOffset(); // Apply the pan offset and reset
      },
    })
  ).current;

  const renderItem = (item: Item, index: number) => {
    const isDragging = index === draggingIndex;

    return (
      <Animated.View
        key={item.key}
        style={[
          styles.item,
          isDragging && { transform: pan.getTranslateTransform() },
        ]}
        {...(isDragging ? panResponder.panHandlers : {})} // Attach pan handlers only to the dragging item
      >
        <Text style={styles.item_text}>{item.name}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.wrapper}>
      {data.map((item, index) => renderItem(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  item: {
    width: '90%',
    height: 100,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  item_text: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});

export default librarytest;
