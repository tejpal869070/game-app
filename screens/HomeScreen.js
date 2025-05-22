import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  // Sample data for each section
  const topSections = [
    { id: "1", title: "JetX", icon: require("../assets/photos/air-force.png") },
    {
      id: "2",
      title: "Sports",
      icon: require("../assets/photos/football.png"),
    },
    {
      id: "3",
      title: "Live Casino",
      icon: require("../assets/photos/casino.png"),
    },
    {
      id: "4",
      title: "Evolution",
      icon: require("../assets/photos/herbal.png"),
    },
    {
      id: "5",
      title: "Casino",
      icon: require("../assets/photos/casino-chip.png"),
    },
    {
      id: "6",
      title: "Aviator",
      icon: require("../assets/photos/aviator.png"),
    },
    {
      id: "7",
      title: "VIP Club",
      icon: require("../assets/photos/premium-quality.png"),
    },
    {
      id: "8",
      title: "Cricket",
      icon: require("../assets/photos/cricket (1).png"),
    },
  ];

  const liveCasino = [
    {
      id: "1",
      image: require("../assets/photos/casino1.jpg"),
    },
    {
      id: "2",
      image: require("../assets/photos/casino2.jpg"),
    },
    {
      id: "3",
      image: require("../assets/photos/casino3.jpg"),
    },
  ];

  const sports = [
    {
      id: "1",
      title: "Cricket",
      icon: require("../assets/photos/cricket (1).png"),
    },

    {
      id: "3",
      title: "Ecricket",
      icon: require("../assets/photos/cricket-helmet.png"),
    },
    {
      id: "4",
      title: "Basketball",
      icon: require("../assets/photos/basketball-hoop.png"),
    },
    { id: "5", title: "Tennis", icon: require("../assets/photos/tennis.png") },
    {
      id: "2",
      title: "Football",
      icon: require("../assets/photos/football.png"),
    },
  ];

  const games = [
    {
      id: "1",
      icon: require("../assets/photos/coin-flip.png"),
      gameName: "coinFlip",
    },
    {
      id: "2",
      icon: require("../assets/photos/dragon.png"),
      gameName: "dragonTower",
    },
    {
      id: "3",
      icon: require("../assets/photos/limbo.png"),
      gameName: "limbo",
    },
    {
      id: "4",
      icon: require("../assets/photos/minesgme.png"),
      gameName: "mines",
    },
    {
      id: "5",
      icon: require("../assets/photos/wheel.png"),
      gameName: "wheel",
    },
    {
      id: "6",
      icon: require("../assets/photos/cricket.png"),
      gameName: "cricket",
    },
  ];

  // Render item for FlatList
  const renderGridItem = (item, size, isIcon = false) => (
    <TouchableOpacity style={[styles.gridItem, { width: size, height: size }]}>
      {isIcon ? (
        <Image source={item.icon} style={styles.icon} />
      ) : (
        <Image source={item.image} style={styles.gameImage} />
      )}
      {item.title && <Text style={styles.gridItemText}>{item.title}</Text>}
    </TouchableOpacity>
  );

  // Render item for FlatList
  const renderCasinoItem = (item, size, isIcon = false) => (
    <TouchableOpacity
      style={[styles.gridItem, { width: size, height: size / 1.5 }]}
    >
      {isIcon ? (
        <Image source={item.icon} style={styles.icon} />
      ) : (
        <Image source={item.image} style={styles.gameImage} />
      )}
      {item.title && <Text style={styles.gridItemText}>{item.title}</Text>}
    </TouchableOpacity>
  );

  // Render item for FlatList
  const renderGameItem = (item, size, isIcon = false) => (
    <TouchableOpacity
      style={[styles.gridItem, { width: size, height: size + 35 }]}
    >
      {isIcon ? (
        <Image source={item.icon} style={styles.gameIcon} />
      ) : (
        <Image source={item.image} style={styles.gameImage} />
      )}
      {item.title && <Text style={styles.gridItemText}>{item.title}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput style={styles.searchText} placeholder="Search..." />
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../assets/photos/banner1.png")}
            style={styles.bannerImage}
          />
        </View>

        {/* Top Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Sections</Text>
          <FlatList
            data={topSections}
            renderItem={({ item }) =>
              renderGridItem(item, width / 5 - 10, true)
            }
            keyExtractor={(item) => item.id}
            horizontal={true} // Makes the FlatList scroll horizontally
            showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
            scrollEnabled={true} // Allows scrolling
            contentContainerStyle={styles.flatListContainer}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Giveaway")}>
          <Image
            style={{
              width: "93%",
              height: 150,
              margin: "auto",
              borderRadius: 8,
              resizeMode: "cover",
              marginBottom: 16,
            }}
            source={require("../assets/photos/prise4.png")}
          />
        </TouchableOpacity>

        {/* Sports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sports</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>More Live Events &gt;</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sports}
            renderItem={({ item }) =>
              renderGridItem(item, width / 5 - 14, true)
            }
            keyExtractor={(item) => item.id}
            numColumns={5}
            scrollEnabled={false}
          />
        </View>

        {/* Live Casino */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Casino</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>More Live Dealers &gt;</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={liveCasino}
            renderItem={({ item }) => renderCasinoItem(item, width / 2 - 15)} // Adjust item size as needed
            keyExtractor={(item) => item.id}
            horizontal={true} // Makes the FlatList scroll horizontally
            showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
            scrollEnabled={true} // Allows scrolling
            contentContainerStyle={styles.flatListContainer} // Optional: to style the content container
          />
        </View>

        {/* Our games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Games</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>More Games &gt;</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={games}
            renderItem={({ item }) => renderGameItem(item, width / 3, true)}
            keyExtractor={(item) => item.id}
            horizontal={true} // Makes the FlatList scroll horizontally
            showsHorizontalScrollIndicator={false} // Optional: hides the scroll indicator
            scrollEnabled={true} // Allows scrolling
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 40,
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
  bannerContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 100,
  },
  bannerText: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 4,
  },
  moreText: {
    color: "#00c4ff",
    fontSize: 14,
  },
  gridItem: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#2a2a3e",
  },
  icon: {
    width: 40,
    height: 40,
  },
  gameIcon: {
    width: "100%",
    height: "100%",
  },
  gameImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  gridItemText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;
