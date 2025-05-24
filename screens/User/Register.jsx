import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/Styles";
import { useState } from "react";
import Toast from "react-native-simple-toast";
import { CheckUserExistance, SendOtp, userRegistration } from "../../Controllers/userController";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // console.log(otp);

  const formData = {
    name,
    email,
    mobile,
    password,
  };

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword || !mobile) {
      Toast.show("All details are required");
      setLoading(false);
      return;
    } else if (mobile.length !== 10) {
      Toast.show("Invalid Mobile Number");
      setLoading(false);
      return;
    } else if (password.length < 6) {
      Toast.show("Password must be at least 6 characters long");
      setLoading(false);
      return;
    } else if (password !== confirmPassword) {
      Toast.show("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await CheckUserExistance(formData);
      const otpResponse = await SendOtp(formData);
      setOtp(otpResponse?.otp);
      setOtpSent(true);
      Toast.show("OTP sent to your Email");
    } catch (error) {
      Toast.show(error?.response?.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
  if (enteredOtp === otp.toString()) {
    try {
      await userRegistration(formData);
      Toast.show("Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      Toast.show(error?.response?.data?.message || "Registration failed");
    }
  } else {
    Toast.show("Invalid OTP. Please try again.");
  }
};

  const resendOtp = async () => {
    try {
      const otpResponse = await SendOtp(formData);
      setOtp(otpResponse?.otp);
    } catch (error) {
      Toast.show(error?.response?.data?.message || "Internal server error");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/photos/bg1.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.authTitle}>Create Account</Text>

        {/* OTP Input */}
        {otpSent ? (
          <View>
            <View style={styles.inputContainer}>
              <Ionicons
                name="keypad"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={enteredOtp}
                onChangeText={setEnteredOtp}
              />
            </View>
            <TouchableOpacity
              style={customStyle.verifyButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.signInText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => resendOtp()}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Resent OTP
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* {" "} */}
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
            </View>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            {/* Mobile */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={24}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>
        )}

        {/* Sign Up Button */}
        {!otpSent && (
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.signInText}>
              {loading ? "Sending OTP..." : "SIGN UP"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Already Have Account */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signupLink}>Login</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </ImageBackground>
  );
}

const customStyle = StyleSheet.create({
  verifyButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginTop: 10,
  },
});
