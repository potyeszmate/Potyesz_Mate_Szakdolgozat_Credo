import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { db } from '../firebaseConfig';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';

import TransactionList from '../components/ui/TransactionList';
import RecurringTransactionList from '../components/ui/RecurringTransactionList';
import GoalList from '../components/ui/GoalList';
import YourBalance from '../components/ui/YourBalance';
import UpcomingRecurring from '../components/ui/UpcomingRecurring';
import LatestTransactions from '../components/ui/LatestTransactions';
import BudgetSummary from '../components/ui/BudgetSummary';
import YourPoints from '../components/ui/YourPoints';
import JoinedChallanges from '../components/ui/JoinedChallanges';


function WelcomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  // const [budgets, setBudgets] = useState([]);
  const [points, setPoints] = useState([]);
  const [challanges, setChallanges] = useState([]);

  // const [goals, setGoals] = useState([]);

  const [activeTab, setActiveTab] = useState('overview');

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  const fetchRecurringTransactions = async () => {
    try {
      const recurringTransactionsQuery = query(
        collection(db, 'recurring_payments'),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(recurringTransactionsQuery);

      const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecurringTransactions(fetchedRecurringTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

 
  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);

      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(fetchedTransactions);
    } 
    catch (error) 
    {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const fetchPoints = async () => {
    try {
      const pointsQuery = query(collection(db, 'points'), where('uid', '==', userId));
      const querySnapshot = await getDocs(pointsQuery);

      const fetchedpoints = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPoints(fetchedpoints);
      console.log('fetched points:', fetchedpoints);

    } catch (error) {
      console.error('Error fetching points:', error.message);
    }
  };

  const fetchChallanges = async () => {
    try {
      const challangesQuery = query(collection(db, 'challanges'), where('uid', '==', userId));
      const querySnapshot = await getDocs(challangesQuery);

      const fetchedpchallanges = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChallanges(fetchedpchallanges);
      console.log('fetched challanges:', fetchedpchallanges);

    } catch (error) {
      console.error('Error fetching points:', error.message);
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchRecurringTransactions();
    // fetchBudgets();
    fetchPoints();
    fetchChallanges();

  }, [userId]);

  return (
    <ScrollView
      style={styles.rootContainer}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'overview' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'overview' && styles.activeTabButtonText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'budget' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('budget')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'budget' && styles.activeTabButtonText,
            ]}
          >
            Budget
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'progress' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('progress')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'progress' && styles.activeTabButtonText,
            ]}
          >
            Progress
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
      <YourBalance balance="$1000" income="600" expense="300" />

      )}

      {activeTab === 'overview' && (
      <UpcomingRecurring recurringTransactions={recurringTransactions} />
      )}

      {activeTab === 'overview' && (
      <LatestTransactions transactions={transactions} />
      )}

      {activeTab === 'budget' && (
      <BudgetSummary transactions={transactions} />
      )}

      {activeTab === 'progress' && points && !!points[0] && (
        <YourPoints score={points[0].score} total={points[0].total} />
      )}

      {activeTab === 'progress' && challanges && !!challanges[0] &&(
      <JoinedChallanges challanges={challanges[0]} />
      )}

      {/* <Text style={styles.title}>Your Goals:</Text>
      <GoalList goals={goals} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: 30
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
    fontFamily: 'Inter', // Make sure you have the Inter font available
  },
  activeTabButton: {
    backgroundColor: '#1A1A2C',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 18,
  },
  text: {
    marginBottom: 8,
  },
  listContainer: {
    width: '100%',
  },
});

export default WelcomeScreen;
