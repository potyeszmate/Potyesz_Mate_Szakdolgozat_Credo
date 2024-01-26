/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import { AuthContext } from '../store/auth-context';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';

import Budget from '../components/ui/Budget';

const ExpensesScreen = () => {

  const navigation = useNavigation();

  const handleRecurringPaymentsClick = () => {
    navigation.navigate('RecurringPayments');
  };

  const handleLoansClick = () => {
    navigation.navigate('LoansAndDebt');
  };

  return (
    <View style={styles.rootContainer}>
      {/* Recurring Payments Card */}
      <TouchableOpacity style={styles.recurringCard} onPress={handleRecurringPaymentsClick}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/recurring.png')} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Subscriptions</Text>
            <Text style={styles.subtitleText}>Internet services you pay for</Text>
          </View>
          <Text style={styles.navigationArrow}>{'>'}</Text>
          {/* <Image source={require('../assets/angle-right.png')} style={styles.icon} width={1} height={1} /> */}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recurringCard} onPress={handleLoansClick}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/Loans.png')} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Loans and debt</Text>
            <Text style={styles.subtitleText}>Interest rates, pay back</Text>
          </View>
          <Text style={styles.navigationArrow}>{'>'}</Text>
          {/* <Image source={require('../assets/angle-right.png')} style={styles.icon}  width={1} height={1} /> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... other styles remain unchanged
  
  recurringCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 35, 
    height: 35, 
  },
  subtitleText: {
    color: 'grey',
  },
  navigationArrow: {
    fontSize: 24,
    color: 'black',
  },
});


export default ExpensesScreen;
