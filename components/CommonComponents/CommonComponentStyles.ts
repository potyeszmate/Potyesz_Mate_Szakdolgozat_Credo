import { StyleSheet } from "react-native";
import { Colors } from "../../commonConstants/styles";

export const ButtonStyles = StyleSheet.create({
    signInButton: {
      height: 51,
      backgroundColor: '#1CB854', 
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      marginTop: 10
    },
    inactiveButton: {
      backgroundColor: '#CCCCCC', 
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pressed: {
      opacity: 0.7,
    },
  });

  export const CustomHeaderStyles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 50, 
      height: 100,
      paddingBottom: 10,
      backgroundColor: '#F5F6F5',
      borderRadius: 7
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 100,
      marginRight: 9,
      marginLeft: 5
    },
    headerTextTop: {
      color: 'gray',
      fontSize: 12,
      paddingBottom: 1
    },
    headerTextBottom: {
      color: '#1A1A2C',
      fontSize: 17,
    },
    rightSection: {},
    settingsIcon: {
      width: 26,
      height: 26,
      marginRight: 3,
      marginLeft: 2
    },
  });
  
  export const FacebookButtonStyles = StyleSheet.create({
    signInButton: {
        height: 51,
        backgroundColor: '#3B5998',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: 20, 
        height: 20, 
        marginRight: 8,
      },
      pressed: {
        opacity: 0.7,
      },
});

export const FlatButtonStyles = StyleSheet.create({
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: 'center',
      color: Colors.primary100,
    },
  });

  export const GoogleButtonStyles = StyleSheet.create({
    signInButton: {
        height: 51,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        borderColor: '#EEEEEE',
        borderWidth: 1
      },
      buttonText: {
        color: '#0000008A',
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: 20, 
        height: 20, 
        marginRight: 8, 
      },
      pressed: {
        opacity: 0.7,
      },
});

export const IconButtonStyles = StyleSheet.create({
    button: {
      margin: 8,
      borderRadius: 20,
    },
    pressed: {
      opacity: 0.7,
    },
  });

  export const IOSButtonStyles = StyleSheet.create({
    signInButton: {
      height: 51,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 20, 
      height: 20, 
      marginRight: 8, 
    },
    pressed: {
      opacity: 0.7,
    },
  });

  export const OnBoardingStyles = StyleSheet.create({
    flexOne: {
      flex: 1,
    },
    onboardingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20, 
      backgroundColor: 'white',
      borderRadius: 25, 
      padding: 20, 
      shadowColor: '#000', 
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 6,
      shadowOpacity: 0.1,
      elevation: 5,
    },
    textContainer: {
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '100%', 
      marginBottom: 16, 
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: '600',
      color: '#35BA52',
      marginBottom: 15, 
      textAlign: 'center',
    },
    instructionsText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center', 
    },
    formGroup: {
      width: '100%',
      alignItems: 'center', 
      marginBottom: 16,
    },
    inputLabel: {
      alignSelf: 'flex-start',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555', 
      marginBottom: 8,
    },
  
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    input: {
      width: '90%',
      borderWidth: 1,
      borderColor: '#ddd', 
      borderRadius: 10, 
      padding: 15, 
      marginBottom: 20, 
      backgroundColor: '#f7f7f7',
      },
      picker: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#f7f7f7',
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 70,
        zIndex: 1000, 
      },
      datePicker: {
        width: '90%',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f7f7f7',
      },
      backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      button: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
        elevation: 5,
        width: '90%', 
        alignSelf: 'center', 
      },
      buttonIcon: {
        marginRight: 8, 
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center', 
        flex: 1, 
      },
  });

  export const PremiumPaymentStyles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#26873B', 
        padding: 15,
        position: 'relative',
        marginTop: 20,
        marginBottom: 10, 
        marginLeft: 15,
        marginRight: 15
      },
      gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#35BA52', 
        opacity: 0.7,
      },
      gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#26873B', 
      },
    cardGradient: {
      padding: 15, 
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
    },
    advisorText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5, 
    },
    descriptionText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15, 
    },
    credoButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'flex-start', 
      borderRadius: 20,
    },
    credoButtonText: {
      color: '#1CB854', 
      fontSize: 18,
      fontWeight: 'bold',
    },
    semiCircle: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '30%', 
      height: '50%', 
      borderBottomLeftRadius: 200, 
      backgroundColor: '#72E985',
    },
  });  

  export const RadioStyles = StyleSheet.create({
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#000',
      marginRight: 10,
    },
    selectedRadio: {
      backgroundColor: '#000',
    },
  });

  export const SeparatorStyles = StyleSheet.create({
    separatorContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 12,
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
    separatorTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10,
    },
    separatorText: {
      flex: 1,
      height: 1.3,
      backgroundColor: '#CFCFD3',
      marginHorizontal: 8,
    },
    separatorOrText: {
      color: '#CFCFD3',
    },
  });

  export const UpcomingRecurringStyles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 16,
      marginTop: 20,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    viewAllButton: {
      alignItems: 'flex-end',
    },
    viewAllText: {
      color: '#007BFF',
      fontSize: 14,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 8,
      paddingRight: 8,
    },
    transactionIcon: {
      marginRight: 10,
    },
    iconImage: {
      width: 24,
      height: 24,
    },
    transactionInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    transactionName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    transactionCategory: {
      fontSize: 16,
      color: '#888',
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    transactionAmountValue: {
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  export const LoadingOverlayStyles = StyleSheet.create({
    imageBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#FFFFFF', 
    },
  });
  
  