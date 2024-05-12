import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, updateDoc, setDoc, doc, } from 'firebase/firestore';
import YourBalance from '../../components/Balance/YourBalance';
import UpcomingRecurring from '../../components/CommonComponents/UpcomingRecurring';
import LatestTransactions from '../../components/Transactions/LatestTransactions';
import BudgetSummary from '../../components/Budget/BudgetSummary';
import YourPoints from '../../components/Achievements/YourPoints';
import JoinedChallanges from '../../components/Challenges/JoinedChallanges';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import CustomHeader from '../../components/CommonComponents/CustomHeader';
import WelcomeCard from '../../components/CommonComponents/PremiumPayment';
import AddBudget from '../../components/Budget/AddBudget';
import OnboardingModal from '../../components/CommonComponents/OnboardingModal';
import Toast from 'react-native-toast-message';
import { homeStyles } from './HomeStyles';
import { languages } from '../../commonConstants/sharedConstants';
import { RecurringTransactions } from '../Expenses/ExspensesTypes';
import { Income, MonthlyIncomes, Points, Transaction } from './HomeTypes';
import MonthlyIncome from '../../components/Balance/MonthlyIncome';


function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userSettings, setUserSettings] = useState(null as any);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransactions[]>([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const authCtx: any = useContext(AuthContext);
  const { userId, email } = authCtx;  
  const [points, setPoints] = useState<Points[]>([]);
  const [challanges, setChallanges] = useState<any[]>([]);
  const [userIncome, setUserIncome] = useState<MonthlyIncomes>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState('overview');

  // authCtx.logout();

  async function getUserSettings(uid: string) {
    console.log("CALLED GETUSERSETTINGS")
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

  async function fetchTransactions(uid: string) {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
      const snapshot = await getDocs(transactionsQuery);
      setIsTransactionsLoading(false)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
  }

  async function fetchIncomes(uid: string) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
  }

  async function fetchRecurringTransactions(uid: string) {
      const recurringQuery = query(collection(db, 'recurring_payments'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
  }

  async function fetchPoints(uid: string) {
    const recurringQuery = query(collection(db, 'points'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async function fetchChallanges(uid: string) {
    const recurringQuery = query(collection(db, 'joinedChallenges'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async function fetchIncome(uid: string) {
    const recurringQuery = query(collection(db, 'income'), where('uid', '==', uid));
    const snapshot = await getDocs(recurringQuery);
    return snapshot.docs[0]?.data().income ? snapshot.docs[0]?.data().income : 0
  }

  async function fetchBalance(uid: string) {
      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', uid));
      const snapshot = await getDocs(balanceQuery);
      return snapshot.docs[0]?.data()?.balance ? snapshot.docs[0]?.data().balance : 0;

  }
  
  const fetchLanguage = async () => {
    await getSelectedLanguage();
  };

  const fetchCurrency = async () => {
    await getSelectedCurrency();
  };

  const updateProfilePicture = (imageUrl: string) => {
    setProfilePicture(imageUrl);
  };

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

  const uploadUserData = async (data: any, userId: string) => {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      estimatedBalance,
      monthlyIncome,
    } = data;
      
    console.log("UPLOADING THIS USERDATA: ", data)
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
  
  useEffect(() => {
    async function fetchData() {
      const isOnboarding = await AsyncStorage.getItem('setOnboardingModal');
  
      if (isOnboarding == 'true') {
        setIsLoading(false);
        setShowOnboarding(true);
        return;
      }
  
      if (!userId) {
        return;
      }
  
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
  
        setTransactions(trans);
        setRecurringTransactions(recTrans);
        setChallanges(chall);
        setPoints(points);
        setUserIncome(income);
        setIncomes(incomes);
        setBalance(balance);
        setUserSettings(settings);
  
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userId, isOnboardingComplete]);
  
  const isFocused = useIsFocused();
  
  useEffect(() => {
    const checkDataAndUpdate = async () => {
      const isOnboarding = await AsyncStorage.getItem('setOnboardingModal');
  
      if (isOnboarding == 'true') {
        console.log("IN ONBOARDING PHASE")
        return;
      }
  
      if (isFocused) {
        await fetchLanguage();
        await fetchCurrency();
  
        const isTransactionChanged = await AsyncStorage.getItem('transactionsChanged');
        const isIncomesChanged = await AsyncStorage.getItem('incomesChanged');
        const isprofileChanged = await AsyncStorage.getItem('profileChanged');
  
        if (isTransactionChanged == "true") {
          setIsTransactionsLoading(true);
  
          await AsyncStorage.setItem('transactionsChanged', 'false');
          const newTransactions = await fetchTransactions(userId);
          const newBalance = await fetchBalance(userId);
  
          setTransactions(newTransactions);
          setBalance(newBalance);
  
          setIsTransactionsLoading(false);
        }
  
        if (isIncomesChanged == "true") {
          setIsTransactionsLoading(true);
  
          await AsyncStorage.setItem('incomesChanged', 'false');
          const newIncomes = await fetchIncomes(userId);
          const newBalance = await fetchBalance(userId);
  
          setIncomes(newIncomes);
          setBalance(newBalance);
  
          setIsTransactionsLoading(false);
        }
  
        if (isprofileChanged == "true") {
          setIsProfileLoading(true);
  
          await AsyncStorage.setItem('profileChanged', 'false');
          const newProfile = await getUserSettings(userId);
          setUserSettings(newProfile);
  
          setIsProfileLoading(false);
        }
      }
    };
  
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Hello',
      text2: 'This is some something 👋',
      visibilityTime: 2000
    });
  
    checkDataAndUpdate();
  }, [isFocused]);
  

  if (!userId) {
    return <ActivityIndicator size="large" color="#0000ff" />
  };

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

  if (!userSettings){
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

return (
  <View style={homeStyles.container}>
    <CustomHeader
      authCtx={authCtx}
      updateProfilePicture={updateProfilePicture}
      profile={userSettings}
      isLoading={isProfileLoading}
      selectedLanguage={selectedLanguage}
    />

    <View style={homeStyles.tabBarContainer}>
      <TouchableOpacity
        style={[
          homeStyles.tabButton,
          activeTab === 'overview' && homeStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('overview')}
      >
        <Text
          style={[
            homeStyles.tabButtonText,
            activeTab === 'overview' && homeStyles.activeTabButtonText,
          ]}
        >
          {languages[selectedLanguage].overview}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          homeStyles.tabButton,
          activeTab === 'budget' && homeStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('budget')}
      >
        <Text
          style={[
            homeStyles.tabButtonText,
            activeTab === 'budget' && homeStyles.activeTabButtonText,
          ]}
        >
          {languages[selectedLanguage].budget}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          homeStyles.tabButton,
          activeTab === 'progress' && homeStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('progress')}
      >
        <Text
          style={[
            homeStyles.tabButtonText,
            activeTab === 'progress' && homeStyles.activeTabButtonText,
          ]}
        >
          {languages[selectedLanguage].progress}
        </Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      contentContainerStyle={homeStyles.scrollContentContainer}
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
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeTab === 'overview' && userSettings && transactions && (
        <LatestTransactions
          incomes={incomes}
          transactions={transactions}
          selectedLanguage={selectedLanguage}
          symbol={symbol}
          conversionRate={conversionRate}
          currency={userSettings.currency}
          isLoading={isTransactionsLoading}
        />
      )}

      {activeTab === 'overview' && userSettings && (
        <MonthlyIncome
          income={userIncome}
          updateIncome={updateIncome}
          selectedLanguage={selectedLanguage}
          symbol={symbol}
          conversionRate={conversionRate}
          currency={userSettings.currency}
        />
      )}

      {activeTab === 'overview' && (
        <UpcomingRecurring 
        recurringTransactions={recurringTransactions} 
        selectedLanguage={selectedLanguage}
        symbol={symbol}
        conversionRate={conversionRate} 
        currency = {userSettings.currency}
        />
      )}

      {activeTab === 'budget' && (
        <AddBudget
          updateIncome={updateIncome}
          selectedLanguage={selectedLanguage}
          symbol={symbol}
          conversionRate={conversionRate}
          currency={userSettings.currency}
        />
      )}

      {activeTab === 'budget' && transactions && (
        <BudgetSummary
          transactions={transactions}
          selectedLanguage={selectedLanguage}
          currency={userSettings.currency}
          conversionRate={conversionRate}
          symbol={symbol}
        />
      )}

      {activeTab === 'progress' && points && !!points[0] && (
        <YourPoints
          score={points[0].score}
          total={points[0].total}
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeTab === 'progress' && challanges && !!challanges[0] && (
        <JoinedChallanges challanges={challanges[0]} selectedLanguage={selectedLanguage} />
      )}
    </ScrollView>
  </View>
);
}

export default Home;
