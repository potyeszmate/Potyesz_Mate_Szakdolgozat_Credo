import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BudgetItem: React.FC<any> = ({ name, totalAmount, spentAmount }) => {
  const percentageSpent = (spentAmount / totalAmount) * 100;

  return (
    <View style={styles.budgetContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.chart, { width: `${percentageSpent}%` }]} />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.amount}>{spentAmount}</Text>
        <Text style={styles.amount}>{totalAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BudgetItem;
