import { StyleSheet } from "react-native";
import { Colors } from "../../commonConstants/styles";

export const AuthContentStyles = StyleSheet.create({
    authContent: {
      marginTop: 5,
      marginHorizontal: 5,
      padding: 16,
      borderRadius: 8,
    },
  });

  export const AuthFormStyles = StyleSheet.create({
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
      backgroundColor: 'black',
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

  export const AuthInputStyles = StyleSheet.create({
    inputContainer: {
      marginVertical: 8,
    },
    label: {
      color: '#f0f0f0',
      marginBottom: 1,
    },
    labelInvalid: {
      color: Colors.error500,
    },
    input: {
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      backgroundColor: '#F6F6F6',
      paddingHorizontal: 16,
      fontSize: 16, 
    },
    inputInvalid: {
      backgroundColor: Colors.error100,
    },
  });
  