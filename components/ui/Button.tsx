/* eslint-disable react/react-in-jsx-scope */
import { Pressable, StyleSheet, Text, View } from 'react-native';

const Button: React.FC<any> = ({ children, onPress, isFilled }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.signInButton,
        !isFilled && styles.inactiveButton,
        pressed && styles.pressed
      ]}
      onPress={onPress}
      disabled={!isFilled}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

// Updated styles
const styles = StyleSheet.create({
  signInButton: {
    height: 51,
    backgroundColor: '#1CB854', // The green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 10
  },
  inactiveButton: {
    backgroundColor: '#CCCCCC', // The gray color
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Button;