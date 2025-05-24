import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.9;
const CENTER_SIZE = WHEEL_SIZE * 0.9; // Center circle size
const GAP_SIZE = 5; // Thin gap between segments and center

const WheelData = [
  {
    gameType: "low",
    colors: [
      { color: "#406C82", profit: 0.0, area: 33 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
      { color: "#406C82", profit: 0.0, area: 33 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
      { color: "#406C82", profit: 0.0, area: 33 },
      { color: "#1FE404", profit: 1.5, area: 32 },
      { color: "#D5E8F2", profit: 1.2, area: 35 },
    ],
  },
  {
    gameType: "medium",
    colors: [
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#D5E8F2", profit: 1.7, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#1FE404", profit: 1.5, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FDE902", profit: 2.0, area: 20 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#7F47FD", profit: 3.0, area: 32 },
      { color: "#406C82", profit: 0.0, area: 20 },
      { color: "#FCA330", profit: 4.0, area: 20 },
    ],
  },
  {
    gameType: "high",
    colors: [
      { color: "#406C82", profit: 0.0, area: 91 },
      { color: "#FC1244", profit: 9.9, area: 9 },
    ],
  },
];

const Wheel = () => {
  const [walletBalance, setWalletBalance] = useState(5614.52);
  const [betAmount, setBetAmount] = useState("10");
  const [riskLevel, setRiskLevel] = useState("low");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const spinValue = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  const spinWheel = () => {
    if (isSpinning) return;
    const amount = parseFloat(betAmount);
    if (amount <= 0 || amount > walletBalance) {
      alert("Invalid bet amount or insufficient balance!");
      return;
    }

    setIsSpinning(true);
    setSelectedMultiplier(null);
    setWinAmount(0);
    setWalletBalance((prev) => prev - amount);

    const randomAngle = Math.floor(Math.random() * 360);
    const totalSpin = 1800 + randomAngle;

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: totalSpin,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const normalizedAngle = totalSpin % 360;
      const adjustedAngle = (normalizedAngle - 90 + 360) % 360;

      const colors = WheelData.find(
        (data) => data.gameType === riskLevel
      ).colors;
      const totalArea = colors.reduce((sum, seg) => sum + seg.area, 0);
      let cumulativeAngle = 0;
      let landedMultiplier = 0;
      let landedSegment = null;

      for (const segment of colors) {
        const angle = (segment.area / totalArea) * 360;
        cumulativeAngle += angle; 
        if (adjustedAngle <= cumulativeAngle) { 
          landedMultiplier = segment.profit;
          break;
        }
      }
 

      setSelectedMultiplier(landedMultiplier);
      const win = amount * landedMultiplier;
      setWinAmount(win);
      setWalletBalance((prev) => prev + win);
      setIsSpinning(false);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setSelectedMultiplier(null);
            setWinAmount(0);
          });
        }, 2000);
      });
    });
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const renderWheel = () => {
    const selectedData = WheelData.find((data) => data.gameType === riskLevel);
    const colors = selectedData.colors;
    const size = WHEEL_SIZE;
    const radius = size / 2;

    const totalArea = colors.reduce((sum, seg) => sum + seg.area, 0);
    let cumulativeAngle = 0;

    const slices = colors.map((segment, index) => {
      const angle = (segment.area / totalArea) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = radius + radius * Math.cos(startRad);
      const y1 = radius + radius * Math.sin(startRad);
      const x2 = radius + radius * Math.cos(endRad);
      const y2 = radius + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const d = `
      M ${radius} ${radius}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

      return <Path key={index} d={d} fill={segment.color} />;
    });

    return (
      <View style={styles.wheelContainer}>
        <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
          <Svg width={size} height={size}>
            {slices}
          </Svg>
        </Animated.View>
        <View style={styles.wheelCenter}>
          {selectedMultiplier ? (
            <Image
              source={require("../assets/photos/winGif3.webp")}
              style={{ width: 300, height: 300, borderRadius: 9999 }}
            />
          ) : (
            <Image
              source={require("../assets/photos/logo.png")}
              style={{ width: 200, height: 100 }}
            />
          )}
        </View>
        <View style={styles.pinContainer}>
          <Text style={styles.crownIcon}>👑</Text>
          <View style={styles.pin} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1E3A8A", "#0F212E"]}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.wheelBoard}>{renderWheel()}</View>

          <View style={styles.multiplierRow}>
            {[
              ...new Set(
                WheelData.find(
                  (data) => data.gameType === riskLevel
                ).colors.map((s) => s.profit)
              ),
            ]
              .sort((a, b) => a - b)
              .map((profit, index) => {
                const segment = WheelData.find(
                  (data) => data.gameType === riskLevel
                ).colors.find((s) => s.profit === profit);
                return (
                  <View
                    key={index}
                    style={[
                      styles.multiplierBox,
                      { backgroundColor: "#2F4553" },
                    ]}
                  >
                    <Text style={styles.multiplierText}>
                      {profit.toFixed(2)}x
                    </Text>

                    <View
                      style={[
                        styles.multiplierHighlight,
                        { backgroundColor: segment.color },
                      ]}
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>

        <View style={styles.fixedControls}>
          <TouchableOpacity
            style={[styles.betButton, isSpinning && styles.disabledButton]}
            onPress={spinWheel}
            disabled={isSpinning}
          >
            <Text style={styles.betButtonText}>Bet</Text>
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Bet Amount</Text>
            <Text style={styles.balance}>${walletBalance.toFixed(2)}</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={betAmount}
              onChangeText={setBetAmount}
              keyboardType="numeric"
              editable={!isSpinning}
            />
            <View style={styles.amountButtons}>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() =>
                  setBetAmount((prev) => (parseFloat(prev) / 2).toString())
                }
                disabled={isSpinning}
              >
                <Text style={styles.amountButtonText}>1/2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() =>
                  setBetAmount((prev) => (parseFloat(prev) * 2).toString())
                }
                disabled={isSpinning}
              >
                <Text style={styles.amountButtonText}>2x</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Risk</Text>
          <Picker
            selectedValue={riskLevel}
            style={styles.picker}
            onValueChange={(itemValue) => setRiskLevel(itemValue)}
            enabled={!isSpinning}
          >
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="High" value="high" />
          </Picker>

          <View style={styles.modeButtons}>
            <TouchableOpacity style={[styles.modeButton, styles.activeMode]}>
              <Text style={styles.modeButtonText}>Manual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton}>
              <Text style={styles.modeButtonText}>Auto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedMultiplier !== null && (
          <Animated.View style={[styles.resultOverlay, { opacity: fadeAnim }]}>
            <View style={styles.resultBox}>
              <Text
                style={[
                  styles.resultMultiplier,
                  {
                    color: WheelData.find(
                      (data) => data.gameType === riskLevel
                    ).colors.find((s) => s.profit === selectedMultiplier).color,
                  },
                ]}
              >
                {selectedMultiplier}x
              </Text>
              <Text
                style={[
                  styles.resultAmount,
                  winAmount > 0 ? styles.win : styles.loss,
                ]}
              >
                {winAmount > 0
                  ? `+$${winAmount.toFixed(2)}`
                  : `-$${parseFloat(betAmount).toFixed(2)}`}
              </Text>
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  wheelBoard: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  wheelContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: "hidden",
    position: "relative",
  },
  wheelCenter: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    backgroundColor: "#0F212E",
    borderRadius: CENTER_SIZE / 2,
    position: "absolute",
    top: (WHEEL_SIZE - CENTER_SIZE) / 2,
    left: (WHEEL_SIZE - CENTER_SIZE) / 2,
    borderWidth: GAP_SIZE,
    borderColor: "transparent", // Transparent gap
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pinContainer: {
    position: "absolute",
    top: -60,
    alignItems: "center",
    zIndex: 5,
  },
  crownIcon: {
    fontSize: 30,
    color: "#FFD700",
  },
  pin: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFD700",
  },
  multiplierRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  multiplierBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    position: "relative",
    overflow: "hidden",
    minWidth: 60,
    alignItems: "center",
  },
  multiplierText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  multiplierHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  controls: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  betButton: {
    backgroundColor: "#20e701",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  betButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  balance: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#2F4553",
    color: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    fontSize: 16,
  },
  amountButtons: {
    flexDirection: "row",
    gap: 5,
  },
  amountButton: {
    backgroundColor: "#2F4553",
    padding: 10,
    borderRadius: 5,
    minWidth: 40,
    alignItems: "center",
  },
  amountButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#2F4553",
    color: "#FFF",
    borderRadius: 5,
    marginBottom: 15,
  },
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#666",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeMode: {
    backgroundColor: "#1E90FF",
  },
  modeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  resultBox: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  resultMultiplier: {
    fontSize: 40,
    fontWeight: "bold",
  },
  resultAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  win: {
    color: "#13b70a",
  },
  loss: {
    color: "#FF0000",
  },
  scrollContainer: {
    paddingBottom: 250, // enough to scroll without hiding behind controls
  },

  fixedControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#0F212E", // background for contrast
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  celebrationGif: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width / 2,
    height: height / 2,
    backgroundColor: "black",
  },
});

export default Wheel;
