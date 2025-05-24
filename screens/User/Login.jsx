import React, { useEffect, useState } from "react";
import {
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { userLogin } from "../../Controllers/userController";

export default function Login({ navigation }) {
  const [creating, setCreating] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const userData = {
    email: mobile,
    password: password,
  };

  const handleLogin = async () => {
    setCreating(true);
    if (mobile === "" || mobile.length < 10) {
      Toast.show("Mobile Or Email required", Toast.LONG, Toast.TOP);
      setCreating(false);
      return;
    } else if (password.length < 6) {
      Toast.show("Please enter a valid password", Toast.TOP);
      setCreating(false);
      return; 
    }
    try {
      const response = await userLogin(userData);
      await AsyncStorage.setItem("token", response?.data?.token);
      await AsyncStorage.setItem("email", response?.data?.email);
      Toast.show("Login Successful", Toast.TOP);
      setCreating(false);
      setTimeout(() => {
        navigation.navigate("MainApp");
      }, 800);
    } catch (error) {
      console.log(error)
      Toast.show(error?.response?.data?.message || "Internal Server Error!");
      setCreating(false);
    }
  };

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          navigation.replace("MainApp");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to verify authentication",
        });
      }
    };

    checkTokenAndRedirect();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/photos/bg1.jpg")}
      style={Customstyles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={[Customstyles.card, Customstyles.cardShadow]}>
            <Image
              style={Customstyles.logo}
              source={require("../../assets/photos/logo.png")}
            />
            {error && <Text style={Customstyles.error}>{error}</Text>}

            {/* Mobile Input */}
            <View style={Customstyles.inputContainer}>
              <Ionicons
                name="mail"
                size={24}
                color="#6B7280"
                style={Customstyles.icon}
              />
              <TextInput
                style={Customstyles.input}
                placeholder="Mobile or Email"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={Customstyles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={24}
                color="#6B7280"
                style={Customstyles.icon}
              />
              <TextInput
                style={Customstyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#6B7280"
                  style={Customstyles.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Forget Password Link */}
            <TouchableOpacity onPress={()=> navigation.navigate('ForgotPassword')}>
              <Text style={Customstyles.forgetPassword}>Forget password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                Customstyles.signInButton,
                creating && Customstyles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={creating}
            >
              <Text style={Customstyles.signInText}>
                {creating ? "SIGNING IN..." : "SIGN IN"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View style={Customstyles.signupContainer}>
            <Text style={Customstyles.signupText}>Don't have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={Customstyles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const Customstyles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.6,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  logo: {
    width: 140,
    height: 70,
    resizeMode: "contain",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    width: "100%",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  icon: {
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: "#374151",
  },
  forgetPassword: {
    color: "#2563EB",
    textAlign: "right",
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: "#EF4444",
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  signupText: {
    color: "#fff",
  },
  signupLink: {
    color: "#60A5FA",
  },
});
