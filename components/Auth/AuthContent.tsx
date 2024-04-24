/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Alert, StyleSheet, View,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';

const AuthContent: React.FC<any> = ({ isLogin, onAuthenticate }) => {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // const switchAuthModeHandler = () => {
  //   if (isLogin) {
  //     navigation.navigate('Signup');
  //   } else {
  //     navigation.navigate('Login');
  //   }
  // };

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
    <View style={styles.authContent}>
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

const styles = StyleSheet.create({
  authContent: {
    marginTop: 5,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 8,
    // backgroundColor: Colors.primary800,
    // elevation: 2,
    // shadowColor: 'black',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4,
  },
  // buttons: {
  //   // marginTop: 40,
  // },
  // forgotPassword: {
  //   fontSize: 15,
  //   color: '#149E53',
  //   textAlign: 'right',
  //   // marginBottom: 20,
  // },
  // separatorContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 12,
  // },
  // separatorText: {
  //   flex: 1,
  //   height: 1.3,
  //   backgroundColor: '#CFCFD3',
  //   marginHorizontal: 8,
  // },
  // separatorOrText: {
  //   color: '#CFCFD3',
  //   // fontWeight: 'bold',
  // },
});
