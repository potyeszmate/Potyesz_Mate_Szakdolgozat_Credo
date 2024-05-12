import { useState } from 'react';
import { Alert, StyleSheet, View,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FlatButton from '../CommonComponents/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../commonConstants/styles';
import { AuthContentStyles } from './AuthComponentStyles';

const AuthContent: React.FC<any> = ({ isLogin, onAuthenticate }) => {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });


  const submitHandler = (credentials: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    let { email, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const passwordsAreEqual = password === confirmPassword;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !passwordsAreEqual)) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  };

  return (
    <View style={AuthContentStyles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View />
    </View>
  );
};

export default AuthContent;

