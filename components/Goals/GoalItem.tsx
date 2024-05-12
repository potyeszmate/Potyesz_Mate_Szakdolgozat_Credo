import React from 'react';
import { View, Text } from 'react-native';
import { GoalItemStyles } from './GoalComponentStyles';

const GoalItem: React.FC<any> = ({ name, Date, currentAmount, totalAmount }) => {
  const percentageSpent = (currentAmount / totalAmount) * 100;

  return (
    <View style={GoalItemStyles.budgetContainer}>
      <View style={GoalItemStyles.rowContainer}>
        <Text style={GoalItemStyles.name}>{name}</Text>
      </View>
      <View style={GoalItemStyles.rowContainer}>
        <Text>{Date.toDate().toLocaleDateString()}</Text>
      </View>
      <View style={GoalItemStyles.rowContainer}>
        <View style={[GoalItemStyles.chart, { width: `${percentageSpent}%` }]} />
      </View>
      <View style={GoalItemStyles.rowContainer}>
        <Text style={GoalItemStyles.amount}>{currentAmount}</Text>
        <Text style={GoalItemStyles.amount}>{totalAmount}</Text>
      </View>
    </View>
  );
};

export default GoalItem;
