import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../../../components/Auth/AuthContent';
import LoadingOverlay from '../../../components/ui/LoadingOverlay';
import { AuthContext } from '../../../store/auth-context';
import { createUser } from '../../../util/auth';

const SignupScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false); // Added type boolean

  const authCtx: any = useContext(AuthContext);

  const signupHandler = async ({ email, password }: { email: any, password: any }) => {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      // Saving token to state
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

  // Get auth props
  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
