import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import AuthContent from '../../../components/Auth/AuthContent';
import LoadingOverlay from '../../../components/CommonComponents/LoadingOverlay';
import { AuthContext } from '../../../store/auth-context';
import { createUser } from '../../../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStyles } from '../AuthenticationStyles';

const SignupScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false); 

  const authCtx: any = useContext(AuthContext);

  const signupHandler = async ({ email, password }: { email: any, password: any }) => {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      
      await AsyncStorage.setItem('setOnboardingModal', 'true');
     
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, please check your input and try again later.'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay/>;
  }
  return (
    <View style={authStyles.content}>

    <AuthContent onAuthenticate={signupHandler} />
    </View>

  );

}

export default SignupScreen;
