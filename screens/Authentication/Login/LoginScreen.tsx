import { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

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
      setIsAuthenticating(false);

    } catch (error) {
      console.error(error);

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
    <View style={styles.content}>

    <AuthContent isLogin onAuthenticate={loginHandler} />
    </View>

  );

}

const styles = StyleSheet.create({
  content: {
   backgroundColor: "#FAFAFA",
   height: '100%'
  },
});

export default LoginScreen;
