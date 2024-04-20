/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Budget from '../../components/ui/Budget';

import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const ExpensesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  const handleRecurringPaymentsClick = () => {
    // @ts-ignore
    navigation.navigate('RecurringPayments');
    // navigation.navigate('ThemePage', { defaultMode: userSettings.darkMode });

  };

  const handleLoansClick = () => {
    // @ts-ignore
    navigation.navigate('LoansAndDebt');
  };

  const handleBillsClick = () => {
    // @ts-ignore
    navigation.navigate('Bills');
  };

  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        console.log(selectedLanguage)
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
      console.log("In useEffect")
    }
  }, [isFocused]);

  return (
    <View style={styles.rootContainer}>
      {/* Recurring Payments Card */}

      <View style={styles.space}></View>

      <TouchableOpacity style={styles.recurringCard} onPress={handleRecurringPaymentsClick}>
  <View style={styles.cardContent}>
    <View style={styles.iconContainer}>
      <Image source={require('../../assets/Recurrings/subscriptions.png')} style={styles.icon} />
    </View>
    <View style={[styles.textContainer, { width: '60%' }]}>
      <Text style={styles.titleText}>{languages[selectedLanguage].subscriptionsTitle}</Text>
      <Text style={styles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].subscriptionDesc}</Text>
    </View>
    <Image source={require('../../assets/angle-right.png')} />
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.recurringCard} onPress={handleBillsClick}>
  <View style={styles.cardContent}>
    <View style={styles.iconContainer}>
      <Image source={require('../../assets/Recurrings/bills.png')} style={styles.icon} />
    </View>
    <View style={[styles.textContainer, { width: '60%' }]}>
      <Text style={styles.titleText}>{languages[selectedLanguage].billsTitle}</Text>
      <Text style={styles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].billsDesc}</Text>
    </View>
    <Image source={require('../../assets/angle-right.png')} />
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.recurringCard} onPress={handleLoansClick}>
  <View style={styles.cardContent}>
    <View style={styles.iconContainer}>
      <Image source={require('../../assets/Recurrings/loans.png')} style={styles.icon} />
    </View>
    <View style={[styles.textContainer, { width: '60%' }]}>
      <Text style={styles.titleText}>{languages[selectedLanguage].loansTitle}</Text>
      <Text style={styles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].loansDesc}</Text>
    </View>
    <Image source={require('../../assets/angle-right.png')} />
  </View>
</TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  space: {
    marginBottom: 10, // Adjust this value to change the amount of space
  },
  recurringCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    borderColor: '#F3F4F7',
    borderWidth: 1
    
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 4
  },
  iconContainer: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 14,
  },
  icon: {
    width: 40,
    height: 40,
  },
  
  subtitleText: {
    color: 'grey',
    // paddingRight: 60
  },
  navigationArrow: {
    fontSize: 24,
    color: 'black',
  },
});

export default ExpensesScreen;
