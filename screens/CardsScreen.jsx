import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from '../styles/Styles';

export default function CardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cards</Text>
      <Text>Manage your cards here.</Text>
      <StatusBar style="auto" />
    </View>
  );
}