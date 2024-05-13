import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../commonConstants/styles';
import { IOSButtonStyles } from './CommonComponentStyles';

const AppleIcon = require('../../assets/apple.png');

const IOSButton: React.FC<any> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [IOSButtonStyles.signInButton, pressed && IOSButtonStyles.pressed]}
      onPress={onPress}
    >
      <View style={IOSButtonStyles.buttonContent}>
        <Image source={AppleIcon} style={IOSButtonStyles.icon} resizeMode="contain" />
        <Text style={IOSButtonStyles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default IOSButton;

