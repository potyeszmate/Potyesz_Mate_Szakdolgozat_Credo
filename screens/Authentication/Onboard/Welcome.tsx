import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { onboardStyles } from '../AuthenticationStyles';

const Welcome: React.FC<{ navigation: any }> = ({ navigation }) => {

  return (
    <View style={onboardStyles.container}>
      <Text style={onboardStyles.welcomeText}>Welcome to Credo</Text>
        <View style={onboardStyles.subtitleContainer}>
        <Text style={onboardStyles.subtitleFirstRow}>Let’s get you to</Text>
        <Text style={onboardStyles.subtitleSecondRow}>the top of your finances</Text>
        </View>

      <Image
        source={require('../../../assets/credo-plan.png')} 
        style={onboardStyles.centeredImage}
      />

      <View style={onboardStyles.buttonContainer}>
        <TouchableOpacity
          style={onboardStyles.createAccountButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={onboardStyles.buttonTextSignUp}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={onboardStyles.signInButton}
          onPress={() => navigation.navigate('Login')}
        >
           <Text style={{ ...onboardStyles.buttonTextSignUp, color: '#1CB854' }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;
