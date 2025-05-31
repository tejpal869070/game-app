import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetUserDetails } from "../Controllers/userController";
import Toast from "react-native-simple-toast";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75; // 75% of screen width

const SideNavBar = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "My Wallet", icon: "wallet-outline", link: "walletScreen" },
    { name: "Refer & Earn", icon: "people-outline", link: "walletScreen" },
    { name: "Leaderboards", icon: "trophy-outline", link: "walletScreen" },
    {
      name: "Game Management",
      icon: "game-controller-outline",
      link: "walletScreen",
    },
    { name: "Contest Invite Code", icon: "mail-outline", link: "walletScreen" },
    { name: "Real11 Blog", icon: "newspaper-outline", link: "walletScreen" },
    { name: "Settings", icon: "settings-outline", link: "walletScreen" },
    { name: "Logout", icon: "log-out-outline", link: "walletScreen" },
    { name: "Contact us", icon: "call-outline", link: "walletScreen" },
  ];

  const userGet = async () => {
    try {
      const response = await GetUserDetails();
      setUser(response?.data?.user || {});
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load user data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userGet();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#12182B",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <>
      {/* Toggle Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
        <Ionicons name="menu-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={60} color="#4a90e2" />
          <Text style={styles.userId}>{user?.user_name}</Text>
          <Text style={styles.subId}>{user?.mobile}</Text>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Wallet")}
            key={index}
            style={styles.menuItem}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
            {item.name === "Contact us" && (
              <Text style={styles.contactNumber}>0120-7102028</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Social Icons */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialHeader}>Connect with us</Text>
          <View style={styles.socialIcons}>
            {[
              "logo-facebook",
              "logo-twitter",
              "logo-instagram",
              "logo-youtube",
              "logo-whatsapp",
            ].map((icon, index) => (
              <Ionicons
                key={index}
                name={icon}
                size={30}
                color="#666"
                style={styles.socialIcon}
              />
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Real11 v1.0.103 | Made in India</Text>
      </Animated.View>

      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 1000,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userId: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  subId: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  contactNumber: {
    marginLeft: "auto",
    color: "#4a90e2",
    fontSize: 14,
  },
  socialContainer: {
    marginTop: 20,
  },
  socialHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  socialIcon: {
    marginRight: 15,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 12,
    color: "#666",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
  },
});

export default SideNavBar;
