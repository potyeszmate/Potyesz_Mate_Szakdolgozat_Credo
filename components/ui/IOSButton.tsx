import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../commonConstants/styles';

const AppleIcon = require('../../assets/apple.png');

const IOSButton: React.FC<any> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Image source={AppleIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default IOSButton;

const styles = StyleSheet.create({
  signInButton: {
    height: 51,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: 'white',
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
