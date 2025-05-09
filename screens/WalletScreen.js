import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WalletScreen() {
  const quickActions = [
    { icon: "card", label: "Pay" },
    { icon: "arrow-down", label: "Receive" },
    { icon: "add-circle", label: "Top Up" },
    { icon: "ellipsis-horizontal", label: "More" },
  ];
  const transactions = [
    {
      id: "1",
      icon: "person",
      name: "Alex Lee",
      date: "15 Aug",
      amount: "-$230.00",
      color: "#EF4444",
    },
    {
      id: "2",
      icon: "person",
      name: "John Doe",
      date: "14 Aug",
      amount: "+$500.00",
      color: "#10B981",
    },
    {
      id: "3",
      icon: "person",
      name: "Sarah Smith",
      date: "13 Aug",
      amount: "-$120.00",
      color: "#EF4444",
    },
  ];

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.color }]}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/photos/walleticon.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Tarun Soni</Text>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Main Wallet</Text>
          <Text style={styles.balanceAmount}>$2314.30</Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Game Wallet</Text>
          <Text style={styles.balanceAmount}>$1340.00</Text>
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionButton}>
              <Ionicons name={action.icon} size={24} color="#1E293B" />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  // Profile Section
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
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
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceItem: {
    alignItems: "center",
  },
  balanceIcon: {
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
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
    color: "#1E293B",
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "22%",
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionIconContainer: {
    backgroundColor: "#2563EB",
    borderRadius: 50,
    padding: 8,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
