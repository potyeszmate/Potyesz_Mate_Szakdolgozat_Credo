// LatestTransactions.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TransactionList from './TransactionList';
import { useNavigation } from '@react-navigation/native';

const LatestTransactions = ({ transactions }) => {
  const navigation = useNavigation();

  const handleTransactionsListClick = () => {
    navigation.navigate('TransactionsList');
  };

  // Sort transactions from latest to earliest
  const sortedTransactions = transactions
    .sort((a, b) => b.date.toDate() - a.date.toDate())
    .slice(0, 3); // Get the latest 3 transactions

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
        onPress={handleTransactionsListClick}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <TransactionList transactions={sortedTransactions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LatestTransactions;
