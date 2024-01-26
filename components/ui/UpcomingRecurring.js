import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const iconMapping = {
    twitter: require('../../assets/Recurrings/twitter.png'),
    youtube: require('../../assets/Recurrings/youtube.png'),
    linkedIn: require('../../assets/Recurrings/linkedin.png'),
    wordpress: require('../../assets/Recurrings/wordpress.png'),
    pinterest: require('../../assets/Recurrings/pinterest.png'),
    figma: require('../../assets/Recurrings/figma.png'),
    behance: require('../../assets/Recurrings/behance.png'),
    apple: require('../../assets/Recurrings/apple.png'),
    googlePlay: require('../../assets/Recurrings/google-play.png'),
    google: require('../../assets/Recurrings/google.png'),
    appStore: require('../../assets/Recurrings/app-store.png'),
    github: require('../../assets/Recurrings/github.png'),
    xbox: require('../../assets/Recurrings/xbox.png'),
    discord: require('../../assets/Recurrings/discord.png'),
    stripe: require('../../assets/Recurrings/stripe.png'),
    spotify: require('../../assets/Recurrings/spotify.png'),
  
  };

  const UpcomingRecurring = ({ recurringTransactions }) => {
    const navigation = useNavigation();
    const currentDate = new Date();
  
    // Filter recurring transactions with dates not earlier than the current date
    const upcomingRecurring = recurringTransactions
      .filter((item) => item.Date.toDate() >= currentDate)
      .sort((a, b) => a.Date.toDate() - b.Date.toDate());
  
    if (upcomingRecurring.length === 0) {
      // Return null or any placeholder if there are no upcoming recurring transactions
      return null;
    }
  
    const firstUpcomingRecurring = upcomingRecurring[0];
  
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  
    const formatDate = (date) => {
      const options = { month: '2-digit', day: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      return formattedDate.replace(/\//g, '.'); 
    };
  
    const calculateWeekDifference = (startDate, endDate) => {
      const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
      const differenceInMilliseconds = endDate - startDate;
      const differenceInWeeks = Math.floor(differenceInMilliseconds / millisecondsInWeek);
  
      return differenceInWeeks;
    };
  
    const weekDifference = calculateWeekDifference(currentDate, firstUpcomingRecurring.Date.toDate());
    const weeksText = weekDifference === 1 ? 'week' : 'weeks';
  
    const handleRecurringPaymentsClick = () => {
        navigation.navigate('RecurringPayments');
    };
      
    return (
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming subscriptions</Text>
          <TouchableOpacity
            onPress={handleRecurringPaymentsClick}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View all ({recurringTransactions.length})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Image source={iconMapping[firstUpcomingRecurring.name.toLowerCase()]} style={styles.iconImage} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>{capitalizeFirstLetter(firstUpcomingRecurring.name)}</Text>
            <Text style={styles.transactionCategory}>
              In {weekDifference} {weeksText} ({formatDate(firstUpcomingRecurring.Date.toDate())}.)
            </Text>
          </View>
          <View style={styles.transactionAmount}>
            <Text style={styles.transactionAmountValue}>${parseInt(firstUpcomingRecurring.value)}</Text>
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    viewAllButton: {
      alignItems: 'flex-end',
    },
    viewAllText: {
      color: '#007BFF',
      fontSize: 14,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 8,
      paddingRight: 8,
    },
    transactionIcon: {
      marginRight: 10,
    },
    iconImage: {
      width: 24,
      height: 24,
    },
    transactionInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    transactionName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    transactionCategory: {
      fontSize: 16,
      color: '#888',
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    transactionAmountValue: {
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  export default UpcomingRecurring;