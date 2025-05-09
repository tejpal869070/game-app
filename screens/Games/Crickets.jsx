import { StatusBar } from "expo-status-bar";
import { Text, View, FlatList, StyleSheet, Image } from "react-native";

export default function Cricket() {
  const matches = [
    {
      id: "1",
      teams: "Lahore Qalandars vs Karachi Kings",
      time: "15:30",
      status: "Live",
    },
    {
      id: "2",
      teams: "Multan Sultans vs Peshawar Zalmi",
      time: "16:00",
      status: "Live",
    },
    {
      id: "3",
      teams: "Quetta Gladiators vs Islamabad United",
      time: "18:00",
      status: "Upcoming",
    },
    {
      id: "4",
      teams: "Karachi Kings vs Lahore Qalandars",
      time: "20:00",
      status: "Upcoming",
    },
  ];

  const renderMatch = ({ item }) => (
    <View style={styles.matchCard}>
      <Text style={styles.matchTeams}>|| {item.teams} ||</Text>
      <View style={styles.teams}>
        <View style={styles.singleTeams}>
          <Image
            style={styles.teamsImage}
            source={require("../../assets/photos/rr.webp")}
          />
          <Text>RCB</Text>
        </View>
        <Text style={styles.matchCountDown}>11:45 PM</Text>
        <View style={styles.singleTeams}
        >
          <Image
            style={styles.teamsImage}
            source={require("../../assets/photos/rr.webp")}
          />
          <Text>KKR</Text>
        </View>
      </View>
      <View style={styles.matchFooter}>
        <Text style={styles.matchTime}>Time {item.time} UTC</Text>
        <Text
          style={[
            styles.matchStatus,
            { backgroundColor: item.status === "Live" ? "#EF4444" : "#D1D5DB" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.matchList}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  matchList: {
    paddingBottom: 16,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#d5d5d5",
    borderWidth: 1,
  },
  matchTeams: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  matchScores: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  matchFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#efefef",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 4,
  },
  matchTime: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "bold",
  },
  matchStatus: {
    fontSize: 12,
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    fontWeight: "bold",
  },
  teams: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  teamsImage: {
    borderRadius: 99,
    width: 60,
    height: 60,
  },
  matchCountDown: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#ffeaea",
    borderRadius: 16,
    color: "red",
    fontWeight: 600,
  },
  singleTeams: {
    display: "flex",
    flexDirection: "col",
    alignItems: "center",
    fontWeight: "600",
  },
});
