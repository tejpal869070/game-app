// import React, { useEffect, useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Animated,
//   ActivityIndicator,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import { Audio } from "expo-av";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/FontAwesome5";

// // Mock API functions (replace with your actual API calls)
// const GetUserDetails = async () => {
//   try {
//     const storedWallet = await AsyncStorage.getItem("game_wallet");
//     return {
//       data: {
//         user: {
//           game_wallet: storedWallet ? parseFloat(storedWallet) : 1000, // Default wallet balance
//         },
//       },
//     };
//   } catch (error) {
//     return null;
//   }
// };

// const MinesGameUpdateWallet = async (formData) => {
//   const { type, amount } = formData;
//   try {
//     const storedWallet = await AsyncStorage.getItem("game_wallet");
//     let currentWallet = storedWallet ? parseFloat(storedWallet) : 1000;
//     if (type === "deduct") {
//       currentWallet -= amount;
//     } else if (type === "add") {
//       currentWallet += amount;
//     }
//     await AsyncStorage.setItem("game_wallet", currentWallet.toString());
//     return true;
//   } catch (error) {
//     throw new Error("Failed to update wallet");
//   }
// };

// // Placeholder for GameHistory component
// const GameHistory = ({ type, refreshHistory }) => (
//   <View style={styles.gameHistory}>
//     <Text style={styles.gameHistoryText}>Game History Placeholder</Text>
//   </View>
// );

// export default function CoinFlip() {
//   const [amount, setAmount] = useState(10);
//   const [refreshHistory, setRefreshHistory] = useState(false);
//   const [selected, setSelected] = useState("heads");
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [user, setUser] = useState({});
//   const [isWon, setWon] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [flipResult, setFlipResult] = useState(null);
//   const [flipping, setFlipping] = useState(false);

//   const amountRef = useRef(amount);
//   const spinValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     amountRef.current = amount;
//   }, [amount]);

//   const doubleTheAmount = () => {
//     if (amountRef.current * 2 > totalBalance) {
//       setAmount(totalBalance);
//     } else {
//       setAmount((prev) => prev * 2);
//     }
//   };

//   const flipCoin = async () => {
//     Toast.hide();
//     setProcessing(true);
//     if (amount < 1 || isNaN(amount)) {
//       Toast.show({ type: "error", text1: "Minimum bet amount is $1" });
//       setProcessing(false);
//       return;
//     } else if (!selected) {
//       Toast.show({ type: "error", text1: "Please select a side" });
//       setProcessing(false);
//       return;
//     } else if (amount > totalBalance) {
//       Toast.show({
//         type: "error",
//         text1: "Insufficient Balance",
//         text2: "Please recharge your game wallet",
//       });
//       setProcessing(false);
//       return;
//     }

//     const updateWallet = await updateWalletBalance("deduct", amountRef.current);
//     if (updateWallet) {
//       Toast.show({ type: "success", text1: "Bet Placed" });
//       const { sound } = await Audio.Sound.createAsync(
//         require("../assets/photos/coin-flip-2.mp3")
//       );
//       await sound.playAsync();
//       flipFunction();
//       setProcessing(false);
//     }
//     setProcessing(false);
//   };

//   const flipFunction = () => {
//     setFlipping(true);
//     setFlipResult(null);
//     spinValue.setValue(0); // Reset animation value

//     // Animate coin flip (3 full rotations = 1080 degrees)
//     Animated.timing(spinValue, {
//       toValue: 3, // 3 full rotations
//       duration: 2000, // 1.5 seconds
//       useNativeDriver: true,
//     }).start(() => {
//       setFlipping(false);
//       const result = Math.random() < 0.5 ? "heads" : "tails";
//       setFlipResult(result);
//       successFunction(result);
//     //   setTimeout(() => {
//     //     setFlipResult(null);
//     //   }, 3000); // Show result for 3 seconds
//     });
//   };

//   const successFunction = async (result) => {
//     Toast.hide();
//     const { sound } = await Audio.Sound.createAsync(
//       require("../assets/photos/coin-game-win.mp3")
//     );
//     await sound.playAsync();
//     if (selected === result) {
//       setWon(true);
//       await updateWalletBalance("add", amountRef.current * 2);
//     } else {
//       setWon(false);
//     }
//   };

//   const updateWalletBalance = async (type, amount) => {
//     const formData = { type, amount, game_type: "Coin Flip" };
//     try {
//       await MinesGameUpdateWallet(formData);
//       return true;
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: error.message || "Internal Server Error!",
//       });
//       return false;
//     } finally {
//       userDataGet();
//       refreshHistoryFunction();
//     }
//   };

//   const refreshHistoryFunction = () => {
//     setRefreshHistory((prev) => !prev);
//   };

//   const userDataGet = async () => {
//     const response = await GetUserDetails();
//     if (response !== null) {
//       setUser(response?.data?.user);
//       setTotalBalance(Number(response?.data?.user?.game_wallet));
//     } else {
//       Toast.show({ type: "error", text1: "Failed to load user data" });
//     }
//   };

//   useEffect(() => {
//     userDataGet();
//   }, []);

//   // Coin flip animation interpolation
//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   return (
//     <View style={styles.container}>
//       <Toast />
//       <View style={styles.mainContent}>
//         {/* Left Panel (Controls) */}
//         <View style={styles.leftPanel}>
//           <View style={styles.betSection}>
//             <View style={styles.betHeader}>
//               <Text style={styles.label}>Bet Amount</Text>
//               <Text style={styles.balance}>${totalBalance.toFixed(2)}</Text>
//             </View>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Amount"
//                 placeholderTextColor="#9ca3af"
//                 value={amount.toString()}
//                 onChangeText={(text) => setAmount(Number(text))}
//                 keyboardType="numeric"
//                 editable={!flipping}
//               />
//               <View style={styles.adjustButtons}>
//                 <TouchableOpacity
//                   style={styles.adjustButton}
//                   onPress={() => {
//                     if (amount > 1) {
//                       setAmount((prev) => prev / 2);
//                     } else {
//                       setAmount(1);
//                     }
//                   }}
//                 >
//                   <Text style={styles.adjustButtonText}>1/2</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.adjustButton, styles.adjustButtonBorderLeft]}
//                   onPress={doubleTheAmount}
//                 >
//                   <Text style={styles.adjustButtonText}>2x</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <Text style={styles.label}>Choose</Text>
//             <View style={styles.choiceContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.choiceButton,
//                   styles.choiceButtonLeft,
//                   selected === "heads" && styles.selectedButton,
//                 ]}
//                 onPress={() => setSelected("heads")}
//                 disabled={flipping}
//               >
//                 <Text style={styles.buttonText}>Heads</Text>
//                 <Icon name="bitcoin" size={16} color="#ffa200" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.choiceButton,
//                   styles.choiceButtonRight,
//                   selected === "tails" && styles.selectedButton,
//                 ]}
//                 onPress={() => setSelected("tails")}
//                 disabled={flipping}
//               >
//                 <Text style={styles.buttonText}>Tails</Text>
//                 <Icon name="square" size={16} color="#ffa200" />
//               </TouchableOpacity>
//             </View>
//             {flipping ? (
//               <View style={styles.flipButton}>
//                 <ActivityIndicator size="small" color="#3b82f6" />
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={styles.flipButton}
//                 onPress={flipCoin}
//                 disabled={flipping || processing}
//               >
//                 <Text style={styles.flipButtonText}>FLIP COIN</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Right Panel (Coin Display) */}
//         <View style={[styles.rightPanel, { backgroundColor: "#0f212e" }]}>
//           <View style={styles.coinContainer}>
//             {flipResult !== null ? (
//               <Image
//                 source={
//                   flipResult === "heads"
//                     ? require("../assets/photos/heads.png")
//                     : require("../assets/photos/tails.png")
//                 }
//                 style={[
//                   styles.coinImage,
//                   { shadowColor: "gold", shadowRadius: 47 },
//                 ]}
//               />
//             ) : flipping ? (
//               <Animated.View
//                 style={{
//                   transform: [
//                     { perspective: 1000 }, // Add 3D perspective
//                     { rotateY: spin },
//                   ],
//                 }}
//               >
//                 <Image
//                   source={require("../assets/photos/heads.png")}
//                   style={styles.coinImage}
//                 />
//               </Animated.View>
//             ) : (
//               <Image
//                 source={require("../assets/photos/heads.png")}
//                 style={styles.coinImage}
//               />
//             )}
//           </View>
//           <View style={styles.resultContainer}>
//             <Image
//               source={require("../assets/photos/coin-flip-win.png")}
//               style={styles.resultImage}
//             />
//             {/* {flipResult === null ? (
//               <View style={styles.resultTextContainer}>
//                 <Icon
//                   name="bitcoin"
//                   size={24}
//                   color="#fff"
//                   style={styles.spinningIcon}
//                 />
//               </View>
//             ) : (
//               <View style={styles.resultTextContainer}>
//                 <Text
//                   style={[
//                     styles.resultText,
//                     isWon ? styles.wonText : styles.lostText,
//                   ]}
//                 >
//                   ${isWon ? (amount * 2).toFixed(2) : amount.toFixed(2)}
//                 </Text>
//               </View>
//             )} */}
//           </View>
//         </View>
//       </View>

//       {/* Game History */}
//       <View style={styles.gameHistoryContainer}>
//         <GameHistory type="Coin Flip" refreshHistory={refreshHistory} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   mainContent: {
//     flexDirection: "row",
//     flexWrap: "wrap-reverse",
//     marginHorizontal: "auto",
//     maxWidth: 1000,
//     width: "100%",
//   },
//   leftPanel: {
//     width: "100%",
//     padding: 24,
//     backgroundColor: "#213743",
//     minHeight: 300,
//   },
//   rightPanel: {
//     width: "100%",
//     padding: 24,
//     minHeight: 400,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   betSection: {
//     flex: 1,
//   },
//   betHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 12,
//     color: "#d1d5db",
//     和尚fontWeight: "500",
//   },
//   balance: {
//     fontSize: 12,
//     color: "#d1d5db",
//     fontWeight: "500",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   input: {
//     flex: 1,
//     borderRadius: 4,
//     borderWidth: 2,
//     borderColor: "#2f4553",
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     fontWeight: "600",
//     backgroundColor: "#0f212e",
//     color: "#f3f4f6",
//     fontSize: 14,
//   },
//   adjustButtons: {
//     flexDirection: "row",
//     position: "absolute",
//     right: 2,
//   },
//   adjustButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     backgroundColor: "#6b7280",
//   },
//   adjustButtonBorderLeft: {
//     borderLeftWidth: 2,
//     borderLeftColor: "#d1d5db",
//   },
//   adjustButtonText: {
//     color: "#d1d5db",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   choiceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 4,
//   },
//   choiceButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 8,
//     backgroundColor: "#1f2937",
//     marginHorizontal: 2,
//   },
//   choiceButtonLeft: {
//     borderTopLeftRadius: 4,
//     borderBottomLeftRadius: 4,
//   },
//   choiceButtonRight: {
//     borderTopRightRadius: 4,
//     borderBottomRightRadius: 4,
//   },
//   selectedButton: {
//     backgroundColor: "#6366f1",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonText: {
//     color: "#d1d5db",
//     fontSize: 14,
//     fontWeight: "500",
//     marginRight: 8,
//   },
//   flipButton: {
//     width: "100%",
//     borderRadius: 4,
//     backgroundColor: "#20e701",
//     paddingVertical: 8,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   flipButtonText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#000",
//   },
//   coinContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     height: "100%",
//   },
//   coinImage: {
//     width: 160,
//     height: 160,
//     backfaceVisibility: "hidden", // Helps with 3D effect
//   },
//   resultContainer: {
//     position: "absolute",
//     bottom: "10%",
//     alignItems: "center",
//     width: "100%",
//   },
//   resultImage: {
//     width: 160,
//     height: 40,
//   },
//   resultTextContainer: {
//     width: "82%",
//     paddingVertical: 4,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//     alignItems: "center",
//   },
//   resultText: {
//     fontSize: 24,
//     fontWeight: "700",
//   },
//   wonText: {
//     color: "#20e701",
//   },
//   lostText: {
//     color: "#ef4444",
//   },
//   spinningIcon: {
//     // Animation handled by native driver
//   },
//   gameHistoryContainer: {
//     marginHorizontal: "auto",
//     marginTop: 24,
//     maxWidth: 1000,
//     width: "100%",
//   },
//   gameHistory: {
//     padding: 16,
//     backgroundColor: "#1f2937",
//     borderRadius: 8,
//   },
//   gameHistoryText: {
//     color: "#d1d5db", 
//     textAlign: "center",
//   },
// });


import React from 'react'
import { Text, View } from 'react-native'

export default function CoinFlip() {
  return (
    <View>
        <Text>hii</Text>
    </View>
  )
}
