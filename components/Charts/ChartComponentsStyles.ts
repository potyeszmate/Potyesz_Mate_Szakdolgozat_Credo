import { StyleSheet } from "react-native";

export const BarchartSpendingStyles = StyleSheet.create({
    noDataText: {
      textAlign: 'center',
      marginVertical: 10,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1, 
    },
    barChartStyle: {
      marginVertical: 8,
      marginRight: 20,
      marginLeft: 20, 
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      elevation: 5,
      alignItems: 'center',
      marginTop: 20
    },
});

export const DateLineChartStyles = StyleSheet.create({
    chartContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      elevation: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    chart: {
      marginTop: 10,
    },
    noDataText: {
      fontSize: 16,
    },
});

export const DonutChartStyles = StyleSheet.create({
    chartContainer: {
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      elevation: 5,
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    totalAmountText: {
      marginTop: 10,
      marginBottom: 20,
      fontSize: 16,
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      width: '100%',
      marginBottom: 10, 
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 40,
      marginBottom: 10
    },
    noDataText: {
      fontSize: 16,
    },
   
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 5,
    },
});

export const ImportanceBarChartStyles = StyleSheet.create({
    scrollViewContent: {
      paddingBottom: 20,
    },
    noDataText: {
        marginTop: 20, 
      },
    cardStyle: {
      borderRadius: 20,
      padding: 10, 
      margin: 20,
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 10,
    },
    warningContainer: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
      marginRight: 12
    },
    warningText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#FFA500',
    },
});

export const LoanPaymentChartsStyles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: 20, 
      marginBottom: 60
    },
    chart: {
      marginVertical: 10,
      borderRadius: 20, 
      borderWidth: 1, 
      borderColor: 'transparent', 
    },
    chartTitle: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 10, 
      marginTop: 16
    },
    noDataText: {
      marginTop: 20, 
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
        backgroundColor: '#35BA52'
      },
});

export const PieChartStockAndCryptoStyles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      marginBottom: 16,
    },
    portfolioText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    totalValueText: {
      fontSize: 22,
      color: '#000000',
      marginBottom: 10,
    },
    countText: {
      fontSize: 16,
      color: '#666',
    },
    stockName: {
      fontSize: 16,
      color: '#000',
    },
    stockValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    value: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
      marginRight: 120
    },
    dot: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      marginTop: 16,
    },
    legendText: {
      fontSize: 14,
      color: '#333',
    },
    legendAmount: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    labelAndValueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    progressBarBackground: {
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      height: 10,
      flex: 1, 
      width: '100%'
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressItem: {
      marginRight:40
    },
  
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    labelAndValueContainer: {
      flexDirection: 'column', 
      justifyContent: 'flex-start',
      flex: 1,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '70%', 
    },
    label: {
      fontSize: 14,
      color: '#000',
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
    },
    progressBarOverall: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      height: 10,
      width: '100%', 
    },
  
    progressBarFill: {
      borderRadius: 10,
      height: '100%',
    },
    percentageText: {
      fontSize: 14,
      color: '#A9A9A9',
      textAlign: 'right',
      paddingLeft: 10,
      marginRight: -40
  
    },
  });