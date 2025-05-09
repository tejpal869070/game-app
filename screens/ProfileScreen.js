import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    navigation.navigate("Starting");
  };

  const personalInfo = [
    { icon: "mail", label: "Email", value: "TSONI9742@GMAIL.COM" },
    { icon: "call", label: "Mobile", value: "8690708302" },
  ];

  const settingsItems = [
    { icon: "lock-closed", label: "Privacy", action: () => handleLogout() },
    {
      icon: "information-circle",
      label: "Information",
      action: () => handleLogout(),
    },
    { icon: "log-out", label: "Logout", action: () => handleLogout() },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <ImageBackground
        source={require("../assets/photos/bg1.jpg")}
        style={styles.profileBackground}
        resizeMode="cover"
      >
        <View style={styles.profileOverlay}>
          <Image
            source={require("../assets/photos/boy.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Ahmad Nawaz Ali</Text>
          <Text style={styles.profileUsername}>UID8674524</Text>
        </View>
      </ImageBackground>

      {/* Personal Info Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
        {personalInfo.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <Ionicons
              name={item.icon}
              size={24}
              color="#F59E0B"
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#F59E0B" />
          </View>
        ))}
      </View>

      {/* Settings/Privacy Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            onPress={item.action}
            key={index}
            style={styles.infoItem}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color="#F59E0B"
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={24} color="#F59E0B" />
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="dark" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingTop: 40,
  },
  // Profile Section
  profileBackground: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  profileOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  followerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 16,
  },
  followerText: {
    color: "#fff",
    fontSize: 14,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: "#94A3B8",
  },
  // Personal Info/Settings Section
  sectionContainer: {
    padding: 16,
    marginTop: 16, 
  },
  sectionTitle: {
    fontSize: 14,
    color: "#F59E0B",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(20, 142, 223, 0.93)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "black",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "black",
    fontWeight : "bold"
  },
});
