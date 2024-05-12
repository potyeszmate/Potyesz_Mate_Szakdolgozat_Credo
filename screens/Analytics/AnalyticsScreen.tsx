import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { analyticsScreenStyles } from './AnalyticsScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../../commonConstants/sharedConstants';

const AnalyticsScreen = () => {
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  
  const fetchCurrencyData = async () => {
    try {
      const savedSymbol = await AsyncStorage.getItem('symbol');
      const savedConversionRate = await AsyncStorage.getItem('conversionRate');
      if (savedSymbol !== null && savedConversionRate !== null) {
        setSymbol(savedSymbol);
        setConversionRate(parseFloat(savedConversionRate));
      } else {
        // Set default values if nothing is saved
        setSymbol("$");
        setConversionRate(1);
        await AsyncStorage.setItem('conversionRate', '1');
        await AsyncStorage.setItem('symbol', "$");
      }
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
  };
  
  const fetchLanguageData = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error fetching selected language:', error);
    }
  };
  
  const fetchAllData = async () => {
    // setIsLoading(true); 
    await Promise.all([
      fetchCurrencyData(),
      fetchLanguageData(),
    ]);
    setIsLoading(false); 
  };
  
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      fetchAllData();
    }
  }, [isFocused]);
  const navigateToAnalytics = (analyticsType: string) => {
    let routeName = '';
    switch (analyticsType) {
      case 'spendings':
        routeName = 'Spending';
        break;
      case 'recurringPayments':
        routeName = 'Recurring';
        break;
      case 'cashFlow':
        routeName = 'Cash Flow';
        break;
      case 'stocksAndCrypto':
        routeName = 'Investments';
        break;
      default:
        return;
    }

    // @ts-ignore
    navigation.navigate(routeName, {
      symbol: symbol,
      selectedLanguage: selectedLanguage,
      conversionRate: conversionRate,
      });
  };

  const StatisticCard = ( {title, desc, iconName, iconColor, analyticsType} ) => {
    return (
      <TouchableOpacity
        style={analyticsScreenStyles.card}
        onPress={() => navigateToAnalytics(analyticsType)}
      >
        <View style={analyticsScreenStyles.cardContent}>
          <View style={analyticsScreenStyles.cardText}>
            <Text style={analyticsScreenStyles.cardTitle}>{title}</Text>
            <Text style={analyticsScreenStyles.cardAmount}>{desc}</Text>
          </View>
          <FontAwesome5 name={iconName} size={24} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  };

  const statistics = [
    { title: `${languages[selectedLanguage].spendings}`, desc: `${languages[selectedLanguage].spendingDesc}`, iconName: 'shopping-cart', iconColor: '#FF9500', analyticsType: 'spendings'},
    { title: `${languages[selectedLanguage].cashflow}`, desc: `${languages[selectedLanguage].cashflowDesc2}`, iconName: 'exchange-alt', iconColor: '#FF3B30', analyticsType: 'cashFlow' },
    { title: `${languages[selectedLanguage].recurringPayments}`, desc: `${languages[selectedLanguage].recurringDesc}`, iconName: 'redo', iconColor: '#34C759', analyticsType: 'recurringPayments' },
    { title: `${languages[selectedLanguage].stocksAndCrypto}`, desc: `${languages[selectedLanguage].portfolioDesc}`, iconName: 'chart-line', iconColor: '#5856D6', analyticsType: 'stocksAndCrypto' },];


    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
  }
  
  return (
    <ScrollView style={analyticsScreenStyles.container}>
      {statistics.map((stat, index) => (
        <StatisticCard
          key={index}
          title={stat.title}
          desc={stat.desc}
          iconName={stat.iconName}
          iconColor={stat.iconColor}
          analyticsType={stat.analyticsType}
        />
      ))}
    </ScrollView>
  );
};

export default AnalyticsScreen;
