import { StyleSheet } from "react-native";

export const CashFlowSummaryStyles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    incomeLabel: {
      fontSize: 18,
      color: 'green',
    },
    incomeValue: {
      fontSize: 18,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'left', 
      alignSelf: 'flex-start', 
      marginBottom: 5,

    },
    subtitle: {
      fontSize: 16,
      color: 'gray',
      textAlign: 'left',
      alignSelf: 'flex-start', 
      marginBottom: 10,
    },
    netCashFlowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', 
      width: '100%', 
      marginBottom: 20
    },
    netCashFlow: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'left', 
    },
    warningIcon: {
      marginLeft: 8,
    },
    expensesLabel: {
      fontSize: 18,
      color: 'red',
      textAlign: 'left',
    },
    expensesValue: {
      fontSize: 18,
      textAlign: 'left',
    },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      bar: {
        flex: 1, 
        height: 20, 
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 5, 
      },
      barText: {
        color: '#ffffff', 
        fontWeight: 'bold',
      },
      card: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
        elevation: 3, 
        marginTop: 20,
        marginHorizontal: 20, 
      },
  progressContainer: {
    width: '100%', 
    marginBottom: 10, 
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, 
  },
  amount: {
    fontWeight: 'bold',
    color: '#000', 
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0', 
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  });
  