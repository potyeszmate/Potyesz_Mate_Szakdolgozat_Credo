import { StyleSheet } from "react-native";

export const AddBudgetStyles = StyleSheet.create({
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
      flexDirection: 'row',
    },
    leftSide: {
      flex: 1,
    },
    rightSide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold'
    },
    incomeText: {
      fontSize: 14,
      color: '#7E8086',
      marginTop: 4,
    },
    editButton: {
      borderWidth: 1,
      borderColor: '#149E53',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#FFF',
      height: 35,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButtonText: {
      color: '#149E53',
      fontSize: 14,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
      alignItems: 'center',
    },
    contentContainer: {
      padding: 16,
    },
    input: {
      borderColor: '#CCC',
      borderWidth: 1,
      marginBottom: 18,
      padding: 8,
      fontSize: 16,
      borderRadius: 10,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    sheetTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
    },
    updateButtonTouchable: {
      backgroundColor: '#35BA52',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 20
    },
    updateButtonText: {
      color: 'white',
      fontSize: 16,
    },
});

export const BudgetStyles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingTop: 13,
      paddingBottom: 13,
      marginHorizontal: 10, 
  
      },
      leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 8,
      },
      iconImage: {
        width: 35,
        height: 35,
        marginLeft: -13
      },
      categoryText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        flexWrap: 'nowrap', 
      },
      amountText: {
        color: '#1A1A2C',
        flexDirection: 'row',
      },
      amountValueText: {
        color: '#1A1A2C',
      },
      amountOutOfText: {
        color: '#7E8086',
      },
      Total_ammountText: {
       color: '#7E8086',
      },
      rightSection: {
        flex: 1,
        alignItems: 'flex-end',
      },
      leftText: {
        fontSize: 16,
        paddingTop: 5,
        flexDirection: 'row',
        marginRight: -2
      },
      leftValueText: {
        color: '#1A1A2C',
      },
        leftOutOfText: {
        color: '#7E8086',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      textContainer: {
        paddingLeft: 10
      },
      iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: -11,
        marginLeft: 1
      },
  
});
  
export const BudgetDetailStyles = StyleSheet.create({
    titleStyle: {
      textAlign: 'center',
      fontWeight: 'bold',  
      fontSize: 20,        
      marginVertical: 10, 
      color: '#333',      
    },
});

export const BudgetInputStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      elevation: 5,
      width: '80%',
      alignSelf: 'center',
      marginTop: 'auto',
    },
    inputWrapper: {
      marginBottom: 5,
    },
    label: {
      fontSize: 16,
      marginBottom: 4,
      color: '#333',
      paddingTop: 20
    },
    addButton: {
      backgroundColor: '#35BA52',
      borderRadius: 14,
      paddingVertical: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      bottom: -10
    },
    input: {
      borderBottomWidth: 1,
      padding: 10,
      fontSize: 16,
      color: '#333',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingTop: -40,
      textAlign: 'center',
      color: 'grey',
    },
    dropDownStyle: {
      backgroundColor: '#fafafa',
    },
    pickerContainer: {
      height: 40,
      marginBottom: 10,
    },
});
  
export const BudgetItemStyles = StyleSheet.create({
    budgetContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      marginVertical: 20,
      padding: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    chart: {
      height: 20,
      backgroundColor: 'blue', 
      borderRadius: 5,
    },
    amount: {
      fontSize: 16,
    },
});

export const BudgetSummaryStyles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 16,
      marginTop: 10,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1,
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 
    },
    summaryContainer: {
    },
    expenseSummaryText: {
      fontSize: 16,
      color: '#888',
    },
    amountLeftText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 8,
      paddingBottom: 10, 
    },
    spentSetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 20
    },
    spentText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 2
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    setText: {
        fontSize: 16,
        color: '#888',
        marginRight: 3
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 4
      },
      separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginBottom: 2, 
        marginTop: 2, 
      },
      editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#1A1A2C',
        marginRight: 4, 
        width: '50%', 
        height: 45,
      },      
      editButtonText: {
        color: '#1A1A2C',
        fontSize: 16,
        fontWeight: 'bold',
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
    monthSelectorContainer: {
      position: 'absolute',
      top: 0,
      right: -3,
      zIndex: 1,
    },
    monthSelectorCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      flexDirection: 'row',
      alignItems: 'center',
    },
    monthSelector: {
      flex: 1,
      color: '#000000',
      paddingRight: 30,
    },
    monthSelectorIcon: {
      position: 'absolute',
      right: 10,
    },
});