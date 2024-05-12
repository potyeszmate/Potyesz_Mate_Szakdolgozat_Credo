import React from 'react';
import { View, Text, FlatList, StyleSheet,Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { transactionIconMapping } from './TransactionComponentConstants';
import { TransactionStyles } from './TransactionComponentStyles';
const Transaction: React.FC<any> = ({ transactions, currency, conversionRate, symbol, isLoading }) => {

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
}

return (
  <View style={TransactionStyles.listContainer}>
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View>
          <View style={TransactionStyles.transactionItem}>
            <View style={TransactionStyles.transactionIcon}>
              <Image source={transactionIconMapping[item.category]} style={TransactionStyles.iconImage} />
            </View>
            <View style={TransactionStyles.transactionInfo}>
              <Text style={TransactionStyles.transactionName}>{item.name}</Text>
              <Text style={TransactionStyles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={TransactionStyles.transactionAmount}>
              <Text style={[
                TransactionStyles.transactionAmountText,
                { color: item.category === 'Income' ? 'green' : 'red' }
              ]}>
                {item.category === 'Income' ? 
                  `${(parseFloat(item.value) * conversionRate).toFixed(2)} ${symbol}` :
                  `- ${(parseFloat(item.value) * conversionRate).toFixed(2)} ${symbol}`
                }
              </Text>
              <Text style={TransactionStyles.transactionDate}>
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
          {index !== transactions.length - 1 && <View style={TransactionStyles.separator} />}
        </View>
      )}
    />
  </View>
);
};
export default Transaction;
