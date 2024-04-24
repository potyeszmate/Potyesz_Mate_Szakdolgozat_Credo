// import React, { useContext, useEffect, useState } from 'react';
// import { ScrollView, StyleSheet } from 'react-native';
// import { query, collection, where, getDocs, DocumentData } from 'firebase/firestore'; // Import DocumentData
// import { db } from '../../firebaseConfig';
// import DonutChart from '../../components/ui/DonutChart';
// import DateLineChart from '../../components/ui/DateLineChart';
// import { AuthContext } from '../../store/auth-context';
// import { styles } from './AnalyticsScreenStyles';
// import { Transaction } from './AnalyticsScreenTypes';

// const Analytics = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]); // Update type of 

//   const authCtx = useContext(AuthContext);
//   const { userId } = authCtx as any;

//   const fetchTransactions = async () => {
//     try {
//       const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
//       const querySnapshot = await getDocs(transactionsQuery);

//       const fetchedTransactions = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           category: data.category,
//           date: data.date.toDate(),
//           name: data.name,
//           notes: data.notes,
//           uid: data.uid,
//           value: data.value
//         };
//       });

//       console.log('Transactions: ', fetchedTransactions);

//       setTransactions(fetchedTransactions);
//     } catch (error: any) { // Handle the type of error
//       console.error('Error fetching transactions in:', error.message);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [userId]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* donutstyle={styles.cdonutStyleontainer} */}
//       <DonutChart data={transactions}/>
//       <DateLineChart data={transactions} />
//     </ScrollView>
//   );
// };

// export default Analytics;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StatisticCard = ({ title, amount, iconName, iconColor, analyticsType }) => {
  const navigation = useNavigation();

  const navigateToTransactionAnalytics = (analyticsType: string) => {
      switch (analyticsType) {
        // case 'balance':
        //   // @ts-ignore
        //   navigation.navigate('BalanceAnalytics');
        case 'spendings':
          // @ts-ignore
          navigation.navigate('SpendingAnalytics');
        // case 'recurringPayments':
        //   // @ts-ignore
        //   navigation.navigate('RecurringAnalytics');
        // case 'stocksAndCrypto':
        //   // @ts-ignore
        //   navigation.navigate('StocksAndCryptoAnalytics');
        // case 'loansAndDebts':
        //   // @ts-ignore
        //   navigation.navigate('LoansAndDebtsAnalytics');
        default:
          return ''; 
      }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigateToTransactionAnalytics(analyticsType)}
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

const AnalyticsScreen= () => {
  const statistics = [
    { title: 'Balance', amount: '3 920 941,00 Ft', iconName: 'wallet', iconColor: '#007AFF', analyticsType: 'balance'  },
    { title: 'Spendings', amount: '20 706 736,35 Ft', iconName: 'shopping-cart', iconColor: '#FF9500', analyticsType: 'spendings'},
    { title: 'Cash Flow', amount: '3 738 040,65 Ft', iconName: 'exchange-alt', iconColor: '#FF3B30', analyticsType: 'recurringPayments' },
    { title: 'Recurring Payments', amount: '1 401,00 Ft', iconName: 'redo', iconColor: '#34C759', analyticsType: 'recurringPayments' },
    { title: 'Stocks And Crypto', amount: '0,00 Ft', iconName: 'chart-line', iconColor: '#5856D6', analyticsType: 'stocksAndCrypto' },
    { title: 'Loans and debts', amount: '20 000 000,00 Ft', iconName: 'university', iconColor: '#FFCC00', analyticsType: 'loansAndDebts' },
  ];
  
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
