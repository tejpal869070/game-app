import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartingPage from './screens/StartingPage';
import AuthSelectionPage from './screens/AuthSelectionPage';
import MainApp from './navigation/MainApp';
import GameScreen from './screens/GameScreen';
import Login from './screens/User/Login';
import Register from './screens/User/Register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          options={{ title: 'Authentication' }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ title: 'Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}