import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetUserDetails } from "../Controllers/userController";
import { useCallback, useEffect, useState } from "react";
import DespoitScreen from "../Componentes/DepositScreen";
import Toast from "react-native-toast-message";
import UserStatement from "../Componentes/UserStatement";
import { CgLayoutGrid } from "react-icons/cg";
import PinVerificationPopup from "../Controllers/PinVerificationPopup";
import WithdrawalPopup from "../Controllers/WithdrawalPopup";
import DepositScreen from "../Componentes/DepositScreen";

export default function WalletScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); 
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [depositPopup, setDepositPopup] = useState(false)

  const quickActions = [
    { icon: "wallet", label: "Despoit", action: () => setDepositPopup(true) },
    {
      icon: "arrow-down",
      label: "Withdraw",
      action: () => setPopupVisible(true),
    },
    { icon: "reload", label: "Exchange", action: () => setDepositPopup(true) },
  ];

  const userGet = async () => {
    setRefreshing(true);
    try {
      const response = await GetUserDetails();
      if (response !== null) {
        setUser(response?.data?.user || {});
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load user data",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSuccess = () => {
    alert("PIN Verified Successfully!");
    setPopupVisible(false);
  };

  // Refresh handler
  const onRefresh = useCallback(() => {
    userGet();
  }, []);

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
          backgroundColor: "#1a1a2e",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
         

        {/* Balance Section */}
        <ImageBackground
          source={require("../assets/photos/bg3.jpg")}
          style={styles.balanceCard}
        >
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Main Wallet</Text>
            <Text style={styles.balanceAmount}>
              ₹{Number(user?.main_wallet).toFixed(2)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Game Wallet</Text>
            <Text style={styles.balanceAmount}>
              ₹{Number(user?.game_wallet).toFixed(2)}
            </Text>
          </View>
        </ImageBackground>

        {/* Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                onPress={action.action}
                key={index}
                style={styles.quickActionButton}
              >
                <Ionicons name={action.icon} size={24} color="#1E293B" />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <UserStatement />

        <DepositScreen
          visible={depositPopup}
          onClose={() => setDepositPopup(false)}
        />

        {/* Success Popup Modal */}
        <Modal
          visible={showSuccessPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessPopup(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.popup}>
              <Image
                source={require("../assets/photos/loading2.webp")}
                style={styles.loadingGif}
              />
              <Text style={styles.message}>Verifying Your Payment!</Text>
              <TouchableOpacity
                onPress={() => setShowSuccessPopup(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <WithdrawalPopup
          visible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
          user={user}
        />
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  // Profile Section
  profileContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  profileIcon: {
    marginTop: 4,
  },
  // Balance Section
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  balanceItem: {
    alignItems: "center",
  },
  balanceIcon: {
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  // Action Buttons
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  // Settings List
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    fontSize: 14,
    color: "#F59E0B",
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingsText: {
    fontSize: 16,
    color: "#fff",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f58814",
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: "#1E293B",
    marginTop: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingGif: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
});
