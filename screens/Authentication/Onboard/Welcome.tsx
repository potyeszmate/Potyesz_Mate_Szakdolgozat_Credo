/* eslint-disable no-undef */
// WelcomeScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/styles';

const Welcome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleCreateAccount = () => {
  };

  const handleSignIn = () => {
   
  };

  return (
    <View style={styles.container}>
      {/* Top part */}
      <Text style={styles.welcomeText}>Welcome to Credo</Text>
        <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleFirstRow}>Let’s get you to</Text>
        <Text style={styles.subtitleSecondRow}>the top of your finances</Text>
        </View>

      {/* Centered image */}
      <Image
        source={require('../../../assets/credo-plan.png')} 
        style={styles.centeredImage}
      />

      {/* Bottom buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonTextSignUp}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Login')}
        >
           <Text style={{ ...styles.buttonTextSignUp, color: '#1CB854' }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
  },
    welcomeText: {
        color: '#1CB854',
        fontSize: 18, // Updated size for Welcome text
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -60,
        fontFamily: 'Inter',
      },
      subtitleContainer: {
        alignItems: 'center',
        marginBottom: 60,
      },
      subtitleFirstRow: {
        fontFamily: 'Inter',
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
      },
      subtitleSecondRow: {
        fontFamily: 'Inter',
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
      },
    centeredImage: {
      width: 320,
      height: 320,
      marginBottom: 120,
      marginTop: 10,

    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: 16, 
      position: 'absolute',
      bottom: 60, 
    },
    createAccountButton: {
      width: 358,
      height: 54,
      backgroundColor: '#1CB854',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      marginBottom: 10,
    },
    signInButton: {
        width: 358,
        height: 54,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#1CB854',
      },
      buttonTextSignIn: {
        color: '#1CB854', // Corrected text color for Sign in button
        fontSize: 16,
        fontWeight: 'bold',
      },
    buttonTextSignUp: {
      color: 'white', // For Create account button
      fontSize: 16,
      fontWeight: 'bold',
    },
    
  });

export default Welcome;
