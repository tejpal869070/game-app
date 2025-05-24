import { StatusBar } from "expo-status-bar";
import { Text, View, ImageBackground, Image, StyleSheet } from "react-native";
import { styles } from "../styles/Styles";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { CheckToken } from "../Controllers/userController";

export default function StartingPage({ navigation }) {
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        await CheckToken();
        navigation.replace("MainApp");
      } catch (error) {
        console.error("Error checking token:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to verify authentication",
        });
        await AsyncStorage.removeItem("token"); // Clear token on error
        await AsyncStorage.removeItem("email");
        navigation.replace("Login");
      }
    };

    const timer = setTimeout(() => {
      checkTokenAndRedirect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/photos/bg1.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("../assets/photos/logo.png")}
          style={Customstyles.logo}
        />
        <Text style={styles.title}>Welcome to Sneak Booker!</Text>
        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

// Define styles directly within the component
const Customstyles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain", // ensures logo doesn't stretch
    marginBottom: 20,
  },
});
