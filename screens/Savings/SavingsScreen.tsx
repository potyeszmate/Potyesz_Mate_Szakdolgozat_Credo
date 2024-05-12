import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebaseConfig';
import { SavingScreenStyles } from './SavingsStyles';
import { Profile } from '../Profile/ProfileTypes';
import { languages } from '../../commonConstants/sharedConstants';

const SavingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>(null as any);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;  

  const handleGoalsClick = () => {
    // @ts-ignore
    navigation.navigate('Goals',   {
      symbol: symbol,
      selectedLanguage: selectedLanguage,
      conversionRate: conversionRate,
      currency: profile.currency
    });

  };

  const handleCryptoCurrenciesClick = () => {
    if (profile && profile.isPremiumUser) {
      // @ts-ignore
      navigation.navigate('Cryptocurrencies', {
        symbol: symbol,
        selectedLanguage: selectedLanguage,
        conversionRate: conversionRate,
        currency: profile.currency
      });
    } else {
      // @ts-ignore
      navigation.navigate('Payment', {
        email: authCtx.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        selectedLanguage
      });
    }
  };
  
  const handleStocksClick = () => {
    if (profile && profile.isPremiumUser) {
      // @ts-ignore
      navigation.navigate('Stocks', {
        symbol: symbol,
        selectedLanguage: selectedLanguage,
        conversionRate: conversionRate,
        currency: profile.currency
      });
    } else {
      // @ts-ignore
      navigation.navigate('Payment', {
        email: authCtx.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        selectedLanguage
      });
    }
  };
  
  async function getUserSettings(uid: any) {
    setIsProfileLoading(true)
    const settingsRef = collection(db, 'users');
    const q = query(settingsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userSettings = querySnapshot?.docs[0]?.data();
        setIsProfileLoading(false)
        return userSettings;
    }
    setIsProfileLoading(false)

  }

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

  const fetchSavedUserData = async () => {
    await getSelectedCurrency()
    await getSelectedLanguage();
  };

  const isFocused = useIsFocused();
  
  useEffect(() => {
    const checkDataAndUpdate = async () => {
        if (isFocused) {

      const isprofileChanged = await AsyncStorage.getItem('profileChanged');

      if (isprofileChanged == "true") {
        setIsProfileLoading(true)

        await AsyncStorage.setItem('profileChanged', 'false');
        const newProfile: any = await getUserSettings(userId);
        await setProfile(newProfile);
        setIsProfileLoading(false)

      }
      fetchSavedUserData();
    }
  };
  
  checkDataAndUpdate(); 
  }, [isFocused]);

  useEffect(() => {
    const fetchProfile = async () => {
      const settings = await getUserSettings(userId);
      setProfile(settings)
    };
    fetchProfile(); 
  }, []);

  if (isProfileLoading || !profile) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={SavingScreenStyles.rootContainer}>

      <View style={SavingScreenStyles.space}></View>

      <TouchableOpacity style={SavingScreenStyles.recurringCard} onPress={handleGoalsClick}>
        <View style={SavingScreenStyles.cardContent}>
          <View style={SavingScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/saving.png')} style={SavingScreenStyles.icon} />
          </View>
          <View style={SavingScreenStyles.textContainer}>
            <Text style={SavingScreenStyles.titleText}>{languages[selectedLanguage].goals}</Text>
            <Text style={SavingScreenStyles.subtitleText}>{languages[selectedLanguage].goalDesc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={SavingScreenStyles.recurringCard} onPress={handleCryptoCurrenciesClick}>
        <View style={SavingScreenStyles.cardContent}>
          <View style={SavingScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/cryptocurrency.png')} style={SavingScreenStyles.icon} />
          </View>
          <View style={SavingScreenStyles.textContainer}>
          <Text style={SavingScreenStyles.titleText}>{languages[selectedLanguage].cryptos}</Text>
            <Text style={SavingScreenStyles.subtitleText}>Bitcoin, Ethereum, {languages[selectedLanguage].etc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={SavingScreenStyles.recurringCard} onPress={handleStocksClick}>
        <View style={SavingScreenStyles.cardContent}>
          <View style={SavingScreenStyles.iconContainer}>
            <Image source={require('../../assets/Recurrings/chart.png')} style={SavingScreenStyles.icon} />
          </View>
          <View style={SavingScreenStyles.textContainer}>
            <Text style={SavingScreenStyles.titleText}>{languages[selectedLanguage].stocks}</Text>
            <Text style={SavingScreenStyles.subtitleText}>Apple, NVIDIA, Tesla, {languages[selectedLanguage].etc}</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SavingsScreen;
