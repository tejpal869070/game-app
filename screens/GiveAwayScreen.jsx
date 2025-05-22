import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from "react-native";

export default function GiveAwayScreen() {
  const tasks = [
    "Make a minimum deposit of $200",
    "Complete 5 transactions during the campaign period",
    "Refer 3 friends to join the platform",
    "Share your referral link on social media",
    "Participate in at least 2 weekly challenges",
  ];

  const termsAndConditions = [
    "The giveaway is open to users aged 18 and above.",
    "The campaign period runs from May 16, 2025, to June 16, 2025.",
    "A minimum deposit of $200 is required to be eligible.",
    "Only one entry per user is allowed; multiple accounts will lead to disqualification.",
    "Tasks must be completed within the campaign period to qualify.",
    "The winner will be determined based on the highest points earned from completing tasks.",
    "In case of a tie, the user who completed the tasks first will be selected as the winner.",
    "The iPhone 16 Pro Max prize is non-transferable and cannot be exchanged for cash.",
    "The winner will be announced on June 20, 2025, via email and on the platform.",
    "Participants must comply with all platform rules and regulations.",
    "The organizer reserves the right to disqualify any participant for fraudulent activity.",
    "The prize will be delivered within 30 days of the announcement, subject to availability.",
    "Participants are responsible for any taxes or fees associated with the prize.",
    "By participating, users agree to the use of their name and likeness for promotional purposes.",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>iPhone 16 Pro Max Giveaway</Text>
          </View>

          {/* Prize Image */}
          <Image
            source={require("../assets/photos/iphone.png")}
            style={styles.prizeImage}
          />

          {/* Giveaway Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Win</Text>
            <Text style={styles.sectionText}>
              Be the top user by completing all tasks during the campaign period
              to win an iPhone 16 Pro Max! The campaign runs from May 16, 2025,
              to June 16, 2025.
            </Text>
            <Text style={styles.sectionText}>Minimum Deposit: $200</Text>
          </View>

          {/* Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks to Complete</Text>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Text style={styles.taskText}>• {task}</Text>
              </View>
            ))}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
            {termsAndConditions.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <Text style={styles.termText}>
                  {index + 1}. {term}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    paddingTop: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 15,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  prizeImage: {
    width: "100%",
    height: 200,
    alignSelf: "cover",
    marginVertical: 20,
    resizeMode: "contain",
  },
  section: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    color: "#f5a623",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  taskItem: {
    marginVertical: 5,
  },
  taskText: {
    color: "#fff",
    fontSize: 16,
  },
  termItem: {
    marginVertical: 5,
  },
  termText: {
    color: "#fff",
    fontSize: 14,
  },
});
