import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from '../../styles/Styles';

export default function Register({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/photos/bg1.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.authTitle}>Create Account</Text>

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            keyboardType="default"
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />
          <Ionicons name="eye" size={24} color="#6B7280" style={styles.icon} />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
          />
          <Ionicons name="eye" size={24} color="#6B7280" style={styles.icon} />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.signInText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
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