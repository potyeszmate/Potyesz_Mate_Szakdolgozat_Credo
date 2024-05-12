import { StyleSheet } from "react-native";

export const MonthlyIncomeStyles = StyleSheet.create({
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
      fontSize: 15,
      color: '#7E8086',
      fontWeight: 'bold'
    },
    incomeText: {
      fontSize: 20,
      color: '#000',
      marginTop: 4,
      fontWeight: 'bold'
    },
    editButton: {
      borderWidth: 1,
      borderColor: '#149E53',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#FFF',
      height: 35,
      width: 66,
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

  export const YourBalanceStyles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 16,
      marginTop: 16,
      width: '90%',
      alignSelf: 'center',
      elevation: 4,
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 
    },
  
    loadingText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontStyle: 'italic',
    },  
    balanceContainer: {
      paddingBottom: 1,
    },
    balanceText: {
      color: '#7E8086',
      fontSize: 16,
      paddingBottom: 5,
      fontWeight: 'bold',
    },
    balanceAmount: {
      fontSize: 29,
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 70,
      paddingHorizontal: 10,
      flex: 1,
    },
    infoContent: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 10,
  
    },
    infoText: {
      color: '#FFFFFF',
      fontSize: 14,
  
    },
    infoAmount: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    leftBox: {
      marginRight: 2
    },
    rightBox: {
      marginLeft: 2
    },
    incomeInfoBox: {
      backgroundColor: '#35BA52',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      marginRight: 10, 
    },
    expenseInfoBox: {
      backgroundColor: '#35BA52',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      marginLeft: 10, 
    },
    // monthSelectorContainer: {
    //   position: 'absolute',
    //   top: 16,
    //   right: 16,
    //   zIndex: 1,
    // },
    // monthSelectorCard: {
    //   backgroundColor: '#FFFFFF',
    //   borderRadius: 20,
    //   padding: 8,
    //   borderWidth: 1,
    //   borderColor: '#F0F0F0',
    //   flexDirection: 'row',
    //   alignItems: 'center',
    // },
    monthSelectorContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: 'white',
      borderRadius: 17,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      padding: 10,
      width: 140, // Increased width to accommodate longer month names
      height: 35,
      justifyContent: 'center', // This helps center the picker vertically
      alignItems: 'center', // Center align items
      overflow: 'hidden',
    },
    monthSelector: {
      color: '#000',
      width: '120%', // Ensure it fills the container
      height: '100%', // Ensure it fills the container vertically
      backgroundColor: 'transparent',
      // padding: -10, // Reduce or remove padding
    },
    monthSelectorIcon: {
      position: 'absolute',
      // right: 10,
    },
    // monthSelectorContainer: {
    //   position: 'absolute',
    //   top: 16,
    //   right: 16,
    //   backgroundColor: 'white',
    //   borderRadius: 20,
    //   padding: 8
    // },
    // monthSelector: {
    //   height: 44,
    //   width: 150,
    // },
  });
  