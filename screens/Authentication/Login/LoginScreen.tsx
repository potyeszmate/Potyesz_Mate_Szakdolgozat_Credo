import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../../../components/Auth/AuthContent';
import LoadingOverlay from '../../../components/ui/LoadingOverlay';
import { AuthContext } from '../../../store/auth-context';
import { login } from '../../../util/auth';

const LoginScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx: any = useContext(AuthContext);

  const loginHandler = async ({ email, password }: { email: any, password: any }) => {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay/>;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
