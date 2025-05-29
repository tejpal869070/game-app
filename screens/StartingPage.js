import { StatusBar } from "expo-status-bar";
import { Text, View, ImageBackground, Image, StyleSheet } from "react-native";
import { styles } from "../styles/Styles";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { CheckToken } from "../Controllers/userController";

export default function StartingPage({ navigation }) {
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        await CheckToken();
        navigation.replace("MainApp");
      } catch (error) {
        console.error("Error checking token:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to verify authentication",
        });
        await AsyncStorage.removeItem("token"); // Clear token on error
        await AsyncStorage.removeItem("email");
        navigation.replace("Login");
      }
    };

    const timer = setTimeout(() => {
      checkTokenAndRedirect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const data = [
    {
      id: 1,
      title: "100% Secure",
      img: require("../assets/photos/credit-card.png"),
    },
    {
      id: 3,
      title: "Crypto Withdrawal",
      img: require("../assets/photos/bitcoin.png"),
    },
    {
      id: 2,
      title: "Bonus Reward",
      img: require("../assets/photos/gift-box.png"),
    },
    { id: 3, title: "Easy Payment", img: require("../assets/photos/bank.png") },
  ];

  return (
    <ImageBackground
      source={require("../assets/photos/bg1.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("../assets/photos/logo.png")}
          style={Customstyles.logo}
        />
        <Text style={[styles.title, { textAlign: "center" }]}>
          Welcome to Sneak Booker!
        </Text>
        <View style={Customstyles.features}>
          {data.map((item, index) => (
            <View key={index} style={Customstyles.featureCard}>
              <Image source={item.img} style={Customstyles.featureImage} />
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  color: "#212020",
                  fontSize: 12,
                }}
              >
                {item.title.replace(" ", "\n")}
              </Text>
            </View>
          ))}
        </View>
        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

// Define styles directly within the component
const Customstyles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain", // ensures logo doesn't stretch
    marginBottom: 20,
  },
  features: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 12,
    backgroundColor: "#ffffffe8",
    padding: 6,
    position  : "absolute",
    bottom : 0,
    width : "100%"
  },
  featureImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  featureCard: {
    display: "flex",
    flexDirection: "col",
    alignItems: "center",
    width: "25%",
  },
});
