import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Welcome: React.FC<{ navigation: any }> = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Credo</Text>
        <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleFirstRow}>Let’s get you to</Text>
        <Text style={styles.subtitleSecondRow}>the top of your finances</Text>
        </View>

      <Image
        source={require('../../../assets/credo-plan.png')} 
        style={styles.centeredImage}
      />

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
        fontSize: 18, 
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -60,
      },
      subtitleContainer: {
        alignItems: 'center',
        marginBottom: 60,
      },
      subtitleFirstRow: {
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
      },
      subtitleSecondRow: {
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
        color: '#1CB854', 
        fontSize: 16,
        fontWeight: 'bold',
      },
    buttonTextSignUp: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    
  });

export default Welcome;
