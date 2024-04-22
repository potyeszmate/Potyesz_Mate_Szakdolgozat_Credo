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
  const navigation = useNavigation(); // Hook for navigation

  // const navigateToDetail = () => {
  //   // @ts-ignore
  //   navigation.navigate('BudgetDetail', { budgetId: budget.id });
  // };

  const navigateToBudgetDetails = (budgetId: any) => {
    // @ts-ignore
    navigation.navigate('BudgetDetail', { budgetId: budgetId, symbol: symbol, conversionRate: conversionRate });
  };

  const handleBudgetPress = (budgetId: any) => {
    navigateToBudgetDetails(budgetId);
  };
  
  const spentAmount = transactions
    .filter((transaction: any) => transaction.category === budget.Category)
    .reduce((acc: number, transaction: any) => {
      const convertedValue = currency === 'HUF' ? 
        Math.round(parseFloat(transaction.value) * conversionRate) :
        parseFloat(transaction.value) * conversionRate;
      return acc + convertedValue;
    }, 0);

  const totalAmount = currency === 'HUF' ?
    Math.round(parseFloat(budget.Total_ammount) * conversionRate) :
    parseFloat(budget.Total_ammount) * conversionRate;

  const remainingAmount = totalAmount - spentAmount;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <Image style={styles.iconImage} source={iconMapping[budget.Category]} />
        <View style={styles.textContainer}>
          <Text style={styles.categoryText}>{budget.Category}</Text>
          <Text style={styles.amountText}>
            <Text style={styles.amountValueText}>
              {spentAmount.toFixed(0)}{symbol}  {/* Rounded and converted spent amount */}
            </Text>
            <Text style={styles.amountOutOfText}>out of </Text>
            <Text style={styles.Total_ammountText}>
              {totalAmount.toFixed(0)} {symbol} {/* Rounded and converted total budget */}
            </Text>
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.leftText}>
            <Text style={styles.leftValueText}>
              {remainingAmount.toFixed(0)}{symbol}  {/* Rounded and converted remaining amount */}
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
    padding: 15,
    marginHorizontal: 10, // Reduced margin for a wider card
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.2,
    // elevation: 2,
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
      // marginLeft: 1,
      marginBottom: 5,
      flexWrap: 'nowrap', // Prevent wrapping
    },
    amountText: {
      color: '#1A1A2C',
      // marginLeft: 1,
      flexDirection: 'row',
    },
    amountValueText: {
      color: '#1A1A2C',
      // marginLeft: 40
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
      // marginLeft: -140
    },
    leftText: {
      fontSize: 16,
      paddingTop: 5,
      flexDirection: 'row',
      marginRight: -2
    },
    leftValueText: {
      color: '#1A1A2C',
      // marginRight: -10
    },
      leftOutOfText: {
      color: '#7E8086',
    },
    // New styles for Delete and Edit buttons
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    // deleteIconContainer: {
    //   backgroundColor: '#fff',
    //   borderRadius: 22,
    //   borderWidth: 1,
    //   borderColor: '#1A1A2C',
    //   marginRight: 4,
    //   width: '48%', 
    //   height: 45,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // editIconContainer: {
    //   backgroundColor: '#fff',
    //   borderRadius: 22,
    //   borderWidth: 1,
    //   borderColor: '#1A1A2C',
    //   marginLeft: 4,
    //   width: '48%', 
    //   height: 45,
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
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

