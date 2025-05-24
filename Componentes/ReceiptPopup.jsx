import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const ReceiptPopup = ({ visible, onClose, data }) => {
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
              <Text style={styles.receivedText}>{data?.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>₹ {data?.amount}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>{data?.date?.split("T")[0]}</Text>
                <Text style={styles.value}>{data?.created_at?.split("T")[0]}</Text>

              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {data?.date?.split("T")[1]?.split(".")[0]}{data?.created_at?.split("T")[1]?.split(".")[0]}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Trnx. ID</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {data?.transection_id}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {data?.description}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
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
