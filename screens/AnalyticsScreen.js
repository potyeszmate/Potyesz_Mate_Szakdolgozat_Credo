import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DonutChart from '../components/ui/DonutChart';
import DateLineChart from '../components/ui/DateLineChart';  // Import the new component
import { AuthContext } from '../store/auth-context';

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);

      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Transactions: ', fetchedTransactions);

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions in:', error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DonutChart data={transactions} donutstyle={styles.cdonutStyleontainer}/>
      {/* Add the DateLineChart component here */}
      <DateLineChart data={transactions} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },

});

export default Analytics;
