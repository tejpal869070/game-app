import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import WalletScreen from "../screens/WalletScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { styles } from "../styles/Styles";
import DepositScreen from "../Componentes/DepositScreen";
import OurGames from "../screens/Games/OurGames";
import VipScreen from "../screens/VipScreen";

const Tab = createBottomTabNavigator();

const InPlayButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={Customstyles.inPlayButtonContainer}
    onPress={onPress}
  >
    <View style={Customstyles.inPlayButton}>
      {/* <Ionicons name="game-controller-outline" size={28} color="#fff" /> */}
      <Image
        source={require("../assets/photos/cricket (2).png")}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  </TouchableOpacity>
);

export default function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Wallet") iconName = "wallet";
          else if (route.name === "Profile") iconName = "settings";
          else if (route.name === "VIP") iconName = "diamond";
          else if (route.name === "InPlay")
            iconName = "game-controller-outline"; // backup if icon shown

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="VIP" component={VipScreen} />

      <Tab.Screen
        name="InPlay"
        component={OurGames}
        options={{
          tabBarButton: (props) => <InPlayButton {...props} />,
        }}
      />

      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Customstyles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  tabBarLabel: {
    fontSize: 12,
    paddingBottom: 4,
  },
  inPlayButtonContainer: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  inPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
