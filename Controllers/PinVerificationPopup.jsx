import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ImageBackground,
  Image,
} from "react-native";
import { PinVerification } from "./userController";

const PinVerificationPopup = ({ visible, onSuccess, onClose }) => {
  const [pin, setPin] = useState("");

  // Handle number press
  const handleNumberPress = (number) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  // Handle delete press
  const handleDeletePress = () => {
    setPin(pin.slice(0, -1));
  };

  // Handle PIN verification
  const handleVerify = async () => {
    try {
      await PinVerification(pin); 
      onSuccess(pin); // Call the parent function on success
      setPin(""); // Reset PIN
    } catch (error) {
      console.log(error);
      alert("Invalid PIN");
      setPin("");
    }
  };

  // Trigger verify only when pin length is 4
  useEffect(() => {
    if (pin.length === 4) {
      handleVerify();
    }
  }, [pin]);

  // Simulated API call
  const pinVerifyApi = async (pin) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: pin === "1234" }); // Mock: Correct PIN is '1234'
      }, 100);
    });
  };

  // Render dots for PIN input
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < pin.length ? "#fff" : "transparent" },
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      <ImageBackground
        style={styles.modalContainer}
        source={require("../assets/photos/bg4.png")}
      >
        <View>
          <View style={styles.popup}>
            {/* Header with logo placeholder */}
            <View>
              <Image
                style={styles.logoText}
                alt="logo"
                source={require("../assets/photos/cyber-security.png")}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>VERIFY ACCOUNT</Text>

            {/* PIN dots */}
            <View style={styles.dotsContainer}>{renderDots()}</View>

            {/* Keypad */}
            <View style={styles.keypad}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ""].map(
                (num, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.key,
                      num === "" && styles.emptyKey, // Empty space for alignment
                    ]}
                    onPress={() => num !== "" && handleNumberPress(num)}
                    disabled={num === ""}
                  >
                    <Text style={styles.keyText}>{num}</Text>
                  </TouchableOpacity>
                )
              )}
              <TouchableOpacity style={styles.key} onPress={handleDeletePress}>
                <Text style={styles.keyText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "#e9e9e942",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#fff",
    fontSize: 16,
    width: 80,
    height: 80,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: "#fff",
    marginHorizontal: 5,
    marginTop: 16,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 40,
  },
  key: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 35,
  },
  emptyKey: {
    backgroundColor: "transparent",
  },
  keyText: {
    color: "#fff",
    fontSize: 24,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: "#444",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PinVerificationPopup;
