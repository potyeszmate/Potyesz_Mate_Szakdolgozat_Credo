import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import TransactionItem from './TransactionItem';

import { Feather } from '@expo/vector-icons'; 


const TransactionList = ({ transactions }) => {

  return (
    <ScrollView
      style={styles.listContainer}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Feather name="dollar-sign" size={24} color="#333" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionDate}>
                {item.date.toDate().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionAmountText}>- ${item.value}</Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
  

};
const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 20,
    height: 250, // Set the desired height
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    width: '80%',
    marginLeft: 'auto', // Center the card horizontally
    marginRight: 'auto', // Center the card horizontally
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionDate: {
    color: '#888',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'red', // You can change the color as needed
  },
});

export default TransactionList;
