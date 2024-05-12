import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BudgetStyles } from './BudgetComponentStyles';
import { BudgetIconMapping } from './BudgetComponentConstants';

const Budget: React.FC<any> = ({ budget, transactions, currency, conversionRate, symbol, onDelete, onEdit }) => {
  const navigation = useNavigation(); 

  const navigateToBudgetDetails = (budgetId: any) => {
    // @ts-ignore
    navigation.navigate('Budget', { budgetId: budgetId, symbol: symbol, conversionRate: conversionRate });
  };

  const handleBudgetPress = (budgetId: any) => {
    navigateToBudgetDetails(budgetId);
  };
  
  const currentMonth = new Date().getMonth(); 
  const currentYear = new Date().getFullYear();

  const spentAmount = transactions
    .filter((transaction: any) => {
      const transactionDate = new Date(transaction.date.seconds * 1000); 
      return transaction.category === budget.Category && 
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((acc: number, transaction: any) => {
      return acc + (currency === 'HUF' ? 
        Math.round(parseFloat(transaction.value) * conversionRate) :
        parseFloat(transaction.value) * conversionRate);
    }, 0);

  const totalAmount = currency === 'HUF' ?
    Math.round(parseFloat(budget.Total_ammount) * conversionRate) :
    parseFloat(budget.Total_ammount) * conversionRate;

  const remainingAmount = totalAmount - spentAmount;
  const remainingColor = remainingAmount < 0 ? '#ff0000' : '#1A1A2C'; 


  return (
    <View style={BudgetStyles.cardContainer}>
      <View style={BudgetStyles.leftSection}>
        <Image style={BudgetStyles.iconImage} source={BudgetIconMapping[budget.Category]} />
        <View style={BudgetStyles.textContainer}>
          <Text style={BudgetStyles.categoryText}>{budget.Category}</Text>
          <Text style={BudgetStyles.amountText}>
            <Text style={BudgetStyles.amountValueText}>
              {spentAmount.toFixed(0)}{symbol}  
            </Text>
            <Text style={BudgetStyles.amountOutOfText}> out of </Text>
            <Text style={BudgetStyles.Total_ammountText}>
              {totalAmount.toFixed(0)} {symbol} 
            </Text>
          </Text>
        </View>
        <View style={BudgetStyles.rightSection}>
          <Text style={BudgetStyles.leftText}>
            <Text style={[BudgetStyles.leftValueText, {color: remainingColor}]}>
              {remainingAmount.toFixed(0)}{symbol} 
            </Text>
            <Text style={BudgetStyles.leftOutOfText}> left</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleBudgetPress(budget.id)} style={BudgetStyles.iconContainer}>
        <Feather name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};
  export default Budget;

