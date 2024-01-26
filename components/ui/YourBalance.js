import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ArrowDown from '../../assets/arrow-down-circle.png'; 
import ArrowUp from '../../assets/arrow-up-circle.png'; 


const YourBalance = ({ balance, income, expense }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Your Balance</Text>
        <Text style={styles.balanceAmount}>{balance}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoBox, styles.incomeInfoBox]}>
            <Image source={ArrowUp} style={styles.icon} resizeMode="contain" />

          {/* <Ionicons name="arrow-up-outline" size={24} color="#1A1A2C" /> */}
          <Text style={styles.infoText}>Income</Text>
          <Text style={styles.infoAmount}>$ {income}</Text>
        </View>

        <View style={[styles.infoBox, styles.expenseInfoBox]}>
        <Image source={ArrowDown} style={styles.icon} resizeMode="contain" />

          {/* <Ionicons name="arrow-down-outline" size={24} color="#1A1A2C" /> */}
          <Text style={styles.infoText}>Expense</Text>
          <Text style={styles.infoAmount}>$ {expense}</Text>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  balanceContainer: {
    paddingBottom: 1,
  },
  balanceText: {
    color: '#7E8086',
    fontSize: 15,
    paddingBottom: 5
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
    paddingHorizontal: 16,
  },
  infoText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 12,
  },
  infoAmount: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 17,
  },
  // Style for the Income infoBox
  incomeInfoBox: {
    backgroundColor: '#1A1A2C',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0, // No radius on the right side
    borderBottomRightRadius: 0, // No radius on the right side
    marginLeft: -3

  },

  // Style for the Expense infoBox
  expenseInfoBox: {
    backgroundColor: '#1A1A2C',
    borderTopLeftRadius: 0, // No radius on the left side
    borderBottomLeftRadius: 0, // No radius on the left side
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 3

  },
});

export default YourBalance;
