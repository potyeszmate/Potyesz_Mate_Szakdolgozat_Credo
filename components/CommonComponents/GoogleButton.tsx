import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../../commonConstants/styles';
import { GoogleButtonStyles } from './CommonComponentStyles';
const GoogleIcon = require('../../assets/google.png');

const GoogleButton: React.FC<any> = ({ children, onPress }) => {
  return (
    <Pressable
    style={({ pressed }) => [GoogleButtonStyles.signInButton, pressed && GoogleButtonStyles.pressed]}
    onPress={onPress}
  >
    <View style={GoogleButtonStyles.buttonContent}>
      <Image source={GoogleIcon} style={GoogleButtonStyles.icon} resizeMode="contain" />
      <Text style={GoogleButtonStyles.buttonText}>{children}</Text>
    </View>
  </Pressable>
  );
}

export default GoogleButton;

