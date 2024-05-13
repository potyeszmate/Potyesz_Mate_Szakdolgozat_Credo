import React, { useEffect, useState } from 'react';
import { View, Text, Image  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { months } from './BalanceComponentConstants';
import { YourBalanceStyles } from './BalanceComponentStyles';
import { languages } from '../../commonConstants/sharedConstants';

const YourBalance = ({ balance, incomes, transactions, selectedLanguage, symbol, conversionRate, loading }) => {  

  const ArrowDown = require('../../assets/arrow-down-circle.png');
  const ArrowUp = require('../../assets/arrow-up-circle.png');

  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonthIndex);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);


  console.log("selectedLanguage in Balance: ", selectedLanguage)
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
    <View style={YourBalanceStyles.cardContainer}>
    
    <View style={YourBalanceStyles.monthSelectorContainer}>
      <Picker
        selectedValue={selectedMonth.toString()}
        onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemIndex)}
        style={YourBalanceStyles.monthSelector}
        mode="dropdown"
      >
        {months.map((month, index) => (
          <Picker.Item label={month} value={index.toString()} key={index} />
        ))}
      </Picker>
    </View>

      <View style={YourBalanceStyles.balanceContainer}>
        <Text style={YourBalanceStyles.balanceText}>{languages[selectedLanguage].yourBalance}</Text>
        {loading ? (
          <Text style={YourBalanceStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
        ) : (
          <Text style={YourBalanceStyles.balanceAmount}>
            {symbol === 'HUF'
              ? `${Math.round(parseFloat(balance) * conversionRate)} ${symbol}`
              : `${(parseFloat(balance) * conversionRate).toFixed(2)} ${symbol}`}
          </Text>
        )}
      </View>

      <View style={YourBalanceStyles.infoContainer}>
        <View style={[YourBalanceStyles.infoBox, YourBalanceStyles.incomeInfoBox, YourBalanceStyles.leftBox]}>
          <Image source={ArrowUp} resizeMode="contain" />
          <View style={YourBalanceStyles.infoContent}>
            <Text style={YourBalanceStyles.infoText}>{languages[selectedLanguage].income}</Text>
            {loading ? (
            <Text style={YourBalanceStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={YourBalanceStyles.infoAmount}>
              {symbol === 'HUF'
                ? Math.round(totalIncome * conversionRate)
                : (totalIncome * conversionRate).toFixed(2)}{' '}{symbol}
            </Text>
          )}
          </View>
        </View>

        <View style={{ marginHorizontal: 0.00001 }} />

        <View style={[YourBalanceStyles.infoBox, YourBalanceStyles.expenseInfoBox, YourBalanceStyles.rightBox]}>
          <Image source={ArrowDown} resizeMode="contain" />
          <View style={YourBalanceStyles.infoContent}>
            <Text style={YourBalanceStyles.infoText}>{languages[selectedLanguage].expense}</Text>
            {loading ? (
            <Text style={YourBalanceStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={YourBalanceStyles.infoAmount}>
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

export default YourBalance;
