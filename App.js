import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartingPage from "./screens/StartingPage";
import AuthSelectionPage from "./screens/AuthSelectionPage";
import MainApp from "./navigation/MainApp";
import GameScreen from "./screens/GameScreen";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import DepositScreen from "./Componentes/DepositScreen";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native";
import OurGames from "./screens/Games/OurGames";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import GiveAwayScreen from "./screens/GiveAwayScreen";
import ForgotPasswordScreen from "./screens/User/ForgotPasswordScreen";
import MatchDetail from "./screens/Match/MatchDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Toast />
      <Stack.Navigator initialRouteName="Starting">
        <Stack.Screen
          name="Starting"
          component={StartingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthSelection"
          component={AuthSelectionPage}
          options={{ title: "Authentication" }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ title: "Game", headerShown: false }}
        />
        <Stack.Screen
          name="MatchDetail"
          component={MatchDetail}
          options={{ title: "MatchDetail", headerShown: false }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyPolicyScreen}
          options={{ title: "Privacy Policy", headerShown: false }}
        />
        <Stack.Screen
          name="Giveaway"
          component={GiveAwayScreen}
          options={{ title: "Privacy Policy", headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
