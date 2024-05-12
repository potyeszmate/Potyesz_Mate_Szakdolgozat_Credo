import { StyleSheet } from "react-native";

export const SavingScreenStyles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: '#FAFAFA', 
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

  export const goalStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    goalContainer: {
      flex: 1,
    },
    totalSavedContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
    },
    totalSavedText: {
      fontSize: 18,
      color: '#1A1A2C',
    },
    totalSavedAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1A1A2C',
    },
    addButtonContainer: {
      padding: 16,
    },
    addButton: {
      backgroundColor: '#35BA52',
      borderRadius: 20,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 16
    },
    addIcon: {
      marginRight: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 8,
      elevation: 5,
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
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
  });

  export const CryptoStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginLeft: 10,
      marginRight: 10
    },
    card: {
      borderRadius: 8,
      padding: 15,
      marginVertical: 8,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 1 },
      // shadowOpacity: 0.22,
      // shadowRadius: 2.22,
      // elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#333'
    },
    dotSeparator: {
      fontSize: 24,
      marginHorizontal: 8,
      color: '#333',
    },
    totalValueText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    small: {
      fontSize: 14,
      color: '#666'
    },
    containerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff', 
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    separator: {
      height: 1,
      backgroundColor: '#E2E2E2', 
      width: '91%', 
      alignSelf: 'center',
    },
    containerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    sectionIcon: {
      marginRight: 14,
      marginBottom: 1
    },
    overlayContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,0.92)',
      zIndex: 2,
      height: 200,
      marginTop: 10
  },
    left: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    right: {
      flex: 1,
      alignItems: 'flex-end',
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight:10

    },
    bold: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    changeContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
    },
    green: {
      color: 'green',
    },
    resultsScrollView: {
      maxHeight: 200, 
    },
    red: {
      color: 'red',
    },
    searchContainer: {
      padding: 10,
      backgroundColor: '#EFEFEF',
      borderRadius: 10,
      marginVertical: 10
    },
    searchInput: {
      backgroundColor: 'white'
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    symbol: {
      fontSize: 14,
      color: '#888',
    },
    cryptoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconStyle: {
      marginLeft: 5,
    },
    cryptoValue: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4, 
    },
    percentChange: {
      fontSize: 14,
    },

    title: {
      fontSize: 22,
      marginTop: 20,
    },
    cryptoContainer: {
      backgroundColor: '#fff', 
      borderRadius: 8,
      marginVertical: 10,
      width: '95%', 
      alignSelf: 'center', 
    },
    searchBarContainer: {
      backgroundColor: 'transparent', 
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: 10,
    },
    searchBarInputContainer: {
      backgroundColor: 'white',
      borderRadius: 20, 
      height: 45, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    searchBarInput: {
      color: 'black', 
      backgroundColor: 'white', 
      borderRadius: 15, 
    },
  });
  