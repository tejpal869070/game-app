import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/Styles";

export default function Login({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/photos/bg1.jpg")}
      style={styles.container}
      resizeMode="cover"
    > 
      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.authTitle}>Hello! Sign in!</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Gmail"
            defaultValue="Joydee0@gmail.com"
            keyboardType="email-address"
          />
          <Ionicons
            name="checkmark"
            size={24}
            color="#6B7280"
            style={styles.icon}
          />
        </View>

        {/* Password Input */}
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
            secureTextEntry
          />
          <Ionicons name="eye" size={24} color="#6B7280" style={styles.icon} />
        </View>

        {/* Forget Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgetPassword}>Forget password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      {/* Signup Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}>Signup</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}




// Define styles directly within the component
const Customstyles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",  
  },
});
