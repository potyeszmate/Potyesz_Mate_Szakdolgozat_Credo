import { ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


  const ProgressBar = ({ label, amount, percentage, color }) => (
    <View style={styles.progressContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>
          {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

const CashFlowSummary = ({ totalIncome, totalExpenses, netCashFlow }) => {
    const total = totalIncome + totalExpenses;
    const incomePercentage = (totalIncome / total) * 100;
    const expensesPercentage = (totalExpenses / total) * 100;
  
    return (
      <View style={styles.card}>
        
        <Text style={styles.title}>Pénzáramlás</Text>
        <Text style={styles.subtitle}>Kevesebbet költök, mint amennyit keresek?</Text>
        <View style={styles.netCashFlowContainer}>
          <Text style={styles.netCashFlow}>
            {netCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
          {netCashFlow < 0 && (
            <MaterialIcons name="warning" size={24} color="red" style={styles.warningIcon} />
          )}
        </View>
        <ProgressBar label="Bevétel" amount={totalIncome} percentage={incomePercentage} color="#4CAF50" />
        <ProgressBar label="Kiadások" amount={totalExpenses} percentage={expensesPercentage} color="#F44336" />
      </View>
    );
  };
  
const styles = StyleSheet.create({
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
  
  export default CashFlowSummary;
