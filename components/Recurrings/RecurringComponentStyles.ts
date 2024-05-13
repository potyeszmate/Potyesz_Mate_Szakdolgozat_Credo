import { StyleSheet } from "react-native";

export const RecurringInputStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 20,
      width: '80%',
      alignSelf: 'center',
    },
    container: {
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'grey',
      flex: 1, 
      textAlign: 'center', 
    },
    headerTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      paddingRight: 20, 
      paddingLeft: 10,
    },
    closeIcon: {
      marginRight: -40, 
    },
    modalDateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: 'grey',
    },
    inputWrapper: {
      marginBottom: 10, 
      marginTop: 10, 
  
    },
    contentContainer: {
      paddingTop: 20, 
  
    },
    iconContainer: {
      borderWidth: 2,
      borderColor: '#FFFFFF',
      borderRadius: 14,
    },
    icon: {
      width: 40,
      height: 40,
      marginRight: 10,
      marginLeft: -20,
    },
    addButton: {
      backgroundColor: '#35BA52',
      borderRadius: 14,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 250,
      flexDirection: 'row',
      justifyContent: 'center',
      bottom: 50
    },
    providerList: {
      flexGrow: 1,
    },
  
    deleteModalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    deleteModalContent: {
      backgroundColor: '#fff',
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 5,
    },
    deleteModalText: {
      fontSize: 18,
      marginBottom: 16,
    },
    deleteModalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    deleteModalButton: {
      marginLeft: 16,
      padding: 8,
    },
    deleteModalButtonYes: {
      backgroundColor: '#FF5733',
      borderRadius: 8,
    },
    deleteModalButtonText: {
      fontSize: 16,
      color: '#1A1A2C',
    },
    providerIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    providerText: {
      fontSize: 16,
      color: '#333',
    },
    input: {
      borderBottomWidth: 1,
      fontSize: 32,
      color: '#333',
    },
    closeButton: {
      color: '#35BA52',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 20, 
    },
    tabButton: {
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 38,
      borderRadius: 99,
    },
    tabButtonText: {
      color: '#1A1A2C',
      fontSize: 14,
    },
    scrollViewContent: {
      paddingBottom: 100, 
    },
    activeTabButton: {
      backgroundColor: '#1A1A2C',
    },
    activeTabButtonText: {
      color: '#FFFFFF',
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden', 
      elevation: 5, 
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowColor: 'black',
      shadowOffset: { height: -3, width: 0 },
    },
    deleteButton: {
      backgroundColor: '#FF5733',
      borderRadius: 8,
      padding: 10,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: -100
    },
    deleteButtonText: {
      color: '#FFFFFF', 
      fontSize: 16,
      fontWeight: 'bold',
    },
    pickerContainer: {
      height: 40,
      marginBottom: 1, 
    },
    dropDownStyle: {
      backgroundColor: '#fafafa',
    },
    dateText: {
      borderBottomWidth: 1,
      paddingVertical: 10,
      fontSize: 16,
      color: '#333',
    },
    debug: {
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      // elevation: 3,
      paddingHorizontal: 2,
      paddingVertical: 2,
    },
    inputText: {
      flex: 1,
      fontSize: 16,
      color: '#1A1A2C',
    },
    divider: {
      height: 1.5,
      backgroundColor: '#F0F0F0',
      width: '110%',
      marginLeft: -20,
      marginTop: 5,
      marginBottom: 5
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  
    modalTitleContainer: {
      alignItems: 'center', 
      marginTop: 10, 
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20, 
      backgroundColor: '#F6F6F6', 
      paddingHorizontal: 15, 
      marginBottom: 15, 
      marginLeft: 20,
      marginRight: 20,
      marginTop: -20
    },
    searchIcon: {
      marginRight: 10, 
    },
    searchInput: {
      flex: 1, 
      fontSize: 16,
      color: '#333',
      paddingVertical: 10, 
    },
    
    providerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20, 
    },
    providerItemWithMargin: {
      marginLeft: 30, 
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: -50,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1, 
    },
    bottomButton: {
      backgroundColor: '#35BA52',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    bottomButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
  });

  export const RecurringDonutChartStyles = StyleSheet.create({
    chartContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
    },
    noDataText: {
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
    },
    innerChartContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      padding: 1,
      elevation: 3, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      backgroundColor: 'white'
    },
    cardStyle: {
      borderRadius: 8,
      padding: 20,
      elevation: 3, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    totalValue: {
      marginTop: 10,
      fontSize: 18,
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center', 
    },
    percentagesList: {
      marginTop: 20,
    },
    itemPercentage: {
      fontSize: 16,
      color: '#7F7F7F',
      textAlign: 'center', 
    },
  });
  