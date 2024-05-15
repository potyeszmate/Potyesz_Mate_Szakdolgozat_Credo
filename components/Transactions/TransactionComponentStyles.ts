import { StyleSheet } from "react-native";

export const LatestTransactionsStyles = StyleSheet.create({
    container: {
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
        paddingBottom: 5
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#7E8086',
    },
  });

  export const TransactionStyles = StyleSheet.create({
    listContainer: {
    },
    iconImage: {
      width: 35,
      height: 35,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingBottom: 12,
      paddingTop: 12,
      borderRadius: 8,
      elevation: 2,
      width: '100%',
    },
    separator: {
      height: 1,
      backgroundColor: '#EEEEEE',
      
    },
    transactionIcon: {
      marginRight: 10,
    },
    transactionInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    transactionName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    transactionDate: {
      color: '#888',
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    transactionCategory: {
      fontSize: 16,
      color: '#888',
    },
    transactionAmountText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#1A1A2C',
    },
  });

  export const TransactionInputStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 20,
      width: '80%',
      alignSelf: 'center',
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
      marginLeft: 40,
      marginRight: 40
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
      paddingVertical: 8,
      marginTop: 5,
      alignItems: 'center',
      justifyContent: 'center',
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
      width: '48%',
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
      marginTop: 20
  
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
    notesInput: {
      height: 100,
      width: '100%',
      padding: 10,
      marginBottom: 20,
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#35BA52',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginLeft: 60,
      marginRight: 60
  
  
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
    },
  });

  export const TransactionItemStyles = StyleSheet.create({
    transactionItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
    },
  });

 export const TransactionsListStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      padding: 16,
    },
    pickerContainer: {
      height: 40,
      marginBottom: 10,
    },
    dropDownStyle: {
      backgroundColor: '#fafafa',
    },
    
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
    },
    modalHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    closeButton: {
      padding: 10,  
    },
    transactionIcon: {
      marginRight: 10,
    },
    transactionInfo: {
      flex: 1,
      alignItems: 'flex-start',
      marginRight: 8, 
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    transactionName: {
      fontWeight: 'bold',
      fontSize: 16,
      width: 140
    },
    transactionDate: {
      color: '#888',
    },
    transactionAmount: {
      width: 180, 
      alignItems: 'flex-end',
    },
    transactionCategory: {
      fontSize: 16,
      color: '#888',
      width: 200
    },
    transactionAmountText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#1A1A2C',
      marginBottom: 2
    },
    editIconContainer: {
      marginLeft: 8,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
    addButtonContainer: {
      padding: 16,
    },
    addButton: {
      backgroundColor: '#35BA52',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      flexDirection: 'row', 
      justifyContent: 'center',
    },
    addIcon: {
      marginRight: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    editModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iconImage: {
      width: 35,
      height: 35,
    },
    deleteIconContainer: {
      marginLeft: 8,
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
    groupedTransactionCard: {
      backgroundColor: '#FFFFFF', 
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4, 
      borderWidth: 1, 
      borderColor: '#E0E0E0', 
    },
    separator: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginLeft: 3,
      marginVertical: 8,
    },
    dateHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333', 
    },
    transactionCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    dateNavigation: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    dateDisplay: {
      marginHorizontal: 10,
      fontSize: 18,
    },
    modalContent: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 20,
    },
    modalOption: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    modalOptionText: {
      fontSize: 18,
    },
    filterBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 5,  
    },
  
  });
  