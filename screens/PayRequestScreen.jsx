import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from '../styles/Styles';

export default function PayRequestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay/Request</Text>
      <Text>Send or request payments here.</Text>
      <StatusBar style="auto" />
    </View>
  );
}