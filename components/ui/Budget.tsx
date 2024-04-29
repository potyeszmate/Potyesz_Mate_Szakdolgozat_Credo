/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const iconMapping: any = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),
  Housing: require('../../assets/Housing.png'),
  Transport: require('../../assets/Transport.png'),
  Sport: require('../../assets/Sport.png'),
};

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
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <Image style={styles.iconImage} source={iconMapping[budget.Category]} />
        <View style={styles.textContainer}>
          <Text style={styles.categoryText}>{budget.Category}</Text>
          <Text style={styles.amountText}>
            <Text style={styles.amountValueText}>
              {spentAmount.toFixed(0)}{symbol}  
            </Text>
            <Text style={styles.amountOutOfText}>out of </Text>
            <Text style={styles.Total_ammountText}>
              {totalAmount.toFixed(0)} {symbol} 
            </Text>
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.leftText}>
            <Text style={[styles.leftValueText, {color: remainingColor}]}>
              {remainingAmount.toFixed(0)}{symbol} 
            </Text>
            <Text style={styles.leftOutOfText}>left</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleBudgetPress(budget.id)} style={styles.iconContainer}>
        <Feather name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingTop: 13,
    paddingBottom: 13,
    marginHorizontal: 10, 

    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 8,
    },
    iconImage: {
      width: 35,
      height: 35,
      marginLeft: -13
    },
    categoryText: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 5,
      flexWrap: 'nowrap', 
    },
    amountText: {
      color: '#1A1A2C',
      flexDirection: 'row',
    },
    amountValueText: {
      color: '#1A1A2C',
    },
    amountOutOfText: {
      color: '#7E8086',
    },
    Total_ammountText: {
     color: '#7E8086',
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    leftText: {
      fontSize: 16,
      paddingTop: 5,
      flexDirection: 'row',
      marginRight: -2
    },
    leftValueText: {
      color: '#1A1A2C',
    },
      leftOutOfText: {
      color: '#7E8086',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    textContainer: {
      paddingLeft: 10
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginRight: -11,
      marginLeft: 1
    },

});

  export default Budget;

