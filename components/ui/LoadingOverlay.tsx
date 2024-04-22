import React from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';

function LoadingOverlay() { // Use the defined interface
  return (
    <ImageBackground
      source={require('../../assets/Gradient.png')} 
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View>
        <Text style={styles.message}>Credo</Text>
        <ActivityIndicator size="large" color="#1CB854" />
      </View>
    </ImageBackground>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF', // Text color
  },
});
