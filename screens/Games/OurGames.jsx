import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OurGames({ navigation }) {
  const games = [
    {
      id: "1",
      image: require("../../assets/photos/coin-flip.png"),
      gameName: "coinFlip", 
    },
    {
      id: "2",
      image: require("../../assets/photos/dragon.png"),
      gameName: "dragonTower",
    },
    {
      id: "3",
      image: require("../../assets/photos/limbo.png"),
      gameName: "limbo",
    },
    {
      id: "4",
      image: require("../../assets/photos/minesgme.png"),
      gameName: "mines",
    },
    {
      id: "5",
      image: require("../../assets/photos/wheel.png"),
      gameName: "wheel",
    },
    {
      id: "6",
      image: require("../../assets/photos/cricket.png"),
      gameName: "cricket",
    },
  ];

  const GameCard = ({ items }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GameScreen", { gameName: items.gameName })
        }
        style={styles.gameCard}
      >
        <Image source={items.image} style={styles.gameImage} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput style={styles.searchText} placeholder="Search..." />
        </View>
        <ScrollView>
          <Image
            style={styles.topBanner}
            source={require("../../assets/photos/gaming.jpg")}
          />
          <View style={styles.gameContainer}>
            {games.map((item, index) => (
              <GameCard items={item} key={index} />
            ))}
          </View>
        </ScrollView>

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
});
