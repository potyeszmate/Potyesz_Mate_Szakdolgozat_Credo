import React from 'react';
import { View, Text, FlatList, StyleSheet,Image, ScrollView } from 'react-native';
import TransactionItem from './TransactionItem';

import { Feather } from '@expo/vector-icons'; 

const iconMapping = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),

  Housing: require('../../assets/Housing.png'),
  Transport : require('../../assets/Transport.png'),
  Sport : require('../../assets/Sport.png'),
};

const TransactionList = ({ transactions }) => {


  return (
    <View style={styles.listContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              {/* <Feather name={item.icon} size={24} color="#333" /> */}
              <Image source={iconMapping[item.category]} style={styles.iconImage} />

            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionAmountText}>${item.value}</Text>
              <Text style={styles.transactionDate}>
                {item.date.toDate().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                {item.date.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    marginTop: 10,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    width: '100%',
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
  transactionCategory: {
    fontSize: 16,
    color: '#888',
  },
  transactionAmountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A1A2C', // You can change the color as needed
  },
});

export default TransactionList;
