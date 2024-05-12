import { StyleSheet } from "react-native";

export const ExpensesScreenStyles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    space: {
      marginBottom: 10,
    },
    recurringCard: {
      backgroundColor: 'white',
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 20,
      elevation: 2,
      borderColor: '#F3F4F7',
      borderWidth: 1
      
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      marginLeft: 12,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 4
    },
    iconContainer: {
      borderWidth: 2,
      borderColor: '#FFFFFF',
      borderRadius: 14,
    },
    icon: {
      width: 40,
      height: 40,
    },
    
    subtitleText: {
      color: 'grey',
    },
    navigationArrow: {
      fontSize: 24,
      color: 'black',
    },
  });

  export const RecurringStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      maxHeight: '65%',
      marginBottom: 20,
    },
    addButton: {
      position: 'absolute',
      bottom: 20, 
      left: 21, 
      right: 21, 
      backgroundColor: '#35BA52',
      borderRadius: 20,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      zIndex: 1,
    },
    addIcon: {
      marginRight: 8,
    },
    loadingText: {
      fontSize: 16,
      color: '#888',
      fontStyle: 'italic',
    },  
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    space: {
      marginBottom: 20, 
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#F3F4F7',
      marginLeft: 16,
      marginRight: 16,
    },
    transactionIcon: {
      marginRight: 10,
    },
    iconImage: {
      width: 40,
      height: 40,
    },
    transactionInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    transactionName: {
      fontWeight: 'bold',
      fontSize: 16,
      paddingBottom: 4,
    },
    transactionCategory: {
      fontSize: 16,
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    transactionAmountValue: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    transactionDate: {
      color: '#888',
    },
    deleteIconContainer: {
      marginLeft: 8,
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20, 
      overflow: 'hidden', 
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      justifyContent: 'flex-end', 
    },
    categoryDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      width: 6,
      height: 6,
      borderRadius: 4,
      backgroundColor: '#7E8086',
      marginHorizontal: 8,
    },  
    contentContainer: {
      flex: 1,
      alignItems: 'center',
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
    editIconContainer: {
      marginLeft: 8,
    },
    total: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginBottom: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#F3F4F7',
    },
    totalCard: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#F3F4F7',
      backgroundColor: '#fff',
      marginLeft: 16,
      marginRight: 16,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 16,
      color: '#7E8086',
    },
    totalSubscriptions: {
      fontSize: 16,
      color: '#7E8086',
    },
    totalValue: {
      fontSize: 28,
      color: '#000',
      fontWeight: 'bold',
    },
    loadingIndicator: {
      alignSelf: 'center',
      marginTop: 200, 
    },
    pastDateText: {
      color: 'red',
    },
    warningIcon: {
      marginLeft: 5,
      color: 'red',
    },
  });
  
  