import React from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LoadingOverlayStyles } from './CommonComponentStyles';

function LoadingOverlay() { 
  return (
    <ImageBackground
      source={require('../../assets/Gradient.png')} 
      style={LoadingOverlayStyles.imageBackground}
      resizeMode="cover"
    >
      <View>
        <Text style={LoadingOverlayStyles.message}>Credo</Text>
      </View>
    </ImageBackground>
  );
}

export default LoadingOverlay;
