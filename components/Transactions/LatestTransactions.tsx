import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';
import { LatestTransactionsStyles } from './TransactionComponentStyles';
import Transaction from './Transaction';

const LatestTransactions: React.FC<any> = ({ incomes, transactions, selectedLanguage, symbol, conversionRate, currency, isLoading}) => {
  const navigation = useNavigation();

  const handleTransactionsListClick = () => {
    // @ts-ignore
    navigation.navigate('Transactions', {
      symbol: symbol,
      selectedLanguage: selectedLanguage,
      conversionRate: conversionRate,
      currency: currency
    });
  };
  
  // const now = new Date();

    const combinedData = [...transactions, ...incomes].sort((a, b) => {
        const dateA = new Date(a.date.toDate());
        const dateB = new Date(b.date.toDate());
        return dateB - dateA;
    }).slice(0, 3);

  return (
    <View style={LatestTransactionsStyles.container}>
      <View style={LatestTransactionsStyles.header}>
        <Text style={LatestTransactionsStyles.title}>{languages[selectedLanguage].latestTransactions}</Text>
        <TouchableOpacity onPress={handleTransactionsListClick}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Transaction transactions={combinedData} currency={currency} conversionRate={conversionRate} symbol={symbol} isLoading= {isLoading} />
    </View>
  );
};

export default LatestTransactions;
