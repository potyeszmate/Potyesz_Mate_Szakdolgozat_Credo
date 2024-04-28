import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../store/auth-context';

const iconMapping: any = {
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

  const UpcomingRecurring: React.FC<any> = ({ recurringTransactions }) => {
    console.log("IN UpcomingRecurring")
    const navigation = useNavigation();
    const currentDate = new Date();

    const authCtx: any = useContext(AuthContext);
    const { userId} = authCtx as any;  

    // console.log("recurringTransactions: ", recurringTransactions)
    // Filter recurring transactions with dates not earlier than the current date
    const upcomingRecurring = recurringTransactions
      .map((item: any) => ({ ...item, Date: item.Date.toDate() })) // Ensure Date is a Date object
      .filter((item: any) => {
        const transactionDate = new Date(item.Date);
        transactionDate.setHours(0, 0, 0, 0); // Normalize transaction date
        return transactionDate >= currentDate;
      })
      .sort((a: any, b: any) => a.Date - b.Date);

      // console.log("Filtered Upcoming Recurring: ", upcomingRecurring);

  
    if (upcomingRecurring.length === 0) {
      console.log("THERE IS NO UPCOMING RECURRING")
      // Return null or any placeholder if there are no upcoming recurring transactions
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
      // navigation.navigate('RecurringPayments');
      navigation.navigate('Recurrings', { userId: userId });

    };
  
    return (
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming subscription</Text>
          <TouchableOpacity onPress={handleRecurringPaymentsClick} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View all ({recurringTransactions.length})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Image source={iconMapping[firstUpcomingRecurring.name.toLowerCase()]} style={styles.iconImage} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>{capitalizeFirstLetter(firstUpcomingRecurring.name)}</Text>
  
            {weekDifference > 1 ? (
              <Text style={styles.transactionCategory}>
                In {weekDifference} {weeksText} ({formatDate(firstUpcomingRecurring.Date)}.)
              </Text>
            ) : (
              <Text style={styles.transactionCategory}>
                On this week ({formatDate(firstUpcomingRecurring.Date)}.)
              </Text>
            )}
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
      borderRadius: 22,
      padding: 16,
      marginTop: 20,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
      shadowOpacity: 0.1, // Shadow for iOS
      shadowRadius: 4, // Shadow for iOS
      borderColor: '#E0E0E0', // A slightly darker shade for the border
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