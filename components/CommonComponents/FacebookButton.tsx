import React from 'react';
import { Pressable, StyleSheet, Text, View,Image} from 'react-native';
import { FacebookButtonStyles } from './CommonComponentStyles';
const FacebookIcon = require('../../assets/facebook.png');

const FacebookButton: React.FC<any> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }: { pressed: any }) => [FacebookButtonStyles.signInButton, pressed && FacebookButtonStyles.pressed]}
      onPress={onPress}
    >
      <View style={FacebookButtonStyles.buttonContent}>
        <Image source={FacebookIcon} style={FacebookButtonStyles.icon} resizeMode="contain" />
        <Text style={FacebookButtonStyles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FacebookButton;

