import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import TransactionList from '../../components/ui/TransactionList';
// import RecurringTransactionList from '../components/ui/RecurringTransactionList';
import GoalList from '../../components/ui/GoalList';
import YourBalance from '../../components/ui/YourBalance';
import UpcomingRecurring from '../../components/ui/UpcomingRecurring';
import LatestTransactions from '../../components/ui/LatestTransactions';
import BudgetSummary from '../../components/ui/BudgetSummary';
import YourPoints from '../../components/ui/YourPoints';
import JoinedChallanges from '../../components/ui/JoinedChallanges';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import CustomHeader from '../../components/ui/CustomHeader';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { convertCurrencyToCurrency } from '../../util/conversion';
import MonthlyIncome from '../../components/ui/MonthlyIncome';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

function WelcomeScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  // const [budgets, setBudgets] = useState([]);
  const [points, setPoints] = useState<any[]>([]);
  const [challanges, setChallanges] = useState<any[]>([]);
  // const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [userSettings, setUserSettings] = useState<any>([]);
  const [userIncome, setUserIncome] = useState<any>([]);

  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
  const [prevCurrency, setPrevCurrency] = useState<string | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const [loading, setLoading] = useState(true);

  // const [goals, setGoals] = useState([]);

  const [activeTab, setActiveTab] = useState('overview');

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const fetchRecurringTransactions = async () => {
    // console.log("userId in home: ", userId)
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

      // console.log("fetchedRecurringTransactions", fetchedRecurringTransactions)
      setRecurringTransactions(fetchedRecurringTransactions);
    } catch (error: any) {
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

      // console.log("fetchedTransactions", fetchedTransactions)
      setTransactions(fetchedTransactions);
    } 
    catch (error: any) 
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
      // console.log('fetched points:', fetchedpoints);

    } catch (error: any) {
      console.error('Error fetching points:', error.message);
    }
  };


  const fetchChallanges = async () => {
    try {
      //, where('uid', '==', userId -> Only the actie challanges
      const challangesQuery = query(collection(db, 'challanges'));
      const querySnapshot = await getDocs(challangesQuery);

      const fetchedpchallanges = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChallanges(fetchedpchallanges);
      // console.log('fetched challanges:', fetchedpchallanges);

    } catch (error: any) {
      console.error('Error fetching points:', error.message);
    }
  };

  const fetchUserSettings = async () => {
    try {
      console.log("loading: ", loading)
      setLoading(true);

      const settingsQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(settingsQuery);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0]?.data(); 
        if (userData) {
          setUserSettings(userData as any);
          setLoading(false);
          console.log("loading: ", loading)

          console.log('Fetched settings:', userData);
        } else {
          console.log('No user data found.');
        }
      } else {
        // console.log('No documents found.');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error.message);
      setLoading(false);

    }
  };


  const getCurrencySymbol = (currencyCode: any) => {
    console.log("CHANGING CURRENCY SYMBOL")
    
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'HUF':
        return 'HUF';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return ''; 
    }
  };

  const fetchIncome = async () => {
    try {
      console.log("loading: ", loading);
      setLoading(true);  // Ensure you're using setLoading correctly before fetching.
  
      const incomeQuery = query(collection(db, 'income'));
      const querySnapshot = await getDocs(incomeQuery);
  
      if (!querySnapshot.empty) {
        const incomeData = querySnapshot.docs[0]?.data();
        if (incomeData && incomeData.income) {
          setUserIncome(incomeData.income);  // Set only the income value, not the entire object.
          console.log('Fetched income:', incomeData.income);
        } else {
          console.log('No user income found.');
          setUserIncome('0');  // Set a default or reset the income state if not found.
        }
      } else {
        console.log('No documents found.');
        setUserIncome('0');  // Set a default or reset the income state if no documents are found.
      }
    } catch (error: any) {
      console.error('Error fetching income:', error.message);
      setUserIncome('0');  // Handle the error by setting income to a default value.
    } finally {
      setLoading(false);  // Ensure you turn off loading no matter the outcome.
    }
  };
  

  const updateIncome = async (newIncome: string) => {
    console.log('Called updateIncome.');
  
    try {
      const querySnapshot = await getDocs(collection(db, 'income'));
      console.log('In try.');
  
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
  
        const convertedIncome = conversionRate !== null ? (1 / conversionRate) * parseFloat(newIncome) : parseFloat(newIncome)

        if (userData.uid === userId) {
          await updateDoc(doc.ref, { income: convertedIncome });
          console.log('Income updated.');
          await fetchIncome();
        }
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };
  

  useEffect(() => {
    fetchTransactions();
    fetchRecurringTransactions();
    // fetchBudgets();
    fetchPoints();
    fetchChallanges();
    fetchIncome();

  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Check if user settings have already been fetched
  //       if (!userSettings.currency) {
  //         // Fetch user settings
  //         await fetchUserSettings();
  //       }

  //       console.log("prevCurrency", prevCurrency)
  //       console.log("prevCurrency", userSettings.currency)

  //       // Check if the currency value is valid and has changed
  //       if (userSettings.currency && userSettings.currency !== prevCurrency) {
  //         // Get the saved symbol from AsyncStorage
  //         const savedSymbol = await AsyncStorage.getItem('symbol');
          
  //         // Check if the current symbol is the same as the saved symbol
  //         const symbolHaveNotChanged = savedSymbol === getCurrencySymbol(userSettings.currency);
    
  //         if (symbolHaveNotChanged) {
  //           // Use saved conversion rate
  //           const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');
  //           setConversionRate(parseFloat(savedConversionRate));
  //           // Set currency symbol
  //           setSymbol(savedSymbol);
  //         } else {
  //           // Fetch conversion rate from API
  //           const result = await convertCurrencyToCurrency('USD', userSettings.currency);
  //           setConversionRate(result);
        
  //           // Save conversion rate and symbol
  //           await AsyncStorage.setItem('conversionRate', result.toString());
  //           const newSymbol = getCurrencySymbol(userSettings.currency);
  //           setSymbol(newSymbol);
  //           await AsyncStorage.setItem('symbol', newSymbol);
  //         }
          
  //         // Update the previous currency value
  //         setPrevCurrency(userSettings.currency);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user settings or converting currency:', error);
        
  //     }
  //   };
    
  //   fetchData();
  // }, [userSettings.currency, prevCurrency]); // Add userSettings.currency and prevCurrency to the dependency array
  

  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        console.log(selectedLanguage)
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {

      const fetchData = async () => {
        try {
          // Check if user settings have already been fetched
          // if (!userSettings.currency) {
            // Fetch user settings
          await fetchUserSettings();
          // }
  
          console.log("prevCurrency: ", prevCurrency)
          console.log("current currency: ", userSettings.currency)
  
          // Check if the currency value is valid and has changed
          if (userSettings.currency && userSettings.currency !== prevCurrency) {
            // Get the saved symbol from AsyncStorage
            const savedSymbol = await AsyncStorage.getItem('symbol');
            
            // Check if the current symbol is the same as the saved symbol
            const symbolHaveNotChanged = savedSymbol === getCurrencySymbol(userSettings.currency);
      
            if (symbolHaveNotChanged) {
              // Use saved conversion rate
              const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');
              setConversionRate(parseFloat(savedConversionRate));
              // Set currency symbol
              setSymbol(savedSymbol);
            } else {
              // Fetch conversion rate from API
              const result = await convertCurrencyToCurrency('USD', userSettings.currency);
              setConversionRate(result);
          
              // Save conversion rate and symbol
              await AsyncStorage.setItem('conversionRate', result.toString());
              const newSymbol = getCurrencySymbol(userSettings.currency);
              setSymbol(newSymbol);
              await AsyncStorage.setItem('symbol', newSymbol);
            }
            console.log(conversionRate)
            // Update the previous currency value
            setPrevCurrency(userSettings.currency);
          }
        } catch (error) {
          console.error('Error fetching user settings or converting currency:', error);
          
        }
      };
      
      fetchData();
      fetchLanguage();
    }
  }, [ isFocused]);


  return (

    <View style={styles.container}>
       <CustomHeader
        authCtx={authCtx}
      />

      <View style={styles.tabBarContainer}>
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
              {languages[selectedLanguage].overview}
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
              {languages[selectedLanguage].budget}
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
              {languages[selectedLanguage].progress}
            </Text>
          </TouchableOpacity>
        </View>

      <ScrollView
        // style={styles.rootContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
            

        {activeTab === 'overview' && (
        <YourBalance balance={300} income={600} expense={300} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} loading={loading}/>
        )}

        {/* {activeTab === 'overview' && (
        <UpcomingRecurring recurringTransactions={recurringTransactions} />
        )} */}

        {activeTab === 'overview' && (
        <LatestTransactions transactions={transactions} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} currency={userSettings.currency}/>
        )}

        {activeTab === 'overview' && (
          <MonthlyIncome income={userIncome} updateIncome={updateIncome} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} currency={userSettings.currency}/>
        )}


        {/* {activeTab === 'overview' && (
        <ClosestSubscription transactions={transactions} selectedLanguage={selectedLanguage}/>
        )} */}

        {activeTab === 'budget' && (
        <BudgetSummary transactions={transactions} selectedLanguage={selectedLanguage}/>
        )}

        {activeTab === 'progress' && points && !!points[0] && (
          <YourPoints score={points[0].score} total={points[0].total} selectedLanguage={selectedLanguage}/>
        )}

        {activeTab === 'progress' && challanges && !!challanges[0] &&(
        <JoinedChallanges challanges={challanges[0]} selectedLanguage={selectedLanguage}/>
        )}

        {/* <Text style={styles.title}>Your Goals:</Text>
        <GoalList goals={goals} /> */}
      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
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
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: 30,
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
