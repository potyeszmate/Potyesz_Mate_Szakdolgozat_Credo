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

  export const BalanceAnalyticsStyles = StyleSheet.create({
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
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export const CashFlowAnalyticsStyles = StyleSheet.create({
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
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export const RecurringAnalyticsStyles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 5
  },

  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
  },
  activeTabButton: {
    backgroundColor: '#35BA52',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
    borderColor: '#149E53',
    borderWidth: 0.6
  },
});

export const SpendingAnalyticsStyles = StyleSheet.create({
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
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
});

export const StocksAndCryptoAnalyticsStyles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
  },
  activeTabButton: {
    backgroundColor: '#35BA52',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
    borderColor: '#149E53',
    borderWidth: 0.6
  },
});

