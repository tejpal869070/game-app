import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GetAccountAllStatement,
  GetGameWalletStatement,
} from "../Controllers/userController";
import { TouchableOpacity } from "react-native";
import ReceiptPopup from "./ReceiptPopup";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { SafeAreaView } from "react-native";

export default function UserStatement({ refreshing }) {
  const [data, setData] = useState([]);
  const [gameStatement, setGameStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [index, setIndex] = useState(0);

  const FirstRoute = () => (
    <FlatList
      data={data}
      renderItem={renderTransaction}
      keyExtractor={(item, index) => index}
      scrollEnabled={true}
    />
  );
  const SecondRoute = () => (
    <FlatList
      data={gameStatement}
      renderItem={renderGameTransaction}
      keyExtractor={(item, index) => index}
      scrollEnabled={true}
    />
  );

  const [routes] = useState([
    { key: "first", title: "Statement" },
    { key: "second", title: "Games History" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const GetAllStatement = async () => {
    try {
      const [main, game] = await Promise.all([
        GetAccountAllStatement(),
        GetGameWalletStatement(),
      ]);

      setData(main.reverse());
      setGameStatement(game.reverse());
    } catch (error) {
      console.log(error) 
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
        console.log(item);
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
          {item.date?.split("T")[0]} {item.date?.split("T")[1]}{" "}
          {item?.created_at?.split("T")[0]} {item?.created_at?.split("T")[1]}
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


  const renderGameTransaction = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setShowReceipt(true);
        setPopupData(item);
        console.log(item);
      }}
      style={styles.transactionItem}
    >
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{item?.game_name} {" || "} {item?.description}</Text>
        <Text style={styles.transactionDate}>
          {item.date?.split("T")[0]} {item.date?.split("T")[1]}{" "}
          {item?.created_at?.split("T")[0]} {item?.created_at?.split("T")[1]}
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
    <View style={{ flex: 1 }}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(newIndex) => {
          setIndex(newIndex);
          GetAllStatement();
        }}
        swipeEnabled={true}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{ backgroundColor: "#007bff", borderRadius: 5 }}
            onTabPress={({ route }) => {
              const routeIndex = routes.findIndex((r) => r.key === route.key);
              setIndex(routeIndex);
            }}
          />
        )}
        style={{ height: 500 }}
      />
      <ReceiptPopup
        visible={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setPopupData({});
        }}
        data={popupData}
      />
    </View>
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
    marginBottom: 0,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
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
