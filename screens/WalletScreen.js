import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetUserDetails } from "../Controllers/userController";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import UserStatement from "../Componentes/UserStatement";
import DepositScreen from "../Componentes/DepositScreen";
import WithdrawalPopup from "../Controllers/WithdrawalPopup";

export default function WalletScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const quickActions = [
    { icon: "wallet", label: "Deposit", action: () => setDepositOpen(true) },
    {
      icon: "arrow-down-circle",
      label: "Withdrawal",
      action: () => setPopupVisible(true),
    },
  ];

  const cards = [
    {
      id: "1",
      type: "Platinum",
      brand: "MasterCard",
      holder: "Aravind S",
      lastFour: "4321",
    },
    {
      id: "2",
      type: "Classic",
      brand: "Visa",
      holder: "Aravind S",
      lastFour: "9876",
    },
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
          backgroundColor: "#12182B",
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ₹
            {Number(user?.main_wallet || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                onPress={action.action}
                key={index}
                style={[
                  styles.quickActionButton,
                  index === 0 ? styles.payButton : styles.requestButton,
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={index === 0 ? "white" : "#007bff"}
                />
                <Text
                  style={
                    index === 0
                      ? styles.payButtonText
                      : styles.requestButtonText
                  }
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <UserStatement refreshing={refreshing} />

        <DepositScreen
          visible={isDepositOpen}
          onClose={(type) => {
            setDepositOpen(false);
            if (type === "success") {
              setShowSuccessPopup(true);
              userGet();
            }
          }}
          user={user}
        />

        <WithdrawalPopup
          visible={isPopupVisible}
          onClose={() => {
            setPopupVisible(false);
            userGet();
          }}
          user={user}
        />

        {/*Despoti Success Popup Modal */}
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
                onPress={() => {
                  setShowSuccessPopup(false);
                  userGet();
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12182B",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  // Balance Section
  balanceCard: {
    backgroundColor: "#1E2A44",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#A0AEC0",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "48%",
  },
  payButton: {
    backgroundColor: "#007bff",
  },
  payButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: "white",
  },
  requestButtonText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 8,
  },
  // Cards Section
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  card: {
    backgroundColor: "#2D3A56",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  cardType: {
    fontSize: 14,
    color: "#A0AEC0",
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    color: "white",
  },
  loadingGif: {
    width: 40,
    height: 40,
    marginBottom: 16,
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
});
