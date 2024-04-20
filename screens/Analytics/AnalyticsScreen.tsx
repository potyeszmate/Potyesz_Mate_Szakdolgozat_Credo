import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { query, collection, where, getDocs, DocumentData } from 'firebase/firestore'; // Import DocumentData
import { db } from '../../firebaseConfig';
import DonutChart from '../../components/ui/DonutChart';
import DateLineChart from '../../components/ui/DateLineChart';
import { AuthContext } from '../../store/auth-context';
import { styles } from './AnalyticsScreenStyles';
import { Transaction } from './AnalyticsScreenTypes';

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Update type of 

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);

      const fetchedTransactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data.category,
          date: data.date.toDate(),
          name: data.name,
          notes: data.notes,
          uid: data.uid,
          value: data.value
        };
      });

      console.log('Transactions: ', fetchedTransactions);

      setTransactions(fetchedTransactions);
    } catch (error: any) { // Handle the type of error
      console.error('Error fetching transactions in:', error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* donutstyle={styles.cdonutStyleontainer} */}
      <DonutChart data={transactions}/>
      <DateLineChart data={transactions} />
    </ScrollView>
  );
};

export default Analytics;

