import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-simple-toast";
import { AddCryptoDepositRequest } from "../Controllers/userController";

export default function DepositScreen({ visible, onClose, user }) {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const recommendedAmounts = [100, 1000, 2000, 5000];

  const formData = {
    amount: amount,
    transection_id: transactionId,
    deposit_to: "SA65S4GT84STR84LDT4R6E5S4651G6A5SEG84AEGA",
  };

  const handleSubmit = async () => {
    if (amount < 10) {
      Toast.show("Minimum deposit is $10");
      return;
    } else if (transactionId.length < 10) {
      Toast.show("Invalid Transaction ID.");
      return;
    }
    try {
      await AddCryptoDepositRequest(formData);

      setLoading(false);
      setTransactionId("");
      setAmount("");
      onClose("success");
    } catch (error) {
      console.log("error",error);
      Toast.show(error?.response?.data?.message || "Internal Server Error !");
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContent}>
              {/* Balance Section */}
              {user?.main_wallet < 100 ? (
                <Text style={styles.balanceLabel}>LOW BALANCE</Text>
              ) : (
                <Text
                  style={{
                    color: "green",
                    marginBottom: 4,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  YOUR BALANCE
                </Text>
              )}
              <View style={styles.balanceContainer}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.balance}>{user.main_wallet}</Text>
              </View>

              <Image
                style={{ width: 190, marginBottom: 2, height: 190 }}
                source={require("../assets/photos/qr.jpg")}
              />
              <Text style={styles.qrText}>UPI ID:- ASIS76589@YBL</Text>
              <Text style={styles.qrText}>Banking Name :- SPARROW GAMES</Text>

              {/* Input Section */}
              <Text style={styles.sectionTitle}>Top-up Wallet</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyInput}>₹</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Recommended Amounts */}
              <View style={styles.recommendedContainer}>
                <Text style={styles.recommendedLabel}>Recommended:</Text>
                <View style={styles.recommendedButtons}>
                  {recommendedAmounts.map((amt, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recommendedButton}
                      onPress={() => setAmount(amt.toString())}
                    >
                      <Text style={styles.recommendedText}>₹{amt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Transaction ID */}
              <Text style={styles.label}>Transaction ID</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="Enter transaction ID"
                value={transactionId}
                keyboardType="default"
                onChangeText={setTransactionId}
              />

              {/* Buttons */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "PROCESSING..." : "CONFIRM DEPOSIT"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setAmount("");
                  setTransactionId("");
                  onClose("cancel");
                }}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "90%",
  },
  balanceLabel: {
    color: "#ff0000",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  currency: {
    fontSize: 24,
    color: "#000",
    marginRight: 5,
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  qrText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  currencyInput: {
    fontSize: 18,
    color: "#000",
    marginRight: 5,
  },
  input: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  recommendedContainer: {
    marginBottom: 20,
  },
  recommendedLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  recommendedButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  recommendedButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    marginRight: 5,
  },
  recommendedText: {
    fontSize: 14,
    color: "#000",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#5c169b",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
