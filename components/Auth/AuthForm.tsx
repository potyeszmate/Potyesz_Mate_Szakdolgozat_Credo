import { useState } from 'react';
import { Alert, StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Input from './Input';
import GoogleButton from '../CommonComponents/GoogleButton';
import Separator from '../CommonComponents/Separator';
import FlatButton from '../CommonComponents/FlatButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 
import Button from '../CommonComponents/Button';
import { AuthFormStyles } from './AuthComponentStyles';

const AuthForm: React.FC<any> = ({ isLogin, onSubmit, credentialsInvalid }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
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
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  const closeModalHandler = () => {
    setIsResetPasswordModalVisible(false);
  };

  const forgotPassword = (email: any) => {
    if (!email) {
      Alert.alert('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }
  
    sendPasswordResetEmail(FIREBASE_AUTH, email)
    .then(() => {
      Alert.alert('Please check your email for the password reset link.');
    }).catch(error => {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('No user found with this email address.');
      } else {
        Alert.alert('Error sending password reset email: ' + error.message);
      }
    });
  };
  
  return (
      <View style={AuthFormStyles.content}>

      {!isLogin ? (
        <View>
          <Text style={AuthFormStyles.headerText}>Please create an account to sign in</Text>
        </View> ) 
      : (
          <View>
            <Text style={AuthFormStyles.headerText}>Login to Your Account</Text>
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
         <View style={AuthFormStyles.forgotPasswordContainer}>
          
          <FlatButton onPress={() => setIsResetPasswordModalVisible(true)}>
            <Text style={AuthFormStyles.forgotPassword}>Forgot password?</Text>
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
          {isLogin ? 'Sign in' : 'Sign Up'}
        </Button>
        </View>

        <View>
          <Separator isLogin={isLogin} />
        </View>

        <View style={AuthFormStyles.buttonContainer}>
          <GoogleButton>
            {'Continute with Google'}
          </GoogleButton>
        </View>

        <Modal
          visible={isResetPasswordModalVisible}
          animationType="slide"
          presentationStyle="overFullScreen" 
          transparent={true} 
          onRequestClose={closeModalHandler}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={AuthFormStyles.centeredView}
          >
          <View style={AuthFormStyles.modalView}>
          <TouchableOpacity
            style={AuthFormStyles.modalCloseButton}
            onPress={closeModalHandler}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
            <Text style={AuthFormStyles.modalText}>Forgot your password?</Text>
            <TextInput
              placeholder="Enter email address here"
              value={resetEmail}
              onChangeText={text => setResetEmail(text)}
              style={AuthFormStyles.modalInput}
              keyboardType="email-address"
            />
             <TouchableOpacity
              style={AuthFormStyles.button}
              onPress={() => {
                forgotPassword(resetEmail.trim());
                setIsResetPasswordModalVisible(false);
              }}
            >
              <Text style={AuthFormStyles.buttonText}>Send password reset link</Text>
            </TouchableOpacity>
            
            <Text style={AuthFormStyles.modalNote}>
              Check your email spam folder to find password reset link
            </Text>
            <Button
              title="Cancel"
              onPress={closeModalHandler} 
            />
          </View>
          </KeyboardAvoidingView>
        </Modal>


      </View>
  );
}

export default AuthForm;


