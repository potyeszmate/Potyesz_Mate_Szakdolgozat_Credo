import React from 'react';
import { View, Text } from 'react-native';
import { BudgetItemStyles } from './BudgetComponentStyles';

const BudgetItem: React.FC<any> = ({ name, totalAmount, spentAmount }) => {
  const percentageSpent = (spentAmount / totalAmount) * 100;

  return (
    <View style={BudgetItemStyles.budgetContainer}>
      <View style={BudgetItemStyles.rowContainer}>
        <Text style={BudgetItemStyles.name}>{name}</Text>
      </View>
      <View style={BudgetItemStyles.rowContainer}>
        <View style={[BudgetItemStyles.chart, { width: `${percentageSpent}%` }]} />
      </View>
      <View style={BudgetItemStyles.rowContainer}>
        <Text style={BudgetItemStyles.amount}>{spentAmount}</Text>
        <Text style={BudgetItemStyles.amount}>{totalAmount}</Text>
      </View>
    </View>
  );
};

export default BudgetItem;
