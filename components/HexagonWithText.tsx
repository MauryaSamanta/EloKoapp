import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, StyleProp, ViewStyle, Image } from 'react-native';
import Svg, { ClipPath, Polygon, Rect, Defs } from 'react-native-svg';
import { useSelector } from 'react-redux';

interface Qube {
    _id: string;
    hub_id?: string;
    name?: string;
    nickname?: string;
    created_at?: Date;
    updated_at?: Date;
    access?: string; // Add access property
    members?: string[]; // Add members array property
}

interface Props {
    qube: Qube; // Qube prop to accept the qube object
    style?: StyleProp<ViewStyle>;
    onPress: () => void; // Click handler
    selectedQube?: Qube;
    setselectedQube: (value: Qube) => void;
}

const HexagonWithText: React.FC<Props> = ({ qube, style, onPress, selectedQube, setselectedQube }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current; // For scaling animation
    const rotateAnim = useRef(new Animated.Value(0)).current; // For rotation during the press
    const colorAnim = useRef(new Animated.Value(0)).current; // For color animation
    const { _id } = useSelector((state: any) => state.auth.user);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'], // Rotate the square by 90 degrees
    });

    const backgroundColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#292929', '#FFD700'], // From dark gray to yellow
    });

    // Condition to show the lock icon
    const showLockIcon = qube.access==='false' && !qube.members?.includes(_id);
    //console.log(showLockIcon);
    return (
        <TouchableOpacity
            onPress={() => onPress()}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    styles.container,
                    style,
                    {
                        transform: [{ scale: scaleAnim }],
                        borderRadius: selectedQube?._id === qube?._id ? 20 : 0, // Rounded corners when square
                        backgroundColor: selectedQube?._id === qube?._id ? '#F5A623' : undefined, // Animated background color
                        shadowColor: selectedQube?._id === qube?._id ? '#000' : undefined,
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: selectedQube?._id === qube?._id ? 10 : undefined, // For Android shadow
                    },
                ]}
            >
                <Svg height="70" width="70" viewBox="0 0 100 100">
                    <Defs>
                        <ClipPath id="hexagonClip">
                            <Polygon points="50,1 90,25 90,75 50,99 10,75 10,25" />
                        </ClipPath>
                    </Defs>
                    {/* Hexagon/Square with background color */}
                    <Rect
                        width="100"
                        height="100"
                        rx={selectedQube?._id === qube?._id ? 15 : 0} // Rounded corners when square
                        ry={selectedQube?._id === qube?._id ? 15 : 0}
                        fill={selectedQube?._id === qube?._id ? '#F5A623' : '#292929'} // Background color
                        clipPath={selectedQube?._id === qube?._id ? undefined : 'url(#hexagonClip)'} // Clip to hexagon if not a square
                    />
                </Svg>
                
                {/* Display qube.nickname */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{qube.nickname ? qube.nickname : qube.name}</Text>
                </View>
                {/* Lock icon */}
                {showLockIcon && (
                    <Image
                        source={require('../assets/images/3d-lock.png')} // Adjust the path to your lock icon image
                        style={styles.lockIcon}
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        position: 'relative', // For absolute positioning of text inside the hexagon
    },
    textContainer: {
        position: 'absolute',
        top: '35%', // Center the text within the hexagon
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    lockIcon: {
        position: 'absolute',
        top: 5, // Position at the top
        right: 5, // Position at the right
        width: 20, // Adjust size as needed
        height: 20, // Adjust size as needed
    },
});

export default HexagonWithText;
