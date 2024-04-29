import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionItem: React.FC<any> = ({ name, category, value, date, notes }) => {
  return (
    <View style={styles.transactionItem}>
      <Text>Name: {name}</Text>
      <Text>Category: {category}</Text>
      <Text>Value: {value}</Text>
      <Text>Date: {date.toISOString().split('T')[0]}</Text>
      {notes && <Text>Notes: {notes}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default TransactionItem;
