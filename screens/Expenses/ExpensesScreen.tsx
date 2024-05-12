import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../../commonConstants/sharedConstants';
import { ExpensesScreenStyles } from './ExpensesSytles';
import { db } from '../../firebaseConfig';
import { Profile } from '../Profile/ProfileTypes';

const ExpensesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  const [profile, setProfile] = useState<Profile>(null as any);
  const [loading, setLoading] = useState(true);


  const handleRecurringPaymentsClick = () => {
      // @ts-ignore
      navigation.navigate('Recurrings', { userId: userId, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, currency: profile.currency });
  };

  const handleLoansClick = () => {
    // @ts-ignore
    navigation.navigate('Loans', { userID: userId, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, currency: profile.currency });
  };

  const handleBillsClick = () => {
    // @ts-ignore
    navigation.navigate('Bills', { userID: userId, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, currency: profile.currency });
  };

  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const getSelectedCurrency = async () => {
    try {

      const savedSymbol = await AsyncStorage.getItem('symbol');
      const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');


      if (savedSymbol && savedConversionRate !== null) {
        setSymbol(savedSymbol);
        setConversionRate(savedConversionRate);
      } else {

        const defaultsavedSymbol= "$";
        const defaultConversionRate= 1;

        await AsyncStorage.setItem('conversionRate', defaultConversionRate.toString());
        await AsyncStorage.setItem('symbol', defaultsavedSymbol);

        setSymbol(savedSymbol);
        setConversionRate(savedConversionRate);
      }

    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  async function getUserSettings(uid: any) {
    const settingsRef = collection(db, 'users');
    const q = query(settingsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userSettings = querySnapshot?.docs[0]?.data();
        return userSettings;
    }

  }

  const fetchSavedUserData = async () => {
    await getSelectedCurrency()
    await getSelectedLanguage();
    const settings = await getUserSettings(userId);
    setProfile(settings)
    setLoading(false);
  };

  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      fetchSavedUserData();
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={ExpensesScreenStyles.rootContainer}>

      <View style={ExpensesScreenStyles.space}></View>

      <TouchableOpacity style={ExpensesScreenStyles.recurringCard} onPress={handleRecurringPaymentsClick}>
        <View style={ExpensesScreenStyles.cardContent}>
          <View style={ExpensesScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/subscriptions.png')} style={ExpensesScreenStyles.icon} />
          </View>
          <View style={[ExpensesScreenStyles.textContainer, { width: '60%' }]}>
            <Text style={ExpensesScreenStyles.titleText}>{languages[selectedLanguage].subscriptionsTitle}</Text>
            <Text style={ExpensesScreenStyles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].subscriptionDesc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={ExpensesScreenStyles.recurringCard} onPress={handleBillsClick}>
        <View style={ExpensesScreenStyles.cardContent}>
          <View style={ExpensesScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/bills.png')} style={ExpensesScreenStyles.icon} />
          </View>
          <View style={[ExpensesScreenStyles.textContainer, { width: '60%' }]}>
            <Text style={ExpensesScreenStyles.titleText}>{languages[selectedLanguage].billsTitle}</Text>
            <Text style={ExpensesScreenStyles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].billsDesc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={ExpensesScreenStyles.recurringCard} onPress={handleLoansClick}>
        <View style={ExpensesScreenStyles.cardContent}>
          <View style={ExpensesScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/loans.png')} style={ExpensesScreenStyles.icon} />
          </View>
          <View style={[ExpensesScreenStyles.textContainer, { width: '60%' }]}>
            <Text style={ExpensesScreenStyles.titleText}>{languages[selectedLanguage].loansTitle}</Text>
            <Text style={ExpensesScreenStyles.subtitleText} numberOfLines={2}>{languages[selectedLanguage].loansDesc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

    </View>
  );
};


export default ExpensesScreen;
