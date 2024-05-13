import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../store/auth-context';
import { languages } from '../../commonConstants/sharedConstants';
import { UpcomingRecurringStyles } from './CommonComponentStyles';
import { RecurringIconMapping } from './CommonComponentConstants';

  const UpcomingRecurring: React.FC<any> = ({ recurringTransactions,  selectedLanguage, symbol, conversionRate, currency }) => {
    const navigation = useNavigation();
    const currentDate = new Date();

    const authCtx: any = useContext(AuthContext);
    const { userId} = authCtx as any;  

    const upcomingRecurring = recurringTransactions
      .map((item: any) => ({ ...item, Date: item.Date.toDate() })) 
      .filter((item: any) => {
        const transactionDate = new Date(item.Date);
        transactionDate.setHours(0, 0, 0, 0); 
        return transactionDate >= currentDate;
      })
      .sort((a: any, b: any) => a.Date - b.Date);


  
    if (upcomingRecurring.length === 0) {
      return null;
    }
  
    const firstUpcomingRecurring = upcomingRecurring[0];
  
    const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  
    const formatDate = (date: Date) => {
      const options: any = { month: '2-digit', day: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      return formattedDate.replace(/\//g, '.');
    };
  
    const calculateWeekDifference = (startDate: Date, endDate: Date) => {
      const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
      const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
      const differenceInWeeks = Math.floor(differenceInMilliseconds / millisecondsInWeek);
  
      return differenceInWeeks;
    };
  
    const weekDifference = calculateWeekDifference(currentDate, firstUpcomingRecurring.Date);
    const weeksText = weekDifference === 1 ? 'week' : 'weeks';
  
    const handleRecurringPaymentsClick = () => {
      // @ts-ignore
      navigation.navigate('Recurrings', { userId: userId, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, currency: currency });
  };
  
    return (
      <View style={UpcomingRecurringStyles.cardContainer}>
        <View style={UpcomingRecurringStyles.header}>
          <Text style={UpcomingRecurringStyles.title}>{languages[selectedLanguage].upcomingSubs}</Text>
          <TouchableOpacity onPress={handleRecurringPaymentsClick} style={UpcomingRecurringStyles.viewAllButton}>
            <Text style={UpcomingRecurringStyles.viewAllText}>{languages[selectedLanguage].viewall} ({recurringTransactions.length})</Text>
          </TouchableOpacity>
        </View>
        <View style={UpcomingRecurringStyles.transactionItem}>
          <View style={UpcomingRecurringStyles.transactionIcon}>
            <Image source={RecurringIconMapping[firstUpcomingRecurring.name.toLowerCase()]} style={UpcomingRecurringStyles.iconImage} />
          </View>
          <View style={UpcomingRecurringStyles.transactionInfo}>
            <Text style={UpcomingRecurringStyles.transactionName}>{capitalizeFirstLetter(firstUpcomingRecurring.name)}</Text>
  
            {weekDifference > 1 ? (
              <Text style={UpcomingRecurringStyles.transactionCategory}>
                In {weekDifference} {weeksText} ({formatDate(firstUpcomingRecurring.Date)}.)
              </Text>
            ) : (
              <Text style={UpcomingRecurringStyles.transactionCategory}>
                {languages[selectedLanguage].thisWeek} ({formatDate(firstUpcomingRecurring.Date)}.)
              </Text>
            )}
          </View>
          <View style={UpcomingRecurringStyles.transactionAmount}>
            <Text style={UpcomingRecurringStyles.transactionAmountValue}>
              {(parseFloat(firstUpcomingRecurring.value) * conversionRate).toFixed(2)} {symbol}
              </Text>
          </View>
        </View>
      </View>
    );
  };
  
  export default UpcomingRecurring;