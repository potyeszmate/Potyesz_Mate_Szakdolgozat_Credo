/* eslint-disable react/react-in-jsx-scope */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/styles';

function Button({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  signInButton: {
    height: 51,
    backgroundColor: '#1CB854',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: 'white', // Corrected text color for Sign in button
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  }
});
