import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Sample leaderboard data
const leaderboardData = [
  {
    rank: 2,
    username: "a_dimitrios",
    score: 524,
    isTop: true,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    rank: 1,
    username: "joshi186",
    score: 845,
    isTop: true,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    rank: 3,
    username: "tata1962",
    score: 514,
    isTop: true,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    rank: 4,
    username: "dillbahar_ullah",
    score: 522,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    rank: 5,
    username: "Foad6666",
    score: 508,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    rank: 6,
    username: "manishbaghe13697",
    score: 86,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    rank: 7,
    username: "dillbahar_ullah",
    score: 522,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    rank: 8,
    username: "Foad6666",
    score: 508,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    rank: 9,
    username: "manishbaghe13697",
    score: 86,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    rank: 10,
    username: "Foad6666",
    score: 508,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const VipScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Current Game");

  // Render top 3 players
  const renderTopThree = () => {
    const topThree = leaderboardData.filter((item) => item.isTop);
    return (
      <View style={styles.topThreeContainer}>
        {topThree.map((item) => (
          <View key={item.rank} style={styles.topPlayer}>
            <Image
              source={{ uri: item.avatar }}
              style={[
                styles.topAvatar,
                {
                  width: item.rank === 1 ? 120 : 60,
                  height: item.rank === 1 ? 120 : 60,
                },
              ]}
            />

            {item.rank === 1 && (
              <Image
                source={{
                  uri: "https://img.icons8.com/emoji/48/crown-emoji.png",
                }}
                style={styles.crown}
              />
            )}
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>{item.score}k</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render other players
  const renderItem = ({ item }) => {
    if (item.isTop) return null; // Skip top 3 players
    return (
      <View style={styles.listItem}>
        <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
        <View style={styles.listTextContainer}>
          <Text style={styles.listUsername}>{item.username}</Text>
          <Text style={styles.listScore}>{item.score}</Text>
        </View>
        <Text style={styles.listRank}>{item.rank}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>LEADERBOARD</Text>
        </View>

        {/* Top 3 Section */}
        {renderTopThree()}

        <Image
          alt="banner"
          style={styles.banner}
          source={require("../assets/photos/prise3.jpg")}
        />

        {/* FlatList for remaining ranks */}
        <FlatList
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={(item) => item.rank.toString()}
          scrollEnabled={false} // Disable FlatList scrolling to allow ScrollView to handle it
          contentContainerStyle={styles.flatListContent}
        />
        {/* your position */}
        <Text style={styles.myPosition}>Your Position</Text>
        <View
          style={[
            styles.listItem,
            { marginHorizontal: 14, borderWidth: 2, borderColor: "white" },
          ]}
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/3.jpg" }}
            style={styles.listAvatar}
          />
          <View style={styles.listTextContainer}>
            <Text style={styles.listUsername}>Me</Text>
            <Text style={styles.listScore}>504k</Text>
          </View>
          <Text style={[styles.listRank, { width : 60}]}>555</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backArrow: {
    color: "#fff",
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#f5a623",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    marginVertical: 20,
    alignItems: "baseline",
  },
  topPlayer: {
    alignItems: "center",
  },
  topAvatar: {
    width: 80,
    height: 80,
    borderRadius: 6000,
    borderWidth: 2,
    borderColor: "#f5a623",
  },
  crown: {
    width: 60,
    height: 60,
    position: "absolute",
    top: -30,
  },
  rank: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  score: {
    color: "#f5a623",
    fontSize: 16,
    fontWeight: "bold",
  },
  allTime: {
    color: "#888",
    fontSize: 14,
  },
  flatListContent: {
    paddingHorizontal: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a3d",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  listRank: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#ffd154",
    width: 40,
    height: 40,
    display: "flex",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10000,
    textAlign: "center",
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  listTextContainer: {
    flex: 1,
  },
  listUsername: {
    color: "#fff",
    fontSize: 16,
  },
  listScore: {
    color: "#f5a623",
    fontSize: 14,
  },
  banner: {
    width: "95%",
    margin: "auto",
    height: 150,
    marginBottom: 20,
    borderRadius: 8,
  },
  myPosition: {
    color: "white",
    marginLeft : 14
  },
});

export default VipScreen;
