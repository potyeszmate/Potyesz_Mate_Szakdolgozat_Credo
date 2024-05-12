import { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import AuthContent from '../../../components/Auth/AuthContent';
import { AuthContext } from '../../../store/auth-context';
import { login } from '../../../util/auth';
import LoadingOverlay from '../../../components/CommonComponents/LoadingOverlay';
import { authStyles } from '../AuthenticationStyles';

const LoginScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx: any = useContext(AuthContext);

  const loginHandler = async ({ email, password }: { email: any, password: any }) => {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
      setIsAuthenticating(false);

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
  return (
    <View style={authStyles.content}>

    <AuthContent isLogin onAuthenticate={loginHandler} />
    </View>
  );
}

export default LoginScreen;
