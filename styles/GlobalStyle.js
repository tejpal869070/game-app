import { StyleSheet } from 'react-native';

export const GlobalStyle = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    minWidth: 160,
    paddingBottom: 12,
  },
  buttonTop: {
    backgroundColor: '#cd3f64',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  buttonBottom: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#803',
    zIndex: 0,
  },
  buttonBase: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    zIndex: -1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
