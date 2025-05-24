import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import PinVerificationPopup from "./PinVerificationPopup";
import { AddCryptoWithdrawalRequest } from "./userController";

const { height } = Dimensions.get("window");

// Constants
const USER_BALANCE = 500.0;
const WITHDRAWAL_FEE = 20;

const WithdrawalPopup = ({ visible, onClose, user }) => {
  const [amount, setAmount] = useState();
  const [usdtAddress, setUsdtAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [USER_BALANCE, setUserBalance] = useState(
    Number(user?.main_wallet) / 90
  );
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!amount || !usdtAddress) {
      alert("Please fill in all fields.");
      return;
    }
    if (parseFloat(amount) + WITHDRAWAL_FEE > USER_BALANCE) {
      alert("Insufficient balance.");
      return;
    }
    setShowConfirm(true);
  };

  const handleWithdrawal = async () => {
    setLoading(true);
    try {
      const formData = {
        amount: parseFloat(amount),
        address: usdtAddress,
      };
      console.log({ amount, usdtAddress });
      await AddCryptoWithdrawalRequest(formData, pin);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount("");
        setUsdtAddress("");
        onClose();
      }, 1500);
    } catch (error) { 
      alert(
        error.response.data.message || "Withdrawal failed. Please try again."
      );
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const calculatedFee = WITHDRAWAL_FEE.toFixed(2);
  const totalDeducted = (parseFloat(amount || 0) + WITHDRAWAL_FEE).toFixed(2);

  useEffect(() => {
    setUserBalance(Number(user?.main_wallet) );
  }, [user]);

  return (
    <View>
      <Modal visible={visible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.popup, { transform: [{ translateY: slideAnim }] }]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
              keyboardVerticalOffset={80}
            >
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Processing...
                  </Text>
                  <ActivityIndicator size="large" color="#007bff" />
                </View>
              ) : showSuccess ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 40,
                  }}
                >
                  <Image
                    alt="pending"
                    style={styles.pendingImg}
                    source={require("../assets/photos/loading2.webp")}
                  />
                  <Text style={styles.title}> Pending...</Text>
                  <Text style={styles.successText}>
                    Withdrawal request submitted successfully.
                  </Text>
                </View>
              ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {!showConfirm && !showSuccess && (
                    <>
                      <Text style={styles.title}>Withdraw Funds</Text>

                      {/* Balance Card */}
                      <View style={styles.balanceCard}>
                        <Text style={styles.balanceTitle}>Your Balance</Text>
                        <Text style={styles.balanceAmount}>
                          ₹ {USER_BALANCE.toFixed(2)} 
                        </Text>
                        <Text style={styles.rate}>1 USDT ~ 93.00 INR</Text>
                      </View>

                      {/* Amount Input */}
                      <Text style={styles.label}>Amount</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter amount"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      />

                      {/* USDT Address Input */}
                      <Text style={styles.label}>USDT Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter USDT address"
                        placeholderTextColor="#888"
                        value={usdtAddress}
                        onChangeText={setUsdtAddress}
                      />

                      {/* Fee Info */}
                      {amount ? (
                        <View style={styles.feeInfo}>
                          <Text style={styles.feeText}>
                             Fee: ₹{calculatedFee}
                          </Text>
                          <Text style={styles.feeText}>
                            Total Deducted: ₹{totalDeducted}
                          </Text>
                        </View>
                      ) : null}

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setAmount(), setUsdtAddress("");
                          onClose();
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Confirmation */}
                  {showConfirm && (
                    <>
                      <Text style={styles.title}>Confirm Withdrawal</Text>

                      {/* Confirmation Box */}
                      <View style={styles.confirmBox}>
                        <Text style={styles.confirmLabel}>Amount</Text>
                        <Text style={styles.confirmValue}>
                          {parseFloat(amount).toFixed(2)} USDT
                        </Text>

                        <Text style={styles.confirmLabel}>Fee</Text>
                        <Text style={styles.confirmValue}>
                          {calculatedFee} USDT
                        </Text>

                        <Text style={styles.confirmLabel}>Total</Text>
                        <Text style={styles.confirmValue}>
                          {totalDeducted} USDT ~ {totalDeducted * 90} INR
                        </Text>

                        <Text style={styles.confirmLabel}>USDT Address</Text>
                        <Text style={styles.confirmValue}>{usdtAddress} </Text>
                      </View>

                      {/* Action Buttons */}
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => setPinOpen(true)}
                      >
                        <Text style={styles.submitButtonText}>Confirm</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelConfirm}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      {/* pin verificarion */}
      <PinVerificationPopup
        visible={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={(pin) => {
          setPinOpen(false);
          setPin(pin);
          handleWithdrawal();
        }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "rgb(255, 255, 255)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.6,
    width: "100%",
    overflow: "hidden",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  balanceCard: {
    backgroundColor: "#f7f9fc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderColor: "#dce1e7",
    borderWidth: 1,
  },
  balanceTitle: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e90ff",
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  feeInfo: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
  },
  feeText: {
    fontSize: 14,
    color: "#444",
    backgroundColor: "#ffd366",
    padding: 10,
    fontWeight: "bold",
    marginRight: 4,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderColor: "#1e90ff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#1e90ff",
    fontSize: 16,
  },
  confirmText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  confirmBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  confirmLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  pendingImg: {
    width: 50,
    height: 50,
    margin: "auto",
  },
  rate: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default WithdrawalPopup;
