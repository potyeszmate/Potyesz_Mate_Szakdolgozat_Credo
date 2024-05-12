import { StyleSheet } from "react-native";

 export const analyticsScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardAmount: {
      fontSize: 15,
      color: 'grey',
    },
  });