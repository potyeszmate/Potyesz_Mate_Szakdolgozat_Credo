// AnalyticsScreen.js
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Statistics data array removed for brevity

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  
  // Helper function for navigating to the appropriate analytics screen
  const navigateToAnalytics = (analyticsType) => {
    let routeName = '';
    switch (analyticsType) {
      case 'spendings':
        routeName = 'SpendingAnalytics';
        break;
      case 'recurringPayments':
        routeName = 'RecurringAnalytics';
        break;
      case 'cashFlow':
        routeName = 'CashFlowAnalytics';
        break;
      case 'stocksAndCrypto':
        routeName = 'StocksAndCryptoAnalytics';
        break;
      // Add more cases as needed
      default:
        // Handle unknown analyticsType
        console.warn('Unknown analytics type:', analyticsType);
        return;
    }
    navigation.navigate(routeName);
  };

  // StatisticsCard component extracted for clarity
  const StatisticCard = ({ title, amount, iconName, iconColor, analyticsType }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToAnalytics(analyticsType)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardAmount}>{amount}</Text>
          </View>
          <FontAwesome5 name={iconName} size={24} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  };

  // Statistics array reinstated for rendering { title: 'Balance', amount: '3 920 941,00 Ft', iconName: 'wallet', iconColor: '#007AFF', analyticsType: 'balance' },
  const statistics = [{ title: 'Spendings', amount: '20 706 736,35 Ft', iconName: 'shopping-cart', iconColor: '#FF9500', analyticsType: 'spendings'},{ title: 'Cash Flow', amount: '3 738 040,65 Ft', iconName: 'exchange-alt', iconColor: '#FF3B30', analyticsType: 'cashFlow' },{ title: 'Recurring Payments', amount: '1 401,00 Ft', iconName: 'redo', iconColor: '#34C759', analyticsType: 'recurringPayments' },{ title: 'Stocks And Crypto', amount: '0,00 Ft', iconName: 'chart-line', iconColor: '#5856D6', analyticsType: 'stocksAndCrypto' },];


  return (
    <ScrollView style={styles.container}>
      {statistics.map((stat, index) => (
        <StatisticCard
          key={index}
          title={stat.title}
          amount={stat.amount}
          iconName={stat.iconName}
          iconColor={stat.iconColor}
          analyticsType={stat.analyticsType}
        />
      ))}
    </ScrollView>
  );
};

// Styles remain unchanged
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 16,
    color: '#333',
  },
  // Add other styles if necessary
});

export default AnalyticsScreen;
