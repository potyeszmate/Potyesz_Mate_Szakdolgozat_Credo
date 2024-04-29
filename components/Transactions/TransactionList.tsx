import React from 'react';
import { View, Text, FlatList, StyleSheet,Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
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

const TransactionList: React.FC<any> = ({ transactions, currency, conversionRate, symbol, isLoading }) => {

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
}

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
    paddingBottom: 12,
    paddingTop: 12,
    borderRadius: 8,
    elevation: 2,
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    
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
