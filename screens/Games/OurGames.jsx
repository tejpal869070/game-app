import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";

export default function OurGames() {
  const games = [
    { id: "1", image: require("../../assets/photos/coin-flip.png") },
    { id: "2", image: require("../../assets/photos/dragon.png") },
    { id: "3", image: require("../../assets/photos/limbo.png") },
    { id: "4", image: require("../../assets/photos/minesgme.png") },
    { id: "5", image: require("../../assets/photos/wheel.png") },
    { id: "6", image: require("../../assets/photos/cricket.png") },
  ];

  const GameCard = ({ items }) => {
    return (
      <View style={styles.gameCard}>
        <Image source={items.image} style={styles.gameImage} />
      </View>
    );
  };

  return (
    <View style={styles.gameContainer}>
      {games.map((item, index) => (
        <GameCard items={item} key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    marginTop : 4,
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
  },
});
