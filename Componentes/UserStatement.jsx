import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetAccountAllStatement } from "../Controllers/userController";
import { TouchableOpacity } from "react-native";
import ReceiptPopup from "./ReceiptPopup";

export default function UserStatement({ refreshing }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [popupData, setPopupData] = useState({});

  const GetAllStatement = async () => {
    try {
      const response = await GetAccountAllStatement();
      setData(response?.reverse());
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllStatement();
  }, [refreshing]);

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setShowReceipt(true);
        setPopupData(item);
        console.log(item)
      }}
      style={styles.transactionItem}
    >
      <View style={styles.transactionIconContainer}>
        {item.type === "Deposit" ? (
          <Image
            style={styles.icon}
            source={require("../assets/photos/wallet (1).png")}
          />
        ) : item.type?.toLowerCase().includes("game") ? (
          <Image
            style={styles.icon}
            source={require("../assets/photos/game-controller.png")}
          />
        ) : (
          <Image
            style={styles.icon}
            source={require("../assets/photos/withdrawal.png")}
          />
        )}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{item.type}</Text>
        <Text style={styles.transactionDate}>
          {item.date?.split("T")[0]} {item.date?.split("T")[1]}
        </Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === "Withdrawal" ? "#d70b0b" : "#179f16" },
        ]}
      >
        ₹{item.amount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={data}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
      <ReceiptPopup
        visible={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setPopupData({});
        }}
        data={popupData}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f58814",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionIconContainer: {
    borderRadius: 50,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    width: 40,
    height: 40,
  },
});
