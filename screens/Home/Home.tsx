import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, updateDoc, setDoc, doc, getDoc } from 'firebase/firestore';
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
import MonthlyIncome from '../../components/ui/MonthlyIncome';
import WelcomeCard from '../../components/ui/WelcomeCard';
import AddBudget from '../../components/ui/AddBudget';
import OnboardingModal from '../../components/ui/OnboardingModal';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

// TODO Refactor this main component, move out styles, common methods to helpers, constants, and types
function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [userSettings, setUserSettings] = useState(null as any);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState(null as any);
  const authCtx: any = useContext(AuthContext);
  const { userId, email } = authCtx as any;  
  const [points, setPoints] = useState<any[]>([]);
  const [challanges, setChallanges] = useState<any[]>([]);
  const [userIncome, setUserIncome] = useState<any>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  
  const [prevCurrency, setPrevCurrency] = useState<string | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const [activeTab, setActiveTab] = useState('overview');
  const snapPoints = useMemo(() => ['30%', '50%'], []);

  useEffect(() => {
      async function fetchData() {
        const isOnboarding = await AsyncStorage.getItem('setOnboardingModal');

          if(isOnboarding == 'true'){
            setIsLoading(false)
            setShowOnboarding(true);

            return; 

          }

          if (!userId) {
            return
          };
         
          setIsLoading(true);
          try {
              const [trans, recTrans, chall, points, income, incomes, balance, settings] = await Promise.all([
                  fetchTransactions(userId),
                  fetchRecurringTransactions(userId),
                  fetchChallanges(userId),
                  fetchPoints(userId),
                  fetchIncome(userId),
                  fetchIncomes(userId),
                  fetchBalance(userId),
                  getUserSettings(userId),

                  await fetchLanguage(),
                  await fetchCurrency(),

              ]);

              setTransactions(trans as any);
              setRecurringTransactions(recTrans as any);
              setChallanges(chall);
              setPoints(points);
              setUserIncome(income);
              setIncomes(incomes as any);
              setBalance(balance as any);
              setUserSettings(settings)

          } catch (error) {
              console.error('Failed to fetch initial data:', error);
              setIsLoading(false);

          } finally {
              setIsLoading(false);
          }
      }
      fetchData();
  }, [userId,isOnboardingComplete]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const checkDataAndUpdate = async () => {
      const isOnboarding = await AsyncStorage.getItem('setOnboardingModal');

        if(isOnboarding == 'true'){
          return; 

        }

      if (isFocused) {
        await fetchLanguage();
        await fetchCurrency();
  
        const isTransactionChanged = await AsyncStorage.getItem('transactionsChanged');
        const isIncomesChanged = await AsyncStorage.getItem('incomesChanged');
        const isprofileChanged = await AsyncStorage.getItem('profileChanged');


        if (isTransactionChanged == "true") {
          setIsTransactionsLoading(true)

          await AsyncStorage.setItem('transactionsChanged', 'false');
          const newTransactions = await fetchTransactions(userId);
          await setTransactions(newTransactions)
          setIsTransactionsLoading(false)

        }

        if (isIncomesChanged == "true") {

          await AsyncStorage.setItem('incomesChanged', 'false');
          const newIncomes = await fetchIncomes(userId);
          await setIncomes(newIncomes)
        }

        if (isprofileChanged == "true") {
          setIsProfileLoading(true)

          await AsyncStorage.setItem('profileChanged', 'false');
          const newProfile = await getUserSettings(userId);
          await setUserSettings(newProfile);
          setIsProfileLoading(false)

        }

      }
    };
  
    checkDataAndUpdate(); 
  }, [isFocused]); 

  async function getUserSettings(uid: any) {
    const settingsRef = collection(db, 'users');
    const q = query(settingsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userSettings = querySnapshot?.docs[0]?.data();
        setIsProfileLoading(false)
        return userSettings;
    } else {

    }
}

  async function fetchTransactions(uid: any) {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
      const snapshot = await getDocs(transactionsQuery);
      setIsTransactionsLoading(false)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchIncomes(uid: any) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

  async function fetchRecurringTransactions(uid: any) {
      const recurringQuery = query(collection(db, 'recurring_payments'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

  async function fetchPoints(uid: any) {
    const recurringQuery = query(collection(db, 'points'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    }

  async function fetchChallanges(uid: any) {
    const recurringQuery = query(collection(db, 'joinedChallenges'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    }

  async function fetchIncome(uid: any) {
    const recurringQuery = query(collection(db, 'income'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs[0]?.data().income ? snapshot.docs[0]?.data().income : 0
    }

    async function fetchBalance(uid: string) {
      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', uid));
      const snapshot = await getDocs(balanceQuery);
      return snapshot.docs[0]?.data()?.balance ? snapshot.docs[0]?.data().balance : 0;

    }
  
  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const getSelectedCurrency = async () => {
    try {

      const savedSymbol = await AsyncStorage.getItem('symbol');
      const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');


      if (savedSymbol && savedConversionRate !== null) {
        setSymbol(savedSymbol);
        setConversionRate(savedConversionRate);
      } else {

        const defaultsavedSymbol= "$";
        const defaultConversionRate= 1;

        await AsyncStorage.setItem('conversionRate', defaultConversionRate.toString());
        await AsyncStorage.setItem('symbol', defaultsavedSymbol);

        setSymbol(savedSymbol);
        setConversionRate(savedConversionRate);
      }

    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };
  
  const fetchLanguage = async () => {
    await getSelectedLanguage();
  };

  const fetchCurrency = async () => {
    await getSelectedCurrency();
  };

  const updateProfilePicture = (imageUrl: any) => {
    setProfilePicture(imageUrl);
  };

  function getCurrencySymbol(currencyCode: any) {
      const symbols: any = {
          'USD': '$', 'EUR': '€', 'HUF': 'Ft', 'AUD': '$', 'CAD': '$', 'GBP': '£'
      };
      return symbols[currencyCode] || '';
  }

  const updateIncome = async (newIncome: string) => {
  
    try {
      const querySnapshot = await getDocs(collection(db, 'income'));
  
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
  
        const convertedIncome = conversionRate !== null ? (1 / conversionRate) * parseFloat(newIncome) : parseFloat(newIncome)

        if (userData.uid === userId) {
          await updateDoc(doc.ref, { income: convertedIncome });
          await fetchIncome(userId);
        }
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const uploadUserData = async (data, userId) => {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      estimatedBalance,
      monthlyIncome,
    } = data;
      
    if (!userId) {
      throw new Error("User ID is null or undefined.");
    }

    if (!data) {
      throw new Error("Data object is null or undefined.");
    }

    const settingsRef = doc(db, 'users', userId);
    await setDoc(settingsRef, {
      currency: 'USD',
      uid: userId,
      language: "English",
      firstName: firstName,
      lastName: lastName,
      birthday: dateOfBirth,
      gender: gender,
      isPremiumUser: false,
    });
  
    const balanceRef = doc(db, 'balance', userId);
    await setDoc(balanceRef, {
      balance: estimatedBalance,
      uid: userId,
    });
  
    const incomeRef = doc(db, 'income', userId);
    await setDoc(incomeRef, {
      income: monthlyIncome,
      uid: userId,
    });
  };
  
  if (!userId) {
    return <ActivityIndicator size="large" color="#0000ff" />
  } ;

  if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (showOnboarding) {
    return <OnboardingModal
    isVisible={showOnboarding}
    onComplete={async (data) => {
      Alert.alert(
        "Confirm Details",
        "Are you sure you want to continue with these details?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await uploadUserData(data, userId);
    
                await AsyncStorage.setItem('setOnboardingModal', 'false');
                
                setIsOnboardingComplete(true);
                setShowOnboarding(false);

                Alert.alert("Success", "You can now start your journey in the app!");
    
              } catch (error) {
                console.error("Error uploading onboarding data: ", error);
                Alert.alert("Error", "There was a problem saving your details. Please try again.");
              }
            }
          }
        ]
      );
    }}
    
  />
}

  return (

    <View style={styles.container}>
       <CustomHeader
        authCtx={authCtx} updateProfilePicture={updateProfilePicture} profile={userSettings} isLoading={isProfileLoading}
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
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
            

            {activeTab === 'overview' && balance !== null && incomes && transactions && (
              <YourBalance
                balance={balance}
                incomes={incomes}
                transactions={transactions}
                selectedLanguage={selectedLanguage}
                symbol={symbol}
                conversionRate={conversionRate}
                loading={isLoading}
              />
            )}

        {activeTab === 'overview' && userSettings && !userSettings.isPremiumUser && (
          <WelcomeCard 
            email={email} 
            firstName={userSettings.firstName} 
            lastName={userSettings.lastName}
          />
        )}

        {activeTab === 'overview' && userSettings && (
           transactions && <LatestTransactions transactions={transactions} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} currency={userSettings.currency} isLoading={isTransactionsLoading}/>
        )}

        {activeTab === 'overview' && userSettings && (
         <MonthlyIncome income={userIncome} updateIncome={updateIncome} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} currency={userSettings.currency}/>
        )}

        {activeTab === 'overview' && (
          <UpcomingRecurring recurringTransactions={recurringTransactions} />
        )}

        {activeTab === 'budget' && (
          <AddBudget updateIncome={updateIncome} selectedLanguage={selectedLanguage} symbol={symbol} conversionRate={conversionRate} currency={userSettings.currency}/>
        )}

        {activeTab === 'budget' && (
         transactions && <BudgetSummary transactions={transactions} selectedLanguage={selectedLanguage} currency={userSettings.currency} conversionRate={conversionRate} symbol={symbol}/>
        )}


        {activeTab === 'progress' && points && !!points[0] && (
          <YourPoints score={points[0].score} total={points[0].total} selectedLanguage={selectedLanguage}/>
        )}

        {activeTab === 'progress' && challanges && !!challanges[0] &&(
        <JoinedChallanges challanges={challanges[0]} selectedLanguage={selectedLanguage}/>
        )}

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
    paddingTop: 35,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
    borderColor: '#149E53',
    borderWidth: 0.6
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',

  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 5
  },

  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
  },
  activeTabButton: {
    backgroundColor: '#35BA52',
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

  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
  flex: 1,
  alignItems: 'center',
},

});

export default Home;
