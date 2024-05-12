import { StyleSheet } from "react-native";

  export const SettingsPageStyles = StyleSheet.create({
    background: {
      backgroundColor: '#FAFAFA', 
    },
    container: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    sectionContainer: {
      marginBottom: 20,
      
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    optionText: {
      fontSize: 18,
      color: '#333',
      marginLeft: 10,
      flex: 1,
    },
    icon: {
      marginRight: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
    },
    logoutButton: {
      backgroundColor: '#b23b3b',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutButtonText: {
      color: 'white',
      fontSize: 18,
      marginLeft: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  });

  export const bugReportStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAFAFA', 
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    descriptionInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    reportButton: {
      backgroundColor: '#1CB854',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
    },
    reportButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export const ConnectStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#FAFAFA', 

    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    followText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333', 
    },
    platformCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 10,
      width: '80%',
      borderColor: '#1CB854',
      marginTop: 20,
      borderWidth: 1,
  
    },
    platformText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    cardContainer: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#1CB854',
      borderRadius: 10,
      marginTop: 20,
      width: '80%',
    },
    card: {
      flexDirection: 'row',
      padding: 20,
    },
    iconContent: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
    },
    textContent: {
      flex: 1,
    },
    emailTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',
    },
    email: {
      fontSize: 16,
      color: '#1CB854',
    },
  });

  export const CurrencyStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAFAFA', 
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    currencyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 10,
    },
    currencyText: {
      flex: 1,
      fontSize: 16,
    },
  });

  export const FAQstyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: '#FAFAFA', 

    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    faqItem: {
      backgroundColor: '#fff',
      marginBottom: 20,
      padding: 15,
      borderRadius: 10,
      elevation: 3,
    },
    questionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    questionIcon: {
      marginRight: 10,
    },
    question: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    answer: {
      fontSize: 16,
      marginTop: 10,
    },
  });

  export const LanguageStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAFAFA', 
    },
    header: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 10,
    },
    languageText: {
      flex: 1,
      fontSize: 16,
    },
  });
  
  export const NotificationStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAFAFA', 

    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    optionText: {
      fontSize: 16,
      flex: 1,
    },
  });

  export const ThemeStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAFAFA', 

    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    optionText: {
      fontSize: 16,
      flex: 1,
    },
  });
  
  