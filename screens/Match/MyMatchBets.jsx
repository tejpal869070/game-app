import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyMatchBets } from "../../Controllers/userController";

export default function MyMatchBets({ match_id, refresh }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedBet, setSelectedBet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (bet) => {
    setSelectedBet(bet);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBet(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>{item.team_name} </Text>
        <Text
          style={[
            styles.title,
            {
              paddingHorizontal: 12,
              backgroundColor: "indigo",
              fontSize: 15,
              paddingVertical: 2,
              borderRadius: 50,
            },
          ]}
        >
          {
            item?.match_details?.sections?.find((i) => i.id == item.section_id)
              ?.after_over
          }
          th Over
        </Text>
      </View>
      <Text style={styles.subtitle}>
        {item.bet_type === "L" ? "Last Digit Bet" : "Exact Run Bet"} | Value:{" "}
        {item.bet_value}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.amount}>Amount: ₹{item.amount}</Text>
        <Text style={styles.amount}>
          {item?.amount === item?.win_amount
            ? `Refunded: ₹${item.win_amount}`
            : item?.win_amount
            ? `Win: ₹${item.win_amount}`
            : "Pending..."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const fetchData = async (match_id) => {
    try {
      const response = await getMyMatchBets(match_id);
      setData(response.data.reverse());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error !");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(match_id);
  }, [match_id, refresh]);

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
    <View style={{ marginHorizontal: 20, marginTop: 40 }}>
      <Text style={{ color: "white", textDecorationLine: "underline" }}>
        My Bets
      </Text>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {selectedBet && (
                  <>
                    <Text style={styles.modalTitle}>Bet Details</Text>
                    <Text>
                      <Text style={styles.label}>Team:</Text>{" "}
                      {selectedBet.team_name}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Type:</Text>{" "}
                      {selectedBet.bet_type === "L"
                        ? "Last Digit Bet"
                        : "Exact Run Bet"}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Value:</Text>{" "}
                      {selectedBet.bet_value}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Amount:</Text> ₹
                      {selectedBet.amount}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Win Amount:</Text> ₹
                      {selectedBet.win_amount || 0}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Date:</Text>{" "}
                      {new Date(selectedBet.date).toLocaleString()}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Match:</Text>{" "}
                      {selectedBet.match_details.title}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Match Time:</Text>{" "}
                      {new Date(
                        selectedBet.match_details.match_time
                      ).toLocaleString()}
                    </Text>
                  </>
                )}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#d7e6ff",
    // padding: 5,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#2a2a3e",
    marginBottom: 10,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e1e1e1",
  },
  subtitle: {
    fontSize: 14,
    color: "#fffff6",
    marginVertical: 2,
  },
  amount: {
    fontSize: 14,
    color: "#0ac523",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
