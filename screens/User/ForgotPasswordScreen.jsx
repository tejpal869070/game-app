// ForgotPasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  resetPassword,
  SendOtp,
  verifyOtp,
} from "../../Controllers/userController";
import Toast from "react-native-simple-toast";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const navigation = useNavigation();

  // Simulate resend OTP timer
  React.useEffect(() => {
    let interval;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const formData = {
    email: email,
    otp: otp,
    password: newPassword,
  };

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      Toast.show("Invalid email");
      return;
    }
    try {
      await SendOtp(formData);
      setStep("otp");
      setResendTimer(30);
    } catch (error) {
      console.log(error);
      Toast.show("Please Try Again");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      Toast.show("Invalid OTP");
      return;
    }
    try {
      await verifyOtp(formData);
      setStep("reset");
    } catch (error) {
      Toast.show(error.response.data.message || "Please Try Again");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6 || newPassword !== confirmPassword) {
      Toast.show("Passwords must match and be at least 6 characters.");
      return;
    }
    try {
      await resetPassword(formData);
      Toast.show("Password Reset Successful");
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        setEmail("");
        setOtp("");
        navigation.navigate("Starting");
      }, 1000);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message || "Please Try Again");
    }
  };

  const resendOtp = async () => {
    await SendOtp(formData);
    setResendTimer(30);
    Toast.show("OTP Resent", "A new OTP has been sent.");
  };

  return (
    <ImageBackground
      source={require("../../assets/photos/bg1.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.card}>
          <Text style={styles.header}>Forgot Password</Text>

          {step === "email" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Button title="Send OTP" onPress={handleSendOtp} />
            </>
          )}

          {step === "otp" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <Button title="Verify OTP" onPress={handleVerifyOtp} />
              <TouchableOpacity onPress={resendOtp} disabled={resendTimer > 0}>
                <Text style={styles.resend}>
                  Resend OTP {resendTimer > 0 ? `in ${resendTimer}s` : ""}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === "reset" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Button title="Reset Password" onPress={handleResetPassword} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  resend: {
    textAlign: "center",
    color: "#007BFF",
    marginTop: 10,
  },
});
