import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    content: {
     backgroundColor: "#FAFAFA",
     height: '100%'
    },
  });


export const onboardStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
  },
    welcomeText: {
        color: '#1CB854',
        fontSize: 18, 
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -60,
      },
      subtitleContainer: {
        alignItems: 'center',
        marginBottom: 60,
      },
      subtitleFirstRow: {
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
      },
      subtitleSecondRow: {
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
      },
    centeredImage: {
      width: 320,
      height: 320,
      marginBottom: 120,
      marginTop: 10,

    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: 16, 
      position: 'absolute',
      bottom: 60, 
    },
    createAccountButton: {
      width: 358,
      height: 54,
      backgroundColor: '#1CB854',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      marginBottom: 10,
    },
    signInButton: {
        width: 358,
        height: 54,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#1CB854',
      },
      buttonTextSignIn: {
        color: '#1CB854', 
        fontSize: 16,
        fontWeight: 'bold',
      },
    buttonTextSignUp: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    
  });
