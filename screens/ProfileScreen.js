import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreatePin from "../Controllers/CreatePin";

const ProfileScreen = ({ navigation }) => {
  const [isSetPinOpen, setSetPinOpen] = useState(false);
  // logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("email");

      navigation.replace("Starting");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/photos/boy.png")} // Placeholder for profile picture
          style={styles.profileImage}
        />
        <Text style={styles.username}>Tarun Soni</Text>
        <Text style={styles.email}>tsoni9742@gmail.com</Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade to PRO</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Privacy")}
          style={styles.menuItem}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSetPinOpen(true)}
          style={styles.menuItem}
        >
          <Ionicons name="shield" size={24} color="#fff" />
          <Text style={styles.menuText}>Create PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <CreatePin visible={isSetPinOpen} onClose={() => setSetPinOpen(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "white",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: "#888",
    fontSize: 16,
    marginVertical: 5,
  },
  upgradeButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  upgradeText: {
    color: "#000",
    fontWeight: "bold",
  },
  menu: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
});

export default ProfileScreen;
