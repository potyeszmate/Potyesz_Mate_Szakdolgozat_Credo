import React from 'react';
import { View, Text, FlatList, StyleSheet,Image, ScrollView, Dimensions } from 'react-native';
import TransactionItem from './TransactionItem';

import { Feather } from '@expo/vector-icons'; 

const iconMapping: any = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),

  Housing: require('../../assets/Housing.png'),
  Transport : require('../../assets/Transport.png'),
  Sport : require('../../assets/Sport.png'),
};

const TransactionList: React.FC<any> = ({ transactions, currency, conversionRate, symbol }) => {

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Image source={iconMapping[item.category]} style={styles.iconImage} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{item.name}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.transactionAmountText}>
                  - {currency === 'HUF' ? 
                    Math.round(parseFloat(item.value) * conversionRate) :
                    (parseFloat(item.value) * conversionRate).toFixed(2)
                  } {symbol}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(item.date.toDate()).toLocaleDateString('hu-HUN', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  {new Date(item.date.toDate()).toLocaleTimeString('hu-HUN', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            {index !== transactions.length - 1 && <View style={styles.separator} />}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // marginTop: 5,
  },
  iconImage: {
    width: 35,
    height: 35,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 15,
    paddingBottom: 12,
    paddingTop: 12,
    // marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    // marginLeft: 5, // Adjust this value to align with the transactionInfo
    // marginRight: 5, // Add a bigger right margin
    // marginBottom: 2, // Add a bigger right margin
    // marginTop: 2, // Add a bigger right margin
    // marginVertical: 18,
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
    color: '#1A1A2C',
  },
});


export default TransactionList;
