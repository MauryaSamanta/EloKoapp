import React from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { ClipPath, Polygon, Rect, Defs, Image as SvgImage } from 'react-native-svg';
import { Member } from '@/types';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: Member;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to format the date
const formatDate = (dateString: string): string => {
    // Ensure the dateString is a valid date
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Return a default message if the date is invalid
    }
    
    // Format the date with options
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

// HexagonImage Component
const HexagonImage: React.FC<{ uri?: string; style?: any }> = ({ uri, style }) => {
  return (
    <View style={[styles.hexagonContainer, style]}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="hexagonClip">
            <Polygon points="50,1 90,25 90,75 50,99 10,75 10,25" />
          </ClipPath>
        </Defs>

        {uri ? (
          <SvgImage
            href={{ uri }}
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#hexagonClip)"
          />
        ) : (
          <Rect
            width="100"
            height="100"
            fill="#ccc" // Fallback color
            clipPath="url(#hexagonClip)"
          />
        )}
      </Svg>
    </View>
  );
};

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
            <View style={styles.EloKo}>
        <Text style={styles.username}>EloKo Identity</Text>
         
          </View>
          <View style={styles.header}>
          
            <HexagonImage uri={user.avatar_url} style={styles.hexagonImage} />
            <Text style={styles.username}>{user.username}</Text>
          </View>

          {user.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioTitle}>About Me</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <FontAwesome6 name="calendar-day" size={24} color="gold" style={styles.infoicon} />
            <Text style={styles.infoText}>Member Since: {formatDate(user.created_at)}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    width: SCREEN_WIDTH - 70,
    backgroundColor: '#635acc',
    borderColor: 'gold',
    borderWidth: 3,
    borderRadius: 16,
    padding: 20,

    // Android elevation
    elevation: 20,   // Works for Android, adds a shadow-like effect

    // iOS shadow (for glowing effect)
    shadowColor: '#FFD700',    // Glow color (gold)
    shadowOffset: { width: 0, height: 0 },  // Center the shadow evenly
    shadowOpacity: 1,          // Make it fully visible
    shadowRadius: 20,          // Increase to make the glow softer and wider

    // Adding a slight inner shadow to enhance the glow effect
    overflow: 'visible',        // Ensures shadow does not get clipped
  },
  closeButton: {
    alignSelf: 'flex-end',
    //marginBottom: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#ffffff',
  },
  EloKo:{
    alignItems: 'center',
    marginBottom: 30,
    justifyContent:'space-between'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hexagonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  hexagonImage: {
    width: 80,
    height: 80,
  },
  username: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bioContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioText: {
    color: '#ffffff',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:'center',
    justifyContent:'center'
  },
  infoicon:{
    marginRight:5
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign:'center'
  },
});

export default UserProfileDialog;
