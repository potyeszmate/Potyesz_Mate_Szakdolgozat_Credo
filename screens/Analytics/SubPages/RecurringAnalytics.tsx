import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../store/auth-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecurringDonutChart from '../../../components/Recurrings/RecurringDonutChart';
import ImportanceBarChart from '../../../components/Charts/ImportanceBarChart';
import LoanPaymentChart from '../../../components/Charts/LoanPaymentChart';
import { useRoute } from '@react-navigation/native';
import { languages } from '../../../commonConstants/sharedConstants';
import { RecurringAnalyticsStyles } from '../AnalyticsScreenStyles';

const RecurringAnalytics = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('subscription');

    const route = useRoute();
    const { symbol, selectedLanguage, conversionRate } = route.params || {}
    
    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;

    const fetchSubscriptions = async () => {
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
    
          setSubscriptions(fetchedRecurringTransactions);
        } catch (error: any) {
          console.error('Error fetching transactions:', error.message);
        }
      
    };

    const fetchBills = async () => {
        try {    
          const recurringTransactionsQuery = query(
            collection(db, 'bills'),
            where('uid', '==', userId)
          );
          const querySnapshot = await getDocs(recurringTransactionsQuery);
          const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBills(fetchedRecurringTransactions);
    
        } catch (error: any) {
          console.error('Error fetching recurring transactions:', error.message);
    
        }
      };

    const fetchLoans = async () => {
        try {
    
          const recurringTransactionsQuery = query(
            collection(db, 'loans_and_debt'),
            where('uid', '==', userId)
          );
          const querySnapshot = await getDocs(recurringTransactionsQuery);
          const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLoans(fetchedRecurringTransactions);
    
        } catch (error: any) {
          console.error('Error fetching recurring transactions:', error.message);
    
        }
    };

    const adjustValueByCategory = (value: any, category: any) => {
        let adjustedValue = value;
        if (category === 'Yearly') {
          adjustedValue = value / 12;
        } else if (category === 'Weekly') {
          adjustedValue = value * 4;
        }
        return parseFloat(adjustedValue.toFixed(2));
    };

    const generateChartData = (transactions: any) => {
        return transactions.map((transaction: any) => ({
          name: transaction.name,
          value: adjustValueByCategory(transaction.value, transaction.category),
        }));
    };
      
      const generateLoanData= (transactions: any) => {
          return transactions.map((transaction: any) => ({
            name: transaction.name,
            value: adjustValueByCategory(transaction.value, transaction.category),
            Date: transaction.Date,
            dueDate: transaction.dueDate,
          }));
      };

      const calculateTotal = (transactions: any) => {
        return transactions.reduce(
          (acc: any, transaction: any) => acc + adjustValueByCategory(transaction.value, transaction.category),
          0
        );
      };
      
      useEffect(() => {
        fetchSubscriptions();
        fetchBills();
        fetchLoans();
      }, [userId]);


      return (
      <View>
        <View style={RecurringAnalyticsStyles.tabBarContainer}>
        <TouchableOpacity
          style={[
            RecurringAnalyticsStyles.tabButton,
            activeTab === 'subscription' && RecurringAnalyticsStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('subscription')}
        >
          <Text
            style={[
              RecurringAnalyticsStyles.tabButtonText,
              activeTab === 'subscription' && RecurringAnalyticsStyles.activeTabButtonText,
            ]}
          >
          {languages[selectedLanguage].subscriptionsTitle}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            RecurringAnalyticsStyles.tabButton,
            activeTab === 'bills' && RecurringAnalyticsStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('bills')}
        >
          <Text
            style={[
              RecurringAnalyticsStyles.tabButtonText,
              activeTab === 'bills' && RecurringAnalyticsStyles.activeTabButtonText,
            ]}
          >
          {languages[selectedLanguage].billsTitle}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            RecurringAnalyticsStyles.tabButton,
            activeTab === 'loans' && RecurringAnalyticsStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('loans')}
        >
          <Text
            style={[
              RecurringAnalyticsStyles.tabButtonText,
              activeTab === 'loans' && RecurringAnalyticsStyles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].loansTitle}
          </Text>
        </TouchableOpacity>
       </View>

        <ScrollView style={{ flexDirection: 'column' }}>
          {activeTab === 'subscription' &&(

            <RecurringDonutChart
              data={generateChartData(subscriptions)}
              total={calculateTotal(subscriptions)}
              recurringType={languages[selectedLanguage].subscriptionsTitle}
              symbol= {symbol}
              selectedLanguage= {selectedLanguage}
              conversionRate= {conversionRate}
            />
          )}

          {activeTab === 'bills' &&(

            <RecurringDonutChart
              data={generateChartData(bills)}
              total={calculateTotal(bills)}
              recurringType={languages[selectedLanguage].billsTitle}
              symbol= {symbol}
              selectedLanguage= {selectedLanguage}
              conversionRate= {conversionRate}

            />
          )}

          {activeTab === 'loans' &&(

            <RecurringDonutChart
              data={generateChartData(loans)}
              total={calculateTotal(loans)}
              recurringType={languages[selectedLanguage].loansTitle}
              symbol= {symbol}
              selectedLanguage= {selectedLanguage}
              conversionRate= {conversionRate}
            />
          )}

          {activeTab === 'loans' &&(
            <LoanPaymentChart
              loans={generateLoanData(loans)}
              symbol= {symbol}
              selectedLanguage= {selectedLanguage}
              conversionRate= {conversionRate}
            />
          )}

        {activeTab === 'subscription' && (
          <ImportanceBarChart
              data={subscriptions}
              symbol= {symbol}
              selectedLanguage= {selectedLanguage}
              conversionRate= {conversionRate}
            />
        )}

        </ScrollView>
      </View>
      );
    };
      
export default RecurringAnalytics;
