import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/auth-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecurringDonutChart from '../../components/ui/RecurringDonutChart';
import ImportanceBarChart from '../../components/ui/ImportanceBarChart';
import LoanPaymentChart from '../../components/ui/LoanPaymentChart';

const RecurringAnalytics = () => {

    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('subscription');

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;

      //name: 
      //category: -> weekly, monthly, yearly
      //value: 
      //Date:
      //Importance: -> mandatory, necessary, neutral, negligible, 

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
    
          console.log("fetchedRecurringTransactions", fetchedRecurringTransactions)
          setSubscriptions(fetchedRecurringTransactions);
        } catch (error: any) {
          console.error('Error fetching transactions:', error.message);
        }
      
    };

      //name: 
      //category: -> weekly, monthly, yearly
      //value: 
      //Date:

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


      //name: 
      //category: -> weekly, monthly, yearly
      //value: 
      //Date:
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

    const adjustValueByCategory = (value, category) => {
        let adjustedValue = value;
        if (category === 'Yearly') {
          adjustedValue = value / 12; // Convert yearly to monthly
        } else if (category === 'Weekly') {
          adjustedValue = value * 4; // Convert weekly to monthly
        }
        return parseFloat(adjustedValue.toFixed(2)); // Round to two decimal places
    };

    const generateChartData = (transactions) => {
        return transactions.map((transaction) => ({
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

      const calculateTotal = (transactions) => {
        return transactions.reduce(
          (acc, transaction) => acc + adjustValueByCategory(transaction.value, transaction.category),
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
        <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'subscription' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('subscription')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'subscription' && styles.activeTabButtonText,
            ]}
          >
            Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'bills' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('bills')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'bills' && styles.activeTabButtonText,
            ]}
          >
            Bills
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'loans' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('loans')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'loans' && styles.activeTabButtonText,
            ]}
          >
            Loans
          </Text>
        </TouchableOpacity>
       </View>

        <ScrollView style={{ flexDirection: 'column' }}>
          {activeTab === 'subscription' &&(

            <RecurringDonutChart
              data={generateChartData(subscriptions)}
              total={calculateTotal(subscriptions)}
              recurringType= "Subscriptions"
            />
          )}

          {activeTab === 'bills' &&(

            <RecurringDonutChart
              data={generateChartData(bills)}
              total={calculateTotal(bills)}
              recurringType= "Bills"

            />
          )}

          {activeTab === 'loans' &&(

            <RecurringDonutChart
              data={generateChartData(loans)}
              total={calculateTotal(loans)}
              recurringType= "Loand and Debts"
            />
          )}

          {activeTab === 'loans' &&(
            <LoanPaymentChart
              loans={generateLoanData(loans)}
            />
          )}

        {activeTab === 'subscription' && (
          <ImportanceBarChart
              data={subscriptions}
            />
        )}

        </ScrollView>
      </View>
      );
    };
      

    const styles = StyleSheet.create({
      tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: 16
        marginBottom: 5,
        paddingHorizontal: 24,
        paddingTop: 10,
        gap: 5
      },
    
      tabButtonText: {
        color: '#1A1A2C',
        fontSize: 14,
        // fontFamily: 'Inter', // Make sure you have the Inter font available
      },
      activeTabButton: {
        backgroundColor: '#35BA52',
      },
      activeTabButtonText: {
        color: '#FFFFFF',
      },
      tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        borderRadius: 99,
        borderColor: '#149E53',
        borderWidth: 0.6
        // backgroundColor: '#FAFAFA',
      },
    });

export default RecurringAnalytics;
