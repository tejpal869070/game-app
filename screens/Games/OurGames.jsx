import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { getAllMatch } from "../../Controllers/userController";
import Toast from "react-native-toast-message";
import { API } from "../../Controllers/API";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const images = [
  require("../../assets/photos/prise2.jpeg"),
  require("../../assets/photos/prise3.jpg"),
  require("../../assets/photos/prise4.png"),
];

const FormatDate = ({ date }) => {
  // Function to format the date
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj
      .toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "")
      .replace(":", ".");
  };

  return (
    <Text style={[styles.time, { textTransform: "capitalize" }]}>
      {formatDate(date)}
    </Text>
  );
};

// Sample filter functions

const MatchList = ({ matches, navigation, type }) => (
  <>
    {matches.length === 0 ? (
      <View
        style={{
          display: "flex",
          paddingTop: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          alt="no data"
          source={require("../../assets/photos/nodata.png")}
          style={{ width: 150, height: 150, margin: "auto" }}
        />
        <Text style={{ color: "white" }}>No {type} Match</Text>
      </View>
    ) : (
      <ScrollView style={{ marginTop: 30 }}>
        {matches.map((match, index) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MatchDetail", { matchId: match.id })
            }
            key={index}
            style={styles.matchCard}
          >
            <View style={{ padding: 10 }}>
              <Text style={styles.league}>|| {match.title} ||</Text>
              <View style={styles.matchRow}>
                <View style={styles.teamContainer}>
                  <Image
                    source={{
                      uri: `${API.url}assets/${match?.teams?.[0]?.image}`,
                    }}
                    style={styles.logo}
                    resizeMode="contain"
                  />

                  <Text style={styles.team}>
                    {match.teams[0].team_name.length > 4
                      ? match.teams[0].team_name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 4)
                      : match.teams[0].team_name}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormatDate date={match.match_time} />
                </View>
                <View style={styles.teamContainer}>
                  <Image
                    source={{
                      uri: `${API.url}assets/${match?.teams?.[1]?.image}`,
                    }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.team}>
                    {match.teams[1].team_name.length > 4
                      ? match.teams[1].team_name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 4)
                      : match.teams[1].team_name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.options}>Options</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}
  </>
);

export default function OurGames({ navigation }) {
  const [index, setIndex] = useState(0);
  const [MatchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [routes] = useState([
    { key: "UC", title: "Upcoming" },
    { key: "LIVE", title: "Live" },
    { key: "C", title: "Completed" },
  ]);

  const renderScene = SceneMap({
    UC: () => (
      <MatchList
        matches={filterMatches("UC")}
        navigation={navigation}
        type="Upcoming"
      />
    ),
    LIVE: () => (
      <MatchList
        matches={filterMatches("LIVE")}
        navigation={navigation}
        type="Live"
      />
    ),
    C: () => (
      <MatchList
        matches={filterMatches("C")}
        navigation={navigation}
        type="Completed"
      />
    ),
  });

  const fetchData = async () => {
    try {
      const response = await getAllMatch();
      setMatchData(response?.data?.reverse());
    } catch (error) {
      Toast.show("Please Try Again !");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newIndex) => {
    setIndex(newIndex);
    fetchData(); // Fetch fresh data on tab switch
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterMatches = (status) =>
    MatchData.filter((match) => match.status === status);

  const onRefresh = useCallback(() => {
    fetchData();
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
    <SafeAreaView style={styles.container}>
      <ScrollView
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        <Image
          alt="poster"
          source={require("../../assets/photos/ipl.jpg")}
          style={{ width: "100%", height: 170 }}
        />
        <View style={{ height: 700 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={handleTabChange}
            initialLayout={{ width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "#ff4444" }}
                style={{ backgroundColor: "#1a1a2e" }}
                labelStyle={{ color: "white", fontWeight: "bold" }}
              />
            )}
          />
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#1a1a2e",
    paddingTop: 40,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "fit",
  },
  gameContainer: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gameCard: {
    width: "32%",
    marginBottom: 8,
  },
  gameImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  topBanner: {
    width: "100%",
    height: 150,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3e",
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  searchText: {
    flex: 1,
    color: "red",
    marginLeft: 10,
    fontSize: 16,
    height: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  matchCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  league: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  teamContainer: {
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  team: {
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 16,
    color: "#03437d",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: "#afa7ff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  options: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    color: "#333",
  },
});
