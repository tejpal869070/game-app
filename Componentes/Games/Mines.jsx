import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Mines() {
  const [minesCount, setMinesCount] = useState(1);
  const [betAmount, setBetAmount] = useState('10');
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'gameOver', 'won'
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState(Array(25).fill(false));
  const [diamondsFound, setDiamondsFound] = useState(0);

  const TOTAL_BOXES = 25;
  const MIN_MINES = 1;
  const MAX_MINES = 24;

  const startGame = () => { 
    if (minesCount < MIN_MINES || minesCount > MAX_MINES) {
      Alert.alert('Invalid Bombs Count', `Please select between ${MIN_MINES} and ${MAX_MINES} bombs.`);
      return;
    }
    if (!betAmount || parseFloat(betAmount) <= 0) {
      Alert.alert('Invalid Bet', 'Please enter a valid bet amount.');
      return;
    }

    const newBoard = Array(TOTAL_BOXES).fill('diamond');
    let minesToPlace = minesCount;
    while (minesToPlace > 0) {
      const idx = Math.floor(Math.random() * TOTAL_BOXES);
      if (newBoard[idx] !== 'mine') {
        newBoard[idx] = 'mine';
        minesToPlace--;
      }
    }
    setBoard(newBoard);
    setRevealed(Array(TOTAL_BOXES).fill(false));
    setDiamondsFound(0);
    setGameState('playing');
  };

  const handleBoxClick = (index) => {
    if (gameState !== 'playing' || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (board[index] === 'mine') {
      setGameState('gameOver');
      Alert.alert('Game Over', 'You hit a bomb! Start a new game.');
    } else {
      const newDiamondsFound = diamondsFound + 1;
      setDiamondsFound(newDiamondsFound);
      if (newDiamondsFound === TOTAL_BOXES - minesCount) {
        setGameState('won');
        Alert.alert('You Win!', `You found all diamonds! Winnings: $${(parseFloat(betAmount) * newDiamondsFound).toFixed(2)}`);
      }
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing') return;
    setGameState('won');
    Alert.alert('Cashed Out', `You cashed out with $${(parseFloat(betAmount) * diamondsFound).toFixed(2)}!`);
  };

  const adjustBetAmount = (multiplier) => {
    const currentBet = parseFloat(betAmount) || 0;
    const newBet = (currentBet * multiplier).toFixed(2);
    setBetAmount(newBet.toString());
  };

  const updateMinesCount = (delta) => {
    const newCount = Math.min(Math.max(minesCount + delta, MIN_MINES), MAX_MINES);
    setMinesCount(newCount);
  };

  const renderBox = (index) => {
    const isRevealed = revealed[index];
    const content = isRevealed ? (board[index] === 'mine' ? '💣' : '💎') : '';
    return (
      <TouchableOpacity
        key={index}
        style={styles.box}
        onPress={() => handleBoxClick(index)}
        disabled={gameState !== 'playing'}
      >
        <Text style={styles.boxText}>{content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1a2a3a', '#0d1b2a']} style={styles.container}>
      <View style={styles.modeButtons}>
        <TouchableOpacity style={[styles.modeButton, styles.activeModeButton]}>
          <Text style={styles.modeButtonText}>Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeButtonText}>Auto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.board}>
        {Array.from({ length: TOTAL_BOXES }, (_, i) => renderBox(i))}
      </View>

      <View style={styles.controls}>
        <View style={styles.betSection}>
          <View style={styles.betInputContainer}>
            <TextInput
              style={styles.betInput}
              keyboardType="numeric"
              value={betAmount}
              onChangeText={(text) => setBetAmount(text || '0')}
              placeholder="0"
              editable={gameState === 'setup'}
            />
            <Text style={styles.currency}>${(parseFloat(betAmount) * (diamondsFound || 1)).toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.multiplierButton}
              onPress={() => adjustBetAmount(0.5)}
              disabled={gameState !== 'setup'}
            >
              <Text style={styles.multiplierText}>1/2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.multiplierButton}
              onPress={() => adjustBetAmount(2)}
              disabled={gameState !== 'setup'}
            >
              <Text style={styles.multiplierText}>2x</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bombsSection}>
          <TouchableOpacity style={styles.counterButton} onPress={() => updateMinesCount(-1)} disabled={gameState !== 'setup'}>
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.bombsCount}>{minesCount}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={() => updateMinesCount(1)} disabled={gameState !== 'setup'}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        {gameState === 'setup' && (
          <TouchableOpacity style={styles.betButton} onPress={startGame}>
            <Text style={styles.betButtonText}>Place Bet</Text>
          </TouchableOpacity>
        )}

        {gameState === 'playing' && (
          <TouchableOpacity style={styles.betButton} onPress={cashOut}>
            <Text style={styles.betButtonText}>
              Cash Out ${(parseFloat(betAmount) * diamondsFound).toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}

        {(gameState === 'gameOver' || gameState === 'won') && (
          <TouchableOpacity style={styles.betButton} onPress={() => setGameState('setup')}>
            <Text style={styles.betButtonText}>New Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modeButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeButton: {
    backgroundColor: '#2a3b4c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeModeButton: {
    backgroundColor: '#007bff',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  box: {
    width: 56,
    height: 56,
    margin: 4,
    backgroundColor: '#2a3b4c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  boxText: {
    fontSize: 30,
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  betSection: {
    width: '100%',
    backgroundColor: '#2a3b4c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  betInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  betInput: {
    backgroundColor: '#1a2a3a',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    width: 100,
    textAlign: 'center',
  },
  currency: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  multiplierButton: {
    backgroundColor: '#3a4b5c',
    padding: 10,
    borderRadius: 5,
  },
  multiplierText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bombsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2a3b4c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  counterButton: {
    backgroundColor: '#1a2a3a',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bombsCount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    backgroundColor: '#1a2a3a',
    padding: 10,
    borderRadius: 5,
    width: 60,
    textAlign: 'center',
  },
  betButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  betButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});