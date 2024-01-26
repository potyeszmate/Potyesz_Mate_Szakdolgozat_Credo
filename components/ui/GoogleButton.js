/* eslint-disable react/react-in-jsx-scope */
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

import { Colors } from '../../constants/styles';
import GoogleIcon from '../../assets/google.png'; 

function GoogleButton({ children, onPress }) {
  return (
    <Pressable
    style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
    onPress={onPress}
  >
    <View style={styles.buttonContent}>
      <Image source={GoogleIcon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.buttonText}>{children}</Text>
    </View>
  </Pressable>
  );
}

export default GoogleButton;

const styles = StyleSheet.create({
    signInButton: {
        height: 51,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        padding: 15
      },
      buttonText: {
        color: '#0000008A',
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: 20, 
        height: 20, 
        marginRight: 8, 
      },
      pressed: {
        opacity: 0.7,
      },
});
