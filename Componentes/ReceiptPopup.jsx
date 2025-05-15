import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const ReceiptPopup = ({ visible, onClose }) => {
  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Receipt: You received 10,000,000 sats from bc1q gx9g ... sfsy",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Receipt Content */}
            <View style={styles.receiptHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="arrow-down" size={24} color="#fff" />
              </View>
              <Text style={styles.receivedText}>
                You received 10,000,000 sats.
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>From</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>bc1q gx9g ... sfsy</Text>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Network fee</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>~7 sats</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Swap fee</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>~2,000 sats</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#888"
                  style={styles.icon}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <Text style={styles.shareText}>Share receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  popupContainer: {
    height: height * 0.7, // 70% of screen height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  receiptHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: "#00C853",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  receivedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginRight: 5,
  },
  icon: {
    marginLeft: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  inputLabel: {
    fontSize: 16,
    color: "#888",
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  shareButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  shareText: {
    fontSize: 16,
    color: "#000",
  },
  doneButton: {
    backgroundColor: "#FF9800",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  doneText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReceiptPopup;
