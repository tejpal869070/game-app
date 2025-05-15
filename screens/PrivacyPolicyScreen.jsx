import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("MainApp")}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.paragraph}>Last updated: May 15, 2025</Text>
        <Text style={styles.paragraph}>
          Welcome to [Your App Name], a platform for playing games and casino
          entertainment ("we," "us," or "our"). We are committed to protecting
          your privacy and ensuring that your personal information is handled in
          a safe and responsible manner. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use
          our app.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect the following types of information: - **Personal
          Information**: Name, email address, phone number, and payment details
          when you register or make in-app purchases. - **Usage Data**:
          Information about your gaming activity, bets, wins, losses, and app
          interactions. - **Device Information**: IP address, device type,
          operating system, and unique device identifiers. - **Location Data**:
          Approximate location to comply with gambling regulations and provide
          region-specific features.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to: - Provide and improve our gaming and
          casino services. - Process transactions and manage your account. -
          Ensure compliance with legal and regulatory requirements, such as age
          and location verification. - Send promotional offers, updates, and
          notifications (you can opt-out anytime). - Analyze usage patterns to
          enhance user experience.
        </Text>

        <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
        <Text style={styles.paragraph}>
          We may share your information with: - **Service Providers**: Third
          parties that help us operate the app, process payments, or provide
          customer support. - **Legal Authorities**: When required by law or to
          protect our rights, safety, or property. - **Partners**: For
          promotional purposes, but only with your consent. We do not sell your
          personal information to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We use industry-standard security measures, such as encryption, to
          protect your data. However, no method of transmission over the
          internet is 100% secure, and we cannot guarantee absolute security.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have the right to: - Access,
          correct, or delete your personal information. - Opt-out of marketing
          communications. - Request data portability. To exercise these rights,
          please contact us at support@[yourappname].com.
        </Text>

        <Text style={styles.sectionTitle}>6. Age Restriction</Text>
        <Text style={styles.paragraph}>
          Our app is intended for users aged 21 and older. We do not knowingly
          collect information from individuals under 21. If we learn that we
          have collected such information, we will delete it immediately.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of significant changes by posting a notice in the app or sending
          an email.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at: Email: support@[yourappname].com Phone: +1-800-123-4567
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default PrivacyPolicyScreen;
