import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import { Ionicons } from "@expo/vector-icons";

import {
  addMatchBet,
  getSingleMatchData,
  GetUserDetails,
} from "../../Controllers/userController";
import { API } from "../../Controllers/API";
import MyMatchBets from "./MyMatchBets";

const MatchDetail = () => {
  const route = useRoute();
  const { matchId } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedSection, setSelectedSection] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const [isExactRunModalVisible, setExactRunModalVisible] = useState(false);
  const [exactRuns, setExactRuns] = useState("");

  const [refresh, setRefresh] = useState(false);

  const [user, setUser] = useState({});

  const digits = Array.from({ length: 10 }, (_, i) => i);
  const suggestedAmounts = [100, 500, 1000, 5000];

  const toggleModal = (over) => {
    setSelectedSection(over);
    setModalVisible(!isModalVisible);
    setBetAmount(0);
    userGet()
  };
  const toggleExactRunModal = (over) => {
    setSelectedSection(over);
    setExactRunModalVisible(!isExactRunModalVisible);
    setBetAmount(0);
    userGet()
  };

  // bet function----
  const confirmBet = async (bet_type) => {
    if (Number(betAmount) < 10) {
      Toast.show("Minimum bet amount is 10");
      return;
    }

    try {
      const formData = {
        match_id: matchId,
        bet_type: bet_type,
        bet_value: bet_type === "L" ? selectedDigit : exactRuns,
        amount: betAmount,
        section_id: selectedSection,
        selectedTeamName: selectedTeam,
      };
      await addMatchBet(formData);

      setBetAmount("");
      setSelectedSection("");
      setSelectedDigit(null);

      // close modal
      if (bet_type === "E") {
        toggleExactRunModal();
        setExactRuns("");
      } else if (bet_type === "L") {
        toggleModal();
      }
      Toast.show(" Bet placed successfully");
      setRefresh((pre) => !pre);
    } catch (error) {
      Toast.show(error?.response?.data?.message || "Internal Server Error !");
    }
  };

  const fetchData = async (id) => {
    try {
      const response = await getSingleMatchData(id);
      setSelectedTeam(response.data?.teams[0].team_name);
      setData(response.data);
    } catch (error) {
      Toast.show(" Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(matchId);
  }, [matchId]);

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{data?.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Teams Section */}
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Image
              source={{ uri: `${API.url}assets/${data?.teams[0]?.image}` }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{data?.teams[0]?.team_name}</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.team}>
            <Image
              source={{ uri: `${API.url}assets/${data?.teams[1]?.image}` }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{data?.teams[1]?.team_name}</Text>
          </View>
        </View>

        {/* Overs Section */}
        {data?.status === "C" ? (
          <>
            <Image
              alt="match over"
              source={require("../../assets/photos/Match Over Results.png")}
              style={{
                width: "95%",
                height: 140,
                margin: "auto",
                borderRadius: 8,
              }}
            />{" "}
          </>
        ) : (
          data?.sections?.map((item, index) => (
            <View key={index} style={styles.overContainer}>
              <Text style={styles.overText}>{item.after_over}th Over</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => toggleExactRunModal(item.id)}
                >
                  <Text style={styles.buttonText}>EXACT RUN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => toggleModal(item.id)}
                >
                  <Text style={styles.buttonText}>LAST DIGIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={styles.tableContainer}>
          {/* Header */}
          <View style={styles.tableRowHeader}>
            <Text style={[styles.tableCell, styles.headerText]}>Section</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Over</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Results</Text>
          </View>

          {/* Rows */}
          <FlatList
            data={data?.sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: index % 2 === 0 ? "#1f2937" : "#374151",
                  },
                ]}
              >
                <Text style={styles.tableCell}>{item.id}</Text>
                <Text style={styles.tableCell}>{item.after_over} OVER</Text>
                <View style={styles.tableCell}>
                  {item?.result?.map((res, idx) => (
                    <Text key={idx} style={{ color: "#d1d5db" }}>
                      {res.team_name}: {res.score}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          />
        </View>
        {/* my bets */}
        <MyMatchBets match_id={matchId} refresh={refresh} />
      </ScrollView>

      {/* Bottom Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => toggleModal("")}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Place Your Bet</Text>

          {/* Team Selection */}
          <View style={styles.teamSelection}>
            {[data?.teams[0]?.team_name, data?.teams[1]?.team_name].map(
              (team) => (
                <TouchableOpacity
                  key={team}
                  style={[
                    styles.teamOption,
                    selectedTeam === team && styles.selectedTeamOption,
                  ]}
                  onPress={() => setSelectedTeam(team)}
                >
                  <Text
                    style={[
                      styles.teamOptionText,
                      selectedTeam === team && styles.selectedTeamText,
                    ]}
                  >
                    {team}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Digit Selection */}
          <Text style={styles.sectionTitle}>Select Last Digit</Text>
          <View style={styles.digitGrid}>
            {digits.map((digit) => (
              <TouchableOpacity
                key={digit}
                style={[
                  styles.digitBox,
                  selectedDigit === digit && styles.selectedDigitBox,
                ]}
                onPress={() => setSelectedDigit(digit)}
              >
                <Text
                  style={[
                    styles.digitText,
                    selectedDigit === digit && styles.selectedDigitText,
                  ]}
                >
                  {digit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Suggested Amounts */}
          <Text style={styles.sectionTitle}>Suggested Amounts</Text>
          <View style={styles.suggestedAmounts}>
            {suggestedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.amountButton}
                onPress={() =>
                  setBetAmount((pre) => (Number(pre) + amount).toString())
                }
              >
                <Text style={styles.amountText}>₹{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bet Amount Input with ₹ Sign */}
          <View style={styles.inputWrapper}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Bet Amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={betAmount}
              onChangeText={setBetAmount}
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              if (selectedDigit === null) {
                Toast.show("Please select a digit");
                return;
              }
              confirmBet("L");
            }}
          >
            <Text style={styles.confirmText}>CONFIRM BET</Text>
          </TouchableOpacity>

          {/* wallet */}
          <View style={styles.wallet}>
            <Ionicons name="wallet" size={24} color="black" />
            <Text style={{ fontWeight: "bold" }}>₹{user?.main_wallet}</Text>
          </View>
        </View>
      </Modal>

      {/* exact run popup ----------------------------------*/}
      <Modal
        isVisible={isExactRunModalVisible}
        onBackdropPress={() => toggleExactRunModal("")}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bet on Exact Runs</Text>

          {/* Team Selection */}
          <View style={styles.teamSelection}>
            {[data?.teams[0]?.team_name, data?.teams[1]?.team_name].map(
              (team) => (
                <TouchableOpacity
                  key={team}
                  style={[
                    styles.teamOption,
                    selectedTeam === team && styles.selectedTeamOption,
                  ]}
                  onPress={() => setSelectedTeam(team)}
                >
                  <Text
                    style={[
                      styles.teamOptionText,
                      selectedTeam === team && styles.selectedTeamText,
                    ]}
                  >
                    {team}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Input for Exact Runs */}
          <Text style={styles.sectionTitle}>Enter Exact Runs</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Exact Runs (e.g., 52)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={exactRuns}
              onChangeText={setExactRuns}
            />
          </View>

          {/* Suggested Bet Amounts */}
          <Text style={styles.sectionTitle}>Suggested Amounts</Text>
          <View style={styles.suggestedAmounts}>
            {suggestedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.amountButton}
                onPress={() =>
                  setBetAmount((pre) => (Number(pre) + amount).toString())
                }
              >
                <Text style={styles.amountText}>₹{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Bet Amount */}
          <View style={styles.inputWrapper}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Bet Amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={betAmount}
              onChangeText={setBetAmount}
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              if (!exactRuns || parseInt(betAmount) < 10) {
                Toast.show("Enter valid runs and minimum ₹10 bet");
                return;
              }
              confirmBet("E");
            }}
          >
            <Text style={styles.confirmText}>CONFIRM BET</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#f5c518",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  team: {
    alignItems: "center",
    width: "30%",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  vsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5c518",
    marginHorizontal: 20,
  },
  overContainer: {
    backgroundColor: "#2a2a3e",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  overText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  // Modal styles
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  teamSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  teamOption: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f5c518",
    width: "40%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTeamOption: {
    backgroundColor: "#f5c518",
  },
  teamOptionText: {
    color: "#f5c518",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedTeamText: {
    color: "#000",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    marginVertical: 10,
  },
  digitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  digitBox: {
    width: "18%",
    backgroundColor: "#2a2a3e",
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedDigitBox: {
    backgroundColor: "#f5c518",
  },
  digitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedDigitText: {
    color: "#000",
  },
  suggestedAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  amountButton: {
    backgroundColor: "#2a2a3e",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5c518",
  },
  amountText: {
    color: "#f5c518",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: "#f5c518",
    borderWidth: 1,
  },
  rupeeSymbol: {
    color: "#fff",
    fontSize: 16,
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: "#f5c518",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "bold",
    color: "#000",
  },
  tableContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#6b21a8",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerText: {
    color: "BLACK",
    fontWeight: "700",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableCell: {
    flex: 1,
    color: "#f3f4f6",
    fontSize: 13,
  },
  wallet: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
});

export default MatchDetail;
