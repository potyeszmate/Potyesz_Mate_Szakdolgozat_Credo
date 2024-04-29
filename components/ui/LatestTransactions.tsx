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

const LatestTransactions: React.FC<any> = ({ transactions, selectedLanguage, symbol, conversionRate, currency, isLoading}) => {
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
  
  const now = new Date();
    
  const sortedTransactions = transactions
    .filter((transaction: any) => {
      const transactionDate = new Date(transaction.date.toDate());
      return transactionDate <= now;
    })
    .sort((a: any, b: any) => b.date.toDate() - a.date.toDate())
    .slice(0, 3);  



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{languages[selectedLanguage].latestTransactions}</Text>
        <TouchableOpacity onPress={handleTransactionsListClick}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <TransactionList transactions={sortedTransactions} currency={currency} conversionRate={conversionRate} symbol={symbol} isLoading= {isLoading} />
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
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 
      paddingBottom: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7E8086',
  },
});

export default LatestTransactions;
