import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from '../styles/Styles';

export default function GameScreen({ route }) {
  const { gameName } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameName}</Text>
      <Text>Enjoy playing {gameName}!</Text>
      <StatusBar style="auto" />
    </View>
  );
}