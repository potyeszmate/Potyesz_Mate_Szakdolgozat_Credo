import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image  } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';



const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const YourBalance = ({ balance, incomes, transactions, selectedLanguage, symbol, conversionRate, loading }) => {

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  const ArrowDown = require('../../assets/arrow-down-circle.png');
  const ArrowUp = require('../../assets/arrow-up-circle.png');

  const [selectedMonth, setSelectedMonth] = React.useState('January');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const calculateTotals = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
  

    const calculatedTotalIncome = incomes.reduce((acc, { date, value }) => {
      if (!date || value == null) {
        return acc;
      }
      const incomeDate = new Date(date.seconds * 1000);
      if (incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear) {
        return acc + Number(value);
      }
      return acc;
    }, 0);
  
    const calculatedTotalExpense = transactions.reduce((acc, { date, value }) => {
      if (!date || value == null) {
        return acc;
      }
      const expenseDate = new Date(date.seconds * 1000);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        return acc + Number(value);
      }
      return acc;
    }, 0);

    setTotalIncome(calculatedTotalIncome);
    setTotalExpense(calculatedTotalExpense);
  };

  
  useEffect(() => {
    if (loading) return;


    calculateTotals();
  }, [incomes, transactions, loading]);
 
  if (balance === null) {
    return <Text>Loading balance...</Text>; 
  }
  
 
  return (
    <View style={styles.cardContainer}>
    

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{languages[selectedLanguage].yourBalance}</Text>
        {loading ? (
          <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
        ) : (
          <Text style={styles.balanceAmount}>
            {symbol === 'HUF'
              ? `${Math.round(parseFloat(balance) * conversionRate)} ${symbol}`
              : `${(parseFloat(balance) * conversionRate).toFixed(2)} ${symbol}`}
          </Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoBox, styles.incomeInfoBox, styles.leftBox]}>
          <Image source={ArrowUp} resizeMode="contain" />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>{languages[selectedLanguage].income}</Text>
            {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={styles.infoAmount}>
              {symbol === 'HUF'
                ? Math.round(totalIncome * conversionRate)
                : (totalIncome * conversionRate).toFixed(2)}{' '}{symbol}
            </Text>
          )}
          </View>
        </View>

        <View style={{ marginHorizontal: 0.00001 }} />

        <View style={[styles.infoBox, styles.expenseInfoBox, styles.rightBox]}>
          <Image source={ArrowDown} resizeMode="contain" />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>{languages[selectedLanguage].expense}</Text>
            {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={styles.infoAmount}>
              {symbol === 'HUF'
                ? Math.round(totalExpense * conversionRate)
                : (totalExpense * conversionRate).toFixed(2)}{' '}{symbol}
            </Text>
          )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    borderColor: '#E0E0E0', 
  },

  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },  
  balanceContainer: {
    paddingBottom: 1,
  },
  balanceText: {
    color: '#7E8086',
    fontSize: 16,
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 29,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 10,
    flex: 1,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,

  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,

  },
  infoAmount: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  leftBox: {
    marginRight: 2
  },
  rightBox: {
    marginLeft: 2
  },
  incomeInfoBox: {
    backgroundColor: '#35BA52',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 10, 
  },
  expenseInfoBox: {
    backgroundColor: '#35BA52',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 10, 
  },
  monthSelectorContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  monthSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthSelector: {
    flex: 1,
    color: '#000000',
    paddingRight: 30, 
  },
  monthSelectorIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default YourBalance;
