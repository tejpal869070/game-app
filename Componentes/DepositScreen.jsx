import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";
import Toast from "react-native-simple-toast";
import * as Clipboard from "expo-clipboard";

// DepositScreencomponent
const DepositScreen = ({ visible, onClose }) => {
  const upiId = "8697457854@ybl"; // Mock wallet address

  const [amount, setAmount] = useState(Number);
  const [transactionId, setTransectionId] = useState("");

  const downloadQRCode = async () => {
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show("Permission Denied");
        return;
      }

      // Load and download QR code asset
      const asset = Asset.fromModule(require("../assets/photos/qr-code.png"));
      await asset.downloadAsync();

      // Copy to a location in the file system
      const fileUri = `${FileSystem.documentDirectory}qr-code.png`;
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: fileUri,
      });

      // Save to gallery
      const savedAsset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", savedAsset, false);

      Toast.show("QR code saved to gallery!");
    } catch (error) {
      console.error(error);
      Toast.show("Failed to save QR code.");
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(upiId);
    Toast.show("UPI ID copied to clipboard");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Deposit</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.headerRight}>?</Text>
          </TouchableOpacity>
        </View>

        {/* Steps Indicator */}
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepCircle, styles.activeStepCircle]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={[styles.stepText, styles.activeStepText]}>
              Scan QR / Copy UPI ID
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>Deposit funds from any UPI app</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>Enter trnx. ID for verification</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Network Selection */}

          {/* Warning Note */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Check amount and Trnx.ID before proceeding.
            </Text>
          </View>

          {/* Wallet Address Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Deposit Details</Text>
            <View style={styles.qrCodePlaceholder}>
              <Image
                style={styles.qrCodeText}
                source={require("../assets/photos/qr-code.png")}
              />
            </View>
            <Text style={styles.walletAddress}>UPI ID :- {upiId}</Text>
            <Text style={[styles.walletAddress, { marginBottom: 15 }]}>
              Banking Name :- INFOTECH PVT LTD
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={downloadQRCode}
              >
                <Text style={styles.shareButtonText}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Text style={styles.copyButtonText}>COPY</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Enter Amount</Text>
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

          <Text style={styles.label}>Transaction ID</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Transaction Id"
              keyboardType="default"
              value={transactionId}
              onChangeText={(text) => setTransectionId(text.toUpperCase())}
            />
          </View>

          <Pressable style={styles.submitButton}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </Pressable>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              If it's your first transaction, you may undergo an identity
              verification process.{" "}
              <Text style={styles.footerLink}>What is this?</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    fontSize: 24,
    color: "#fff",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerRight: {
    fontSize: 18,
    color: "#1e90ff",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  activeStepCircle: {
    backgroundColor: "#1e90ff",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 16,
  },
  stepText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  activeStepText: {
    color: "#fff",
  },
  stepLine: {
    flex: 0.5,
    height: 1,
    backgroundColor: "#555",
    alignSelf: "center",
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
  },
  picker: {
    color: "#fff",
  },
  warningContainer: {
    backgroundColor: "#2f2f2f",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 20,
    color: "#ff9500",
    marginRight: 10,
  },
  warningText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  qrCodePlaceholder: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  qrCodeText: {
    fontSize: 14,
    width: 150,
    height: 150,
  },
  walletAddress: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  shareButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth : 1,
    borderColor : "#1e90ff"
  },
  shareButtonText: {
    color: "#1e90ff",
    fontSize: 16,
  },
  copyButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerNote: {
    backgroundColor: "#2f2f2f",
    borderRadius: 8,
    padding: 15,
  },
  footerNoteText: {
    color: "#fff",
    fontSize: 14,
  },
  footerLink: {
    color: "#1e90ff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#dcf2ff",
    marginBottom: 15,
  },
  currencyInput: {
    fontSize: 18,
    color: "black",
    marginRight: 5,
  },
  input: {
    fontSize: 18,
    color: "black",
    flex: 1,
    fontWeight: 600,
    backgroundColor: "#dcf2ff",
  },
  submitButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  submitText: {
    color: "white",
    fontSize : 16,
    fontWeight : 600
  },
});

export default DepositScreen;
