import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/Styles';

export default function HomeScreen({ navigation }) {
  const games = [
    { id: '1', name: 'Puzzle Game' },
    { id: '2', name: 'Adventure Quest' },
    { id: '3', name: 'Racing Mania' },
  ];

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => navigation.navigate('GameScreen', { gameName: item.name })}
    >
      <Text style={styles.gameText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Games</Text>
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}