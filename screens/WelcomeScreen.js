import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { db } from '../firebaseConfig';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import TransactionInput from '../components/ui/TransactionInput';
import TransactionList from '../components/ui/TransactionList';

import RecurringTransactionInput from '../components/ui/RecurringTransactionInput';
import RecurringTransactionList from '../components/ui/RecurringTransactionList';

import Budget from '../components/ui/Budget';
import BudgetInput from '../components/ui/BudgetInput';

import GoalInput from '../components/ui/GoalInput';
import GoalList from '../components/ui/GoalList';

function WelcomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);



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

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const fetchBudgets = async () => {
    try {
      const budgetsQuery = query(collection(db, 'budgets'), where('uid', '==', userId));
      const querySnapshot = await getDocs(budgetsQuery);

      const fetchedBudgets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Budgets: ', fetchedBudgets)
      setBudgets(fetchedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error.message);
    }
  };

  const fetchGoals = async () => {
    try {
      const goalsQuery = query(collection(db, 'goals'), where('uid', '==', userId));
      const querySnapshot = await getDocs(goalsQuery);

      console.log("Goasl: ", querySnapshot)

      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('fetchedGoals Goals: ', fetchedGoals);
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error.message);
    }
  };

  const fetchRecurringTransactions = async () => {
    try {
      const recurringTransactionsQuery = query(collection(db, 'recurring_payments'), where('uid', '==', userId));
      const querySnapshot = await getDocs(recurringTransactionsQuery);

      const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Recurrings : ', fetchedRecurringTransactions)

      setRecurringTransactions(fetchedRecurringTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchGoals();
    fetchRecurringTransactions();

  }, [userId]);

  const addTransactionHandler = async (newTransaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...newTransaction,
        uid: userId,
        date: new Date(),
      });

      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const addBudgetHandler = async (newBudget) => {
    try {
      await addDoc(collection(db, 'budgets'), {
        ...newBudget,
        uid: userId,
      });
  
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error.message);
    }
  };

  const addGoalHandler = async (newGoal) => {
    try {
      await addDoc(collection(db, 'goals'), {
        ...newGoal,
        uid: userId,
        Date: new Date(),
      });

      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error.message);
    }
  };

  const addRecurringTransactionHandler = async (newRecurringTransaction) => {
    try {
      await addDoc(collection(db, 'recurring_payments'), {
        ...newRecurringTransaction,
        uid: userId,
        Date: new Date(),
        
      });

      fetchRecurringTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  };

  return (
    <ScrollView
      style={styles.rootContainer}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Home screen!</Text>
        <Text>You authenticated successfully!</Text>
        {userId && <Text style={styles.text}>Your user ID: {userId}</Text>}
      </View>
  
      <Text style={styles.title}>Add Transactions:</Text>
      <TransactionInput onAddTransaction={addTransactionHandler}/>
      <Text style={styles.title}>Your Transactions:</Text>
      <TransactionList transactions={transactions} style={styles.listContainer} />

      <Text style={styles.title}>Add Budgets:</Text>
      <BudgetInput onAddBudget={addBudgetHandler} />
      <Text style={styles.title}>Your Budgets:</Text>
      <Budget budgets={budgets} />

      <Text style={styles.title}>Add Goals:</Text>
      <GoalInput onAddGoal={addGoalHandler} />
      <Text style={styles.title}>Your Goals:</Text>
      <GoalList goals={goals} />


      <Text style={styles.title}>Add Recurring payments:</Text>
      <RecurringTransactionInput onAddRecurringTransaction={addRecurringTransactionHandler}/>

      <Text style={styles.title}>Upcoming Recurring:</Text>
      <RecurringTransactionList recurringTransactions={recurringTransactions} style={styles.listContainer} />


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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 18,

  },
  text: {
    marginBottom: 8,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  listContainer: {
    width: '100%',
  },
});


export default WelcomeScreen;
