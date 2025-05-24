import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Dimensions, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-audio'; // Using expo-audio for SDK 52+

export default function Mines() {
  const [minesCount, setMinesCount] = useState(1);
  const [betAmount, setBetAmount] = useState('10');
  const [balance, setBalance] = useState(1000);
  const [gameState, setGameState] = useState('setup'); 
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState(Array(25).fill(false));
  const [diamondsFound, setDiamondsFound] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const TOTAL_BOXES = 25;
  const MIN_MINES = 1;
  const MAX_MINES = 24;

  // Get device dimensions
  const { width, height } = Dimensions.get('window');

  // Animation values
  const boxScale = useRef(Array(TOTAL_BOXES).fill().map(() => new Animated.Value(1))).current;

  // Audio objects
  const mineSound = useRef(null); // Initialize as null
  const diamondSound = useRef(null); // Initialize as null

  // Load audio files when component mounts
  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      if (!Audio) {
        console.error('Audio module is undefined. Ensure expo-audio is installed and compatible with your SDK.');
        return;
      }

      try {
        mineSound.current = new Audio.Sound();
        diamondSound.current = new Audio.Sound();
        await mineSound.current.loadAsync(require('./assets/sounds/mine.mp3'));
        await diamondSound.current.loadAsync(require('./assets/sounds/diamond.mp3'));
      } catch (error) {
        console.error('Error loading sound files:', error);
      }
    };

    loadSounds();

    // Cleanup audio on component unmount
    return () => {
      isMounted = false;
      if (mineSound.current) {
        mineSound.current.unloadAsync().catch((error) => console.error('Error unloading mine sound:', error));
      }
      if (diamondSound.current) {
        diamondSound.current.unloadAsync().catch((error) => console.error('Error unloading diamond sound:', error));
      }
    };
  }, []);

  // Mock API for balance updates
  const mockApi = async (action, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (action === 'deduct' && balance >= amount) {
          setBalance((prev) => prev - amount);
          resolve(true);
        } else if (action === 'add') {
          setBalance((prev) => prev + amount);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const startGame = async () => {
    const bet = parseFloat(betAmount) || 0;
    if (minesCount < MIN_MINES || minesCount > MAX_MINES) {
      Alert.alert('Invalid Bombs Count', `Please select between ${MIN_MINES} and ${MAX_MINES} bombs.`);
      return;
    }
    if (bet <= 0 || isNaN(bet)) {
      Alert.alert('Invalid Bet', 'Please enter a valid bet amount.');
      return;
    }
    if (bet > balance) {
      Alert.alert('Insufficient Balance', 'Your bet exceeds your current balance.');
      return;
    }

    const success = await mockApi('deduct', bet);
    if (!success) {
      Alert.alert('Error', 'Failed to place bet. Insufficient balance.');
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

  const handleBoxClick = async (index) => {
    if (gameState !== 'playing' || revealed[index]) return;

    // Animate box click
    Animated.sequence([
      Animated.timing(boxScale[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(boxScale[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    try {
      if (board[index] === 'mine') {
        // Play mine sound
        if (mineSound.current) {
          await mineSound.current.playAsync();
        }
        setGameState('gameOver');
        setRevealed(Array(TOTAL_BOXES).fill(true));
        setModalMessage('Game Over! You hit a bomb! Start a new game.');
        setModalVisible(true);
      } else {
        // Play diamond sound
        if (diamondSound.current) {
          await diamondSound.current.playAsync();
        }
        const newDiamondsFound = diamondsFound + 1;
        setDiamondsFound(newDiamondsFound);
        if (newDiamondsFound === TOTAL_BOXES - minesCount) {
          setGameState('won');
          const winnings = parseFloat(betAmount) * newDiamondsFound;
          await mockApi('add', winnings);
          setModalMessage(`You Win! You found all diamonds! Winnings: $${winnings.toFixed(2)}`);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const cashOut = async () => {
    if (gameState !== 'playing') return;
    const winnings = parseFloat(betAmount) * diamondsFound;
    await mockApi('add', winnings);
    setGameState('won');
    setModalMessage(`Cashed Out! You cashed out with $${winnings.toFixed(2)}!`);
    setModalVisible(true);
  };

  const adjustBetAmount = (multiplier) => {
    const currentBet = parseFloat(betAmount) || 0;
    const newBet = Math.max(0.01, (currentBet * multiplier)).toFixed(2);
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
      <Animated.View style={[styles.box, { transform: [{ scale: boxScale[index] }] }]} key={index}>
        <TouchableOpacity
          style={styles.boxInner}
          onPress={() => handleBoxClick(index)}
          disabled={gameState !== 'playing'} 
        >
          <Text style={styles.boxText}>{content}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={['#1a2a3a', '#0d1b2a']} style={[styles.container, { width, height }]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.balance}>Balance: ${balance.toFixed(2)}</Text>
    

      <View style={[styles.board, { width: width - 40 }]}>
        {Array.from({ length: TOTAL_BOXES }, (_, i) => renderBox(i))}
      </View>

      <View style={styles.controls}>
        <View style={styles.betSection}>
          <View style={styles.betInputContainer}>
            <TextInput
              style={styles.betInput}
              keyboardType="numeric"
              value={betAmount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                if ((cleaned.match(/\./g) || []).length <= 1) {
                  setBetAmount(cleaned);
                }
              }}
              placeholder="0.00"
              editable={gameState === 'setup'}
            />
            <Text style={styles.currency}>
              ${((parseFloat(betAmount) || 0) * (diamondsFound || 1)).toFixed(2)}
            </Text>
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
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => updateMinesCount(-1)}
            disabled={gameState !== 'setup'}
          >
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.bombsCount}>{minesCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => updateMinesCount(1)}
            disabled={gameState !== 'setup'}
          >
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
              Cash Out ${((parseFloat(betAmount) || 0) * diamondsFound).toFixed(2)}
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
  balance: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    top: 40,
    left: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
  },
  box: {
    width: 70,
    height: 70,
    margin: 4,
  },
  boxInner: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});