/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Alert, StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import Button from '../ui/Button';
import Input from './Input';
import GoogleButton from '../ui/GoogleButton';
import FacebookButton from '../ui/FacebookButton';
import IOSButton from '../ui/IOSButton';
import Separator from '../ui/Separator';
import FlatButton from '../ui/FlatButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 



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
          
          <FlatButton onPress={() => setIsResetPasswordModalVisible(true)}>
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

        {/* <View style={styles.buttonContainer}>
          <FacebookButton>
            {'Continute with Facebook'}
          </FacebookButton>
        </View> */}

        <View style={styles.buttonContainer}>
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
            style={styles.centeredView}
          >
          <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={closeModalHandler}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
            <Text style={styles.modalText}>Forgot your password?</Text>
            <TextInput
              placeholder="Enter email address here"
              value={resetEmail}
              onChangeText={text => setResetEmail(text)}
              style={styles.modalInput}
              keyboardType="email-address"
            />
             <TouchableOpacity
              style={styles.button}
              onPress={() => {
                forgotPassword(resetEmail.trim());
                setIsResetPasswordModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Send password reset link</Text>
            </TouchableOpacity>
            <Text style={styles.modalNote}>
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


const styles = StyleSheet.create({
  loginButton: {
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  content: {
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', 
    marginBottom: 20,
    marginTop: 30

  },
  button: {
    color: 'black',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    alignSelf: 'flex-end', 
    padding: 10, 
  },
  forgotPasswordContainer: {
    marginBottom: 5,
    alignSelf: 'flex-end', 
  },
  forgotPassword: {
    fontSize: 15,
    color: '#149E53',
    textAlign: 'right',
  },
  modalView: {
    marginTop: 'auto', 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalInput: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  modalNote: {
    fontSize: 12,
    color: 'grey',
    marginTop: 15
  }
});

export default AuthForm;


