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
import FlatButton from '../ui/FlatButton';


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
      <View style={styles.content}>

      {!isLogin ? (
        <View>
          <Text style={styles.headerText}>Create an account</Text>
        </View> ) 
      : (
          <View>
            <Text style={styles.headerText}>Login to your account</Text>
          </View>
      )}

        <Input
          label="Email"
          placeholder="Email Address"
          defaultValue= "Email"
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

        {isLogin && (
         <View style={styles.forgotPasswordContainer}>
          
            <FlatButton>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </FlatButton>
        
        </View>
        )}
        {!isLogin && (
          <Input
            label="Confirm Password"
            placeholder="Confirm Password"
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
          <Button
            onPress={submitHandler}
            isFilled={isLogin ? enteredEmail && enteredPassword : enteredEmail && enteredPassword && enteredConfirmPassword}
          >
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


const styles = StyleSheet.create({
  loginButton: {
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
  //  backgroundColor: "#FAFAFA"
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginVertical: 5,
    color: '#333', // Or any other color you prefer
    marginBottom: 20,
    marginTop: 10

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  forgotPasswordContainer: {
    marginBottom: 5,
    alignSelf: 'flex-end', // Align to the right
  },
  forgotPassword: {
    fontSize: 15,
    color: '#149E53',
    textAlign: 'right',
  },
});

export default AuthForm;

