import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Assets
const bg1 = require("../assets/photos/dragon-bg-3.jpg");
const eggImg = require("../assets/photos/egg.png");
const fireEgg = require("../assets/photos/fire-lgg.gif");
const dragonImg = require("../assets/photos/dragon1.png");

const { height: deviceHeight } = Dimensions.get("window");
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function DragonTower() {
  const [amount, setAmount] = useState(10);
  const [totalBalance, setTotalBalance] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState("easy");
  const [cols, setCols] = useState(4);
  const [openableTower, setOpenableTower] = useState(1);
  const [openedBoxes, setOpenedBoxes] = useState([]);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [isBombFound, setBombFound] = useState(false);
  const [profit, setProfit] = useState(1.0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const generateRandomNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
      numbers.push(Math.floor(Math.random() * cols) + 1);
    }
    setRandomNumbers(numbers);
  };

  const towerData = useMemo(() => {
    return rows
      .map((id, i) => ({
        towerID: id,
        bombID: randomNumbers[i],
      }))
      .reverse();
  }, [randomNumbers]);

  useEffect(() => {
    if (level === "easy") setCols(4);
    else if (level === "medium") setCols(3);
    else if (level === "hard") setCols(2);
  }, [level]);

  useEffect(() => {
    generateRandomNumbers();
  }, [cols]);

  const handleBet = () => {
    if (isNaN(amount) || amount < 10) {
      Toast.show({ type: "info", text1: "Minimum bet is $10" });
      return;
    }
    if (amount > totalBalance) {
      Toast.show({ type: "error", text1: "Insufficient balance" });
      return;
    }
    setTotalBalance((prev) => prev - amount);
    setIsPlaying(true);
    setOpenableTower(1);
    setBombFound(false);
    setOpenedBoxes([]);
    setProfit(1.0);
    Toast.show({ type: "success", text1: "Game Started!" });
  };

  const handleTowerClick = (item, boxIndex) => {
    if (item.bombID === boxIndex) {
      setBombFound(true);
      Toast.show({ type: "error", text1: "💣 Bomb! You lost!" });
      setOpenableTower(10); // Disable further input

      setTimeout(() => {
        setIsPlaying(false);
        generateRandomNumbers();
        setOpenedBoxes([]);
        setProfit(1.0);
        setBombFound(false);
      }, 3000);
      return;
    }

    setOpenedBoxes((prev) => [
      ...prev,
      { towerID: item.towerID, openedBox: boxIndex },
    ]);
    setOpenableTower(openableTower + 1);
    setProfit((prev) => Number((prev + 0.2).toFixed(2)));
  };

  const handleCashout = () => {
    if (openedBoxes.length === 0) {
      Toast.show({
        type: "info",
        text1: "Open at least one box before cashing out!",
      });
      return;
    }

    const profitAmount = amount * profit;
    setTotalBalance((prev) => prev + profitAmount);
    Toast.show({
      type: "success",
      text1: `🎉 You won $${profitAmount.toFixed(2)}!`,
    });

    setOpenableTower(10);
    setTimeout(() => {
      setIsPlaying(false);
      generateRandomNumbers();
      setOpenedBoxes([]);
      setProfit(1.0);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={bg1} style={styles.background}>
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => setSoundEnabled(!soundEnabled)}
        >
          <AntDesign
            name={soundEnabled ? "sound" : "closecircle"}
            size={20}
            color="white"
          />
        </TouchableOpacity>

        <Image source={dragonImg} style={styles.dragonImg} />

        <BlurView intensity={30} tint="light" style={styles.towerContainer}>
          {towerData.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array.from({ length: cols }).map((_, boxIndex) => {
                const isBoxOpened = openedBoxes.find(
                  (o) =>
                    o.towerID === item.towerID && o.openedBox === boxIndex + 1
                );

                return (
                  <TouchableOpacity
                    key={boxIndex}
                    style={[
                      styles.box,
                      {
                        width: `${100 / cols - 2}%`,
                        backgroundColor: isBoxOpened
                          ? "#00aaff"
                          : item.towerID === openableTower
                          ? "#20e701"
                          : "#213743",
                      },
                    ]}
                    disabled={!isPlaying || item.towerID !== openableTower}
                    onPress={() => handleTowerClick(item, boxIndex + 1)}
                  >
                    {isBombFound ? (
                      item.bombID === boxIndex + 1 ? (
                        <Image source={fireEgg} style={styles.egg} />
                      ) : (
                        <Image source={eggImg} style={styles.egg} />
                      )
                    ) : isBoxOpened ? (
                      <Image source={eggImg} style={styles.egg} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </BlurView>

        <View style={styles.panel}>
          <View style={styles.balanceRow}>
            <Text style={styles.label}>
              Balance: ${totalBalance.toFixed(2)}
            </Text>
            <Text style={styles.label}>Profit: x{profit.toFixed(2)}</Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              editable={!isPlaying}
              value={amount.toString()}
              onChangeText={(text) => {
                const num = Number(text);
                if (!isNaN(num) && num >= 0) setAmount(num);
              }}
            />

            <View style={[styles.buttonRow, { width: "30%" }]}>
              <TouchableOpacity
                style={styles.halfButton}
                onPress={() => setAmount((prev) => Math.max(1, prev / 2))}
                disabled={isPlaying}
              >
                <Text style={styles.buttonText}>1/2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doubleButton}
                onPress={() =>
                  setAmount((prev) => Math.min(prev * 2, totalBalance))
                }
                disabled={isPlaying}
              >
                <Text style={styles.buttonText}>2x</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Picker
            enabled={!isPlaying}
            selectedValue={level}
            onValueChange={(val) => setLevel(val)}
            style={styles.picker}
          >
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>

          {isPlaying ? (
            <TouchableOpacity style={styles.betButton} onPress={handleCashout}>
              <Text style={styles.betButtonText}>
                Cashout (${(amount * profit).toFixed(2)})
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.betButton} onPress={handleBet}>
              <Text style={styles.betButtonText}>Bet</Text>
            </TouchableOpacity>
          )}
        </View>

        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1 },
  towerContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  box: {
    height: Math.floor((deviceHeight - 300) / 13),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2f4553",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  egg: { width: 45, height: 45, resizeMode: "contain" },
  panel: {
    backgroundColor: "#213743",
    padding: 15,
    borderTopWidth: 2,
    borderColor: "#2f4553",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { color: "#fff", fontSize: 14 },
  input: {
    backgroundColor: "#0f212e",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2f4553",
    marginBottom: 10,
    width: "65%",
  },
  buttonRow: { flexDirection: "row", marginBottom: 10 },
  halfButton: {
    flex: 1,
    backgroundColor: "#2f4553",
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  doubleButton: {
    flex: 1,
    backgroundColor: "#2f4553",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  betButton: {
    backgroundColor: "#20e701",
    padding: 15,
    borderRadius: 5,
  },
  betButtonText: { color: "#000", textAlign: "center", fontWeight: "bold" },
  dragonImg: {
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  soundButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  picker: {
    width: "100%",
    backgroundColor: "#2f4553",
    marginBottom: 26,
    color: "white"
  },
});
