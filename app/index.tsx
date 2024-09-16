import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Form from "../components/Form"; // Assuming Form has been converted to React Native
import {themeSettings} from "../constants/Colors";
import Svg, { Path } from "react-native-svg"; // For the wave

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const colors=themeSettings("dark");
console.log(colors);
const LoginPage = () => {
  const isNonMobileScreens = SCREEN_WIDTH >= 1000; // Mock for responsiveness in React Native
  const [pageType,setPageType]=useState("login");
  return (
    <View style={[styles.container, { backgroundColor: colors.colors.background.default }]}>
      {/* Content Container */}
      <View
        style={[
          styles.contentContainer,
          { flexDirection: isNonMobileScreens ? "row" : "column" },
        ]}
      >
        {/* Company Name */}
        <View style={[styles.logoContainer, { width: isNonMobileScreens ? "50%" : "100%" }]}>
          {/* Company Logo */}
          <Image
            source={require("../assets/images/EloKoMainLogo.png")} // Adjust image path accordingly
            style={isNonMobileScreens ? styles.largeLogo : styles.smallLogo}
          />
        </View>

        {/* Login Form */}
        <View style={[styles.formContainer, { width: isNonMobileScreens ? "40%" : "100%", height:pageType==="login"? 350:500 }]}>
          <Form setPageTypee={setPageType}/>
        </View>
     
      </View>

      {/* Bottom Left Wave */}
      <View style={styles.waveContainer}>
      <Svg viewBox="0 0 500 150" preserveAspectRatio="none" style={styles.svgWave}>
          <Path
            d="M0.00,49.98 C150.00,150.00 349.50,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            fill={colors.colors.primary.main} // Replace with your primary color
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Use theme if needed
    justifyContent: "center",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    flex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  largeLogo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
  smallLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: colors.colors.background.widgets, // Replace with your theme background if needed
    padding: 6,
    borderRadius: 24,
    //height: 500,
    elevation: 6, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1, // Ensure form is on top
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 150,
    zIndex: -1, // Send wave behind everything else
  },
  svgWave: {
    width: "100%",
    height: "100%",
  },
});


export default LoginPage;
