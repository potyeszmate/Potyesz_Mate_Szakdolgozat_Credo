import { ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


  const ProgressBar = ({ label, amount, percentage, color }) => (
    <View style={styles.progressContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>
          {amount.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

// Add this inside your SpendingAnalytics component
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
            {netCashFlow.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF' })}
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
    // ... other styles ...
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // Add other styling to match the provided design
    },
    incomeLabel: {
      fontSize: 18,
      color: 'green',
      // Add other styling to match the provided design
    },
    incomeValue: {
      fontSize: 18,
      // Add other styling to match the provided design
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'left', // Align to the left
      alignSelf: 'flex-start', // Ensures alignment to the left within a flex container
      marginBottom: 5,

    },
    subtitle: {
      fontSize: 16,
      color: 'gray',
      textAlign: 'left', // Align to the left
      alignSelf: 'flex-start', // Ensures alignment to the left within a flex container
      marginBottom: 10,
    },
    netCashFlowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align the children to the start (left)
      width: '100%', // Take full width to align children properly
      marginBottom: 20
    },
    netCashFlow: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'left', // Align to the left
    },
    warningIcon: {
      marginLeft: 8, // Space between the warning icon and the net cash flow text
    },
    expensesLabel: {
      fontSize: 18,
      color: 'red',
      textAlign: 'left',

      // Add other styling to match the provided design
    },
    expensesValue: {
      fontSize: 18,
      textAlign: 'left',

      // Add other styling to match the provided design
    },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      bar: {
        flex: 1, // Take up all available width
        height: 20, // Set fixed height for bars
        borderRadius: 10, // Rounded corners
        justifyContent: 'center', // Center text vertically
        paddingHorizontal: 5, // Padding on the sides
      },
      barText: {
        color: '#ffffff', // Text color inside the bar
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
        elevation: 3, // for Android
        marginTop: 20,
        marginHorizontal: 20, // Add horizontal margin for spacing from screen edges
      },
      // netCashFlowContainer: {
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   marginBottom: 20, // Space between the net cash flow and progress bars
      // },
  progressContainer: {
    width: '100%', // Make sure the progress bar takes the full width of the card
    marginBottom: 10, // Spacing between each progress bar
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // Spacing between label/amount and progress bar
  },
  amount: {
    fontWeight: 'bold',
    color: '#000', // Color for the text amount
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0', // Background color of the progress bar
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  });
  
  export default CashFlowSummary;
