import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionItemStyles } from './TransactionComponentStyles';

const TransactionItem: React.FC<any> = ({ name, category, value, date, notes }) => {
  return (
    <View style={TransactionItemStyles.transactionItem}>
      <Text>Name: {name}</Text>
      <Text>Category: {category}</Text>
      <Text>Value: {value}</Text>
      <Text>Date: {date.toISOString().split('T')[0]}</Text>
      {notes && <Text>Notes: {notes}</Text>}
    </View>
  );
};

export default TransactionItem;
