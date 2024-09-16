import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button } from 'react-native-elements';
import { setlogout } from '@/app/store/authSlice';
import { themeSettings } from '../constants/Colors';
import CreateHubDialog from '@/dialogs/CreateHubDialog';

const colors = themeSettings("dark");
interface NavbarProps {
  hub: boolean;
}
const Navbar = ({hub}: NavbarProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: any) => state.auth.user);
  const avatar = user?.avatar_url;
  const [dialog,setdialog]=useState(false);
  //console.log(avatar);
  const handleCreateHubClick = () => {
    // Handle create hub functionality
    setdialog(true);
  };

  const handleclose=()=>{
    setdialog(false);
  }

  const handleLogout = () => {
    dispatch(setlogout());
    // navigation.navigate('login'); // Navigate to login screen or wherever appropriate
  };

  

  return (
    <View style={styles.container}>
      <TouchableOpacity // onPress={() => navigation.navigate('home')}
        style={styles.logoContainer}
      >
        <Image
          source={require('../assets/images/EloKoMainLogo.png')} // Update with the correct path
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={styles.rightContainer}>
       {hub && ( <Button
          title="Start a New Hub"
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonText}
          buttonStyle={styles.buttonBackground}
          onPress={handleCreateHubClick}
        />)}
        <CreateHubDialog open={dialog} onClose={handleclose} userId={user._id}/>
        <TouchableOpacity //onPress={handleLogout} 
        style={styles.avatarContainer}>
          <Avatar
            source={{ uri: avatar }}
            rounded
            size="medium"
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.colors.background.alt,
    elevation: 5, // Adds shadow effect
    borderBottomWidth: 1,
    borderBottomColor: colors.colors.background.alt,
  },
  logoContainer: {
    flex: 1,
    //justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Ensure logo scales properly
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 10,
    width: 150, // Set a fixed width for the button
  },
  buttonBackground: {
    backgroundColor: colors.colors.primary.main,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.colors.primary.main,
  },
  buttonText: {
    color: '#f6f6f6',
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 50, // Set a fixed width
    height: 50, // Set a fixed height
    borderRadius: 25, // Make it a circle
    overflow: 'hidden', // Hide any overflow
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatar: {
    width: '100%', // Make it fill the container
    height: '100%', // Make it fill the container
  }
});

export default Navbar;
