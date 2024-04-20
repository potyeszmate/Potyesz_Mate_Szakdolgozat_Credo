/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Button from '../ui/Button';
import Input from './Input';
import GoogleButton from '../ui/GoogleButton';
import FacebookButton from '../ui/FacebookButton';
import IOSButton from '../ui/IOSButton';
import Separator from '../ui/Separator';



const AuthForm: React.FC<any> = ({ isLogin, onSubmit, credentialsInvalid }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  // const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

  const {
    email: emailIsInvalid,
    // confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      // case 'confirmEmail':
      //   setEnteredConfirmEmail(enteredValue);
      //   break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      // confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
      <View>
        <Input
          label="Email"
          placeholder="Email Address"
          defaultValue= "efeef"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        
        <Input
          label="Password"
          placeholder="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secureTextEntry={true}
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />

        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmPassword'
            )}
            secureTextEntry={true}
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}

        <View >
          <Button onPress={submitHandler}>
            {isLogin ? 'Log In with email' : 'Sign Up'}
          </Button>
        </View>

        <View>
          <Separator isLogin={isLogin} />
        </View>

        <View style={styles.buttonContainer}>
          <FacebookButton>
            {'Continute with Facebook'}
          </FacebookButton>
        </View>

        {/* Add logind and signup with google account with firebase authentication */}
        <View style={styles.buttonContainer}>
          <GoogleButton>
            {'Continute with Google'}
          </GoogleButton>
        </View>

        
        <View style={styles.buttonContainer} >
          <IOSButton>
            {'Continute with Apple'}
          </IOSButton>
        </View>


      </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  loginButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
