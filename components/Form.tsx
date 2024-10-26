import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types'; // Assuming you have types defined
import CircularProgress from 'react-native-circular-progress';
import { setlogin } from '../app/store/authSlice';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { themeSettings } from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
const colors = themeSettings("dark");
type NavigationType = NavigationProp<RootStackParamList>;
interface FormProps {
  //pageType: string;
  setPageTypee: React.Dispatch<React.SetStateAction<string>>;
}
const App:React.FC<FormProps> = ({setPageTypee}) => {
  const [pageType, setPageType] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [dob, setDob] = useState("");
  const [taken, setTaken] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [exist, setExist] = useState(true);
  const [loading,setloading]=useState(false);
  const navigation = useNavigation<NavigationType>(); // Use navigation with types
  const dispatch = useDispatch();
  const navigationsignup = useNavigation<any>(); // Use navigation with types
  const register = async () => {
    if (username === "" || pass === "" || email === "" || dob === "") return;

    const values = { username, email, dob, password: pass };
    const response = await fetch("https://surf-jtn5.onrender.com/auth/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const savedUser = await response.json();

    if (savedUser === "Present") {
      setExist(true);
    } else {

        setPageType("login");
        setPageTypee("login");
      setUsername("");
      setEmail("");
      setPass("");
      setDob("");
      
    }
  };

  const login = async () => {
    //navigation.navigate('home');
    if (email === "" || pass === "") return;
    setloading(true);
    const values = { email, password: pass };
    try{
    const response = await fetch("https://surf-jtn5.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await response.json();

    if (loggedIn === "Invalid") {
      setWrong(true);
      return;
    }
    if (loggedIn === "no exist") {
      setExist(false);
      return;
    }
    let loginval=loggedIn;
    if (loggedIn) {
        setloading(false);
        dispatch(setlogin({ user: loggedIn.user, token: loggedIn.token }));
       await AsyncStorage.setItem('token',loggedIn.token);
       navigation.reset({
        index: 0,
        routes: [{ name: 'home' }], // Resets the stack and navigates to the home screen
      });
      navigation.navigate('home')
    }
    setEmail("");
    setPass("");}
    catch(error){

    }
  };

  const handleFormSubmit = () => {
    if (pageType === "login") {
      login();
    } else if (pageType === "register") {
      register();
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {pageType === "register" ? "Create an Account" : "Welcome"}
      </Text>
      {pageType === "register" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa" 
            onChangeText={setUsername}
            value={username}
          />
          {taken && username ? (
            <Text style={styles.errorText}>{username} is taken ☹️</Text>
          ) : !taken && username ? (
            <Text style={styles.successText}>{username} is available 😀</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            placeholderTextColor="#aaa" 
            onChangeText={setDob}
            value={dob}
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa" 
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa" 
        secureTextEntry
        onChangeText={setPass}
        value={pass}
      />
      {wrong && <Text style={styles.errorText}>Wrong Credentials</Text>}
      {!exist && <Text style={styles.errorText}>You need to create an account</Text>}
      <View>
     
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{if(!loading) handleFormSubmit();}}
        disabled={pageType === "register" ? taken : false}
      >
        {!loading?(<Text style={styles.buttonText}>
          {pageType === "login" ? "LOGIN" : "REGISTER"}
        </Text>):(<AnimatedCircularProgress
          size={30}
          width={4}
          fill={75}
          tintColor="white"
          //onAnimationComplete={() => //('')}
          backgroundColor="#4D4599"
          rotation={0}
          lineCap="round" />)}
      </TouchableOpacity>
    
      </View>
      <TouchableOpacity
        onPress={() => {
          //setPageType(pageType === "login" ? "register" : "login");
          // if(pageType==="login")
          // {
          //   setPageType("register");
          //   setPageTypee("register");
          // }
          // else
          // { setPageType("login")
          //   setPageTypee("login");
          // }
          navigationsignup.navigate("GetStarted");
          setUsername("");
          setEmail("");
          setDob("");
          setPass("");
          setExist(true);
          setTaken(false);
        }}
      >
        <Text style={styles.switchText}>
          {pageType === "login"
            ? "Don't have an account? Sign Up here."
            : "Already have an account? Login here."}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: '#121212',
    justifyContent: 'center',
    textAlign:'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#635acc', // Use your primary color
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#f6f6f6",
    backgroundColor: '#1D1D1D', // Slightly darker background for better contrast
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  inputFocused: {
    borderColor: '#FF3E00', // Accent color for focus state
    shadowColor: '#FF3E00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5, // Slightly more pronounced shadow on focus
  },
  errorText: {
    color: '#e62e31',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  successText: {
    color: '#2ee659',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.colors.primary.main,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    
    //width:100,
    marginBottom: 20,
    elevation: 4,
  },
  buttonText: {
    color: colors.colors.background.default,
    fontSize: 18,
    fontWeight: '500',
  },
  switchText: {
    color: colors.colors.primary.main,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default App;
