import { StyleSheet } from "react-native";

export const PaymentStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1A1A2C',
      marginBottom: 30,
    
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    featuresContainer: {
      width: '90%',
    },
    featureCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardIcon: {
      marginRight: 20,
    },
    cardTextContainer: {
      flex: 1,
    },
    featureCardTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
    },
    featureCardDescription: {
      fontSize: 14,
      color: '#666',
    },
    subscribeButton: {
      backgroundColor: '#1CB854',
      paddingVertical: 15,
      paddingHorizontal: 35,
      borderRadius: 30,
      shadowColor: '#1CB854',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
      marginTop: 20
    },
    subscribeButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
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
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18
    },
    modalSubText: {
      marginBottom: 20,
      textAlign: 'center',
      fontSize: 15
    },
    okButton: {
      backgroundColor: '#1CB854',
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    okButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    });