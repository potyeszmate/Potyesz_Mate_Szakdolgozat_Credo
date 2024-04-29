import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  
  const navigateToAnalytics = (analyticsType) => {
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

  const StatisticCard = ({ title, desc, iconName, iconColor, analyticsType }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToAnalytics(analyticsType)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardAmount}>{desc}</Text>
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
    <ScrollView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 15,
    color: 'grey',
  },
});

export default AnalyticsScreen;
