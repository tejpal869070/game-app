import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
  Pressable,
} from "react-native";
import Toast from "react-native-toast-message";

import headsImage from "../assets/photos/heads.png";
import tailsImage from "../assets/photos/tails.png";
import bg1 from "../assets/photos/bg5.jpg";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function CoinFlip() {
  const [amount, setAmount] = useState(10);
  const [totalBalance, setTotalBalance] = useState(100);
  const [selected, setSelected] = useState("heads");
  const [flipResult, setFlipResult] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [displayedSide, setDisplayedSide] = useState("heads");

  const [pressed, setPressed] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;

  // Smooth visual update for displayed side during flip
  useEffect(() => {
    const id = rotation.addListener(({ value }) => {
      const deg = (value * 360) % 360;
      setDisplayedSide(deg < 180 ? "heads" : "tails");
    });
    return () => rotation.removeListener(id);
  }, [rotation]);

 const flipCoin = () => {
  if (amount < 1 || isNaN(amount)) {
    Toast.show({ type: "error", text1: "Minimum bet is $1" });
    return;
  }
  if (!selected) {
    Toast.show({ type: "error", text1: "Please select a side" });
    return;
  }
  if (amount > totalBalance) {
    Toast.show({ type: "error", text1: "Insufficient Balance" });
    return;
  }

  setFlipping(true);
  setFlipResult(null);

  const spins = 6;
  const result = Math.random() < 0.5 ? "heads" : "tails";
  const finalAngle = result === "heads" ? 0 : 180;
  const targetRotation = (spins * 360 + finalAngle) / 360;

  Animated.timing(rotation, {
    toValue: targetRotation,
    duration: 2500,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false,
  }).start(() => {
    setFlipResult(result);
    setDisplayedSide(result); // ✅ Ensure final image matches result

    if (result === selected) {
      setIsWon(true);
      setTotalBalance((prev) => prev + amount);
      Toast.show({ type: "success", text1: `You Win! +$${amount}` });
    } else {
      setIsWon(false);
      setTotalBalance((prev) => prev - amount);
      Toast.show({ type: "error", text1: `You Lose -$${amount}` });
    }

    rotation.setValue(0); // Reset for next flip
    setFlipping(false);
  });
};


  const fullRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
 

  return (
    <View style={styles.container}>
      <Toast />
      <Image source={bg1} style={styles.bgImage} />

      <View style={styles.coinArea}>
        <Animated.View
          style={[
            styles.coinContainer,
            {
              transform: [{ perspective: 1000 }, { rotateY: fullRotation }],
            },
          ]}
        >
          {flipResult ? (
            <Image
              source={displayedSide === flipResult ? headsImage : tailsImage}
              style={styles.coinFace}
            />
          ) : (
            <Image
              source={displayedSide === "heads" ? headsImage : tailsImage}
              style={styles.coinFace}
            />
          )}
        </Animated.View>

        {/* {flipResult && (
          <Text
            style={[styles.resultText, { color: isWon ? "#20e701" : "red" }]}
          >
            {isWon ? `You Win! +$${amount}` : `You Lose -$${amount}`}
          </Text>
        )} */}
      </View>

      <View style={styles.controls}>
        <Text style={styles.label}>Bet Amount</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={styles.input}
            value={String(amount)}
            onChangeText={(text) => setAmount(Number(text))}
            keyboardType="numeric"
            editable={!flipping}
          />

          <View style={[styles.buttonRow, { width: "30%" }]}>
            <TouchableOpacity
              onPress={() => setAmount(Math.max(1, Math.floor(amount / 2)))}
              style={styles.smallButton}
            >
              <Text style={styles.buttonText}>1/2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAmount(Math.min(amount * 2, totalBalance))}
              style={styles.smallButton}
            >
              <Text style={styles.buttonText}>2x</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Select Side:</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => setSelected("heads")}
            disabled={flipping}
            style={[
              styles.sideButton,
              selected === "heads" && styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>Heads</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected("tails")}
            disabled={flipping}
            style={[
              styles.sideButton,
              selected === "tails" && styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>Tails</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            GlobalStyle.buttonContainer,
            { width: "80%", marginTop: 20, margin: "auto" },
          ]}
        >
          <Pressable
            onPressIn={() => {
              setPressed(true);
              flipCoin();
            }}
            disabled={flipping}
            onPressOut={() => setPressed(false)}
            style={[
              GlobalStyle.buttonTop,
              pressed && { transform: [{ translateY: 6 }] },
            ]}
          >
            <Text style={[GlobalStyle.buttonText, { fontSize: 20 }]}>
              {flipping ? "Flipping..." : "Flip Coin"}
            </Text>
          </Pressable>
          <View style={GlobalStyle.buttonBottom} />
          <View style={GlobalStyle.buttonBase} />
        </View>
      </View>

      {/* wallet */}
      <View style={styles.wallet}>
        <Ionicons name="wallet" size={24} color="black" />
        <Text style={{ fontWeight: "bold" }}>
          ₹{Number(totalBalance).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f212e" },
  bgImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coinArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  coinContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  coinFace: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  resultText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  controls: {
    backgroundColor: "#0f212e",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  label: { color: "#fff", fontSize: 16, marginVertical: 8 },
  input: {
    backgroundColor: "#0f212e",
    color: "#fff",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4a90e2",
    marginBottom: 8,
    width: "65%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  smallButton: {
    backgroundColor: "#555",
    padding: 8,
    borderRadius: 4,
    flex: 0.48,
    alignItems: "center",
  },
  sideButton: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 4,
    flex: 0.48,
    alignItems: "center",
  },
  activeButton: { backgroundColor: "#4a90e2" },
  flipButton: {
    backgroundColor: "#20e701",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  wallet: {
    position: "absolute",
    top: 60,
    right: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
});
