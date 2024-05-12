import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { analyticsScreenStyles } from './AnalyticsScreenStyles';

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  
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
    navigation.navigate(routeName);
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
    { title: 'Spendings', desc: 'Check your spendings analytics', iconName: 'shopping-cart', iconColor: '#FF9500', analyticsType: 'spendings'},
    { title: 'Cash Flow', desc: 'Have you earned more than you spent?', iconName: 'exchange-alt', iconColor: '#FF3B30', analyticsType: 'cashFlow' },
    { title: 'Recurring Payments', desc: 'Check your recurring payments analytics', iconName: 'redo', iconColor: '#34C759', analyticsType: 'recurringPayments' },
    { title: 'Stocks And Crypto', desc: 'Check your portfolio', iconName: 'chart-line', iconColor: '#5856D6', analyticsType: 'stocksAndCrypto' },];


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
