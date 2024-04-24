// LatestTransactions.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TransactionList from './TransactionList';
import { useNavigation } from '@react-navigation/native';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const LatestTransactions: React.FC<any> = ({ transactions, selectedLanguage, symbol, conversionRate, currency}) => {
  const navigation = useNavigation();

  const handleTransactionsListClick = () => {
    // @ts-ignore
    navigation.navigate('TransactionsList', {
      symbol: symbol,
      selectedLanguage: selectedLanguage,
      conversionRate: conversionRate,
      currency: currency
    });
  };
  
  const now = new Date();
  console.log("Current time:", now.toString()); // Log the current time for debugging

  // Filter and sort transactions up to the current moment
  const sortedTransactions = transactions
    .filter((transaction: any) => {
      const transactionDate = new Date(transaction.date.toDate());
      // console.log("Transaction time:", transactionDate.toString()); // Log each transaction time for debugging
      return transactionDate <= now;
    })
    .sort((a: any, b: any) => b.date.toDate() - a.date.toDate())
    .slice(0, 3);  // Get the latest 3 transactions

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{languages[selectedLanguage].latestTransactions}</Text>
        <TouchableOpacity onPress={handleTransactionsListClick}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {/* Render your TransactionList component passing sortedTransactions */}
      <TransactionList transactions={sortedTransactions} currency={currency} conversionRate={conversionRate} symbol={symbol} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 16,
      marginTop: 20,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
      shadowOpacity: 0.1, // Shadow for iOS
      shadowRadius: 4, // Shadow for iOS
      borderColor: '#E0E0E0', // A slightly darker shade for the border
      paddingBottom: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7E8086',
  },
});

export default LatestTransactions;
