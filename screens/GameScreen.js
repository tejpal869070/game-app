import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import CoinFLip from "../Games/CoinFlip";

export default function GameScreen({ route, navigation }) {
  const { gameName } = route.params;

  const renderGame = (gameName) => {
    switch (gameName) {
      case "coinFlip":
        return (
          <View style={styles.container}>
            <Text style={styles.noGameText}>Game "{gameName}" Not Found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.noGameText}>Game "{gameName}" Not Found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return renderGame(gameName);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#0f212e",
  },
  noGameText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    padding: 12,
    backgroundColor: "#20e701",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
