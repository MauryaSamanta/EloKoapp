import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GetStarted = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    password: '',
  });

  const animation = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setStep((prev) => prev + 1);
      animation.setValue(0); // Reset animation
    });
  };

  const handleNext = () => {
    if (step < 4) {
      animate();
    } else {
      alert('Form Submitted: ' + JSON.stringify(formData));
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderStep = () => {
    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -500], // Animate left
    });

    return (
      <Animated.View style={[styles.stepContainer, { transform: [{ translateX }] }]}>
        {step === 0 && (
          <>
            <Image
              source={require('../assets/images/EloKoMainLogo.png')} // Placeholder image URL
              style={styles.image}
            />
            {/* <Image
              source={require('../assets/images/space-travel.png')} // Placeholder image URL
              style={[styles.image,{marginTop:-140}]}
            /> */}
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.label}>Enter your Email</Text>
            <TextInput
              style={styles.input}
              placeholder="A valid email address"
              placeholderTextColor="#aaaaaa"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
            <Text style={[{color:'#aaaaaa', textAlign:'center', textDecorationLine:'underline',
              textDecorationStyle:'dotted', letterSpacing:1
            }]}><Text>Our privacy policy</Text></Text>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.label}>Create a Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#aaaaaa"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
            />
            <Text style={[{color:'#aaaaaa', textAlign:'center', padding:10, 
            }]} numberOfLines={1} adjustsFontSizeToFit>You will be known by this name inside the world of <Text style={[{color:'#635acc'
              , fontWeight:'bold'
            }]}>EloKo</Text></Text>
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.datePickerContainer}>
              {/* <Picker
                selectedValue={formData.birthDay}
                style={styles.picker}
                onValueChange={(value) => handleChange('birthDay', value)}
              >
                <Picker.Item label="Day" value="" />
                {[...Array(31)].map((_, i) => (
                  <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
              <Picker
                selectedValue={formData.birthMonth}
                style={styles.picker}
                onValueChange={(value) => handleChange('birthMonth', value)}
              >
                <Picker.Item label="Month" value="" />
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                  <Picker.Item key={index} label={month} value={`${index + 1}`} />
                ))}
              </Picker>
              <Picker
                selectedValue={formData.birthYear}
                style={styles.picker}
                onValueChange={(value) => handleChange('birthYear', value)}
              >
                <Picker.Item label="Year" value="" />
                {[...Array(100)].map((_, i) => (
                  <Picker.Item key={i} label={`${2023 - i}`} value={`${2023 - i}`} />
                ))}
              </Picker> */}
            </View>
          </>
        )}
        {step === 4 && (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#aaaaaa"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
            />
            <Text style={[{color:'#aaaaaa', textAlign:'center', padding:10, 
            }]} numberOfLines={1} adjustsFontSizeToFit>You can change your password anytime</Text>
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStep()}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{step===0?'Get Started':step<4?'Next':'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D', // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Space for the button
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
    width: '90%', // Width of the label
    letterSpacing:2,
    fontWeight:'bold'
  },
  input: {
    width: '90%',
    backgroundColor: '#2A2A2A', // Darker input field
    borderWidth: 2,
    borderColor: '#635acc', // Border color
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    color: '#fff', // Text color
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '30%',
    backgroundColor: '#2A2A2A',
    color: '#fff',
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#635acc',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 20, // Fixed position at the bottom
    left: '5%', // Center the button
    right: '5%',
    alignItems: 'center',
    width: '90%',
    shadowColor: '#635acc', // Shadow color for iOS
    shadowOffset: {
      width: 9,
      height: 3,
    },
    shadowOpacity: 0.7, // Opacity of the shadow
    shadowRadius: 10, // Blur radius of the shadow
    elevation: 500, // Elevation for Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing:2
  },
});

export default GetStarted;
