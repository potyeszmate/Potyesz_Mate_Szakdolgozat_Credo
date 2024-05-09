import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import LoginScreen from './screens/Authentication/Login/LoginScreen';
import Welcome from './screens/Authentication/Onboard/Welcome';
import SignupScreen from './screens/Authentication/Register/SignupScreen';
import RecurringPayments from './screens/Expenses/SubPages/RecurringPayments';
import Gamification from './components/Challenges/Gamification';
import Challanges from './components/Challenges/Challanges';
import TransactionsList from './components/Transactions/TransactionsList';
import ExpensesScreen from './screens/Expenses/ExpensesScreen';
import AnalyticsScreen from './screens/Analytics/AnalyticsScreen';
import GoalScreen from './screens/Savings/SubPages/GoalScreen';
import CustomHeader from './components/CommonComponents/CustomHeader';
import { Colors } from './commonConstants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import TransactionInput from './components/Transactions/TransactionInput';
import SettingsPage from './screens/Settings/SettingsPage';
import ProfilePage from './screens/Profile/ProfilePage';
import LoansAndDebt from './screens/Expenses/SubPages/LoansAndDebt';
import Bills from './screens/Expenses/SubPages/Bills';
import en from './languages/en.json';
import de from './languages/de.json';
import hu from './languages/hu.json';
import SavingsScreen from './screens/Savings/SavingsScreen';
import CryptoCurrenciesScreen from './screens/Savings/SubPages/CryptoCurrenciesScreen';
import CryptoDetails from './components/Crypto/CryptoDetails';
import StocksScreen from './screens/Savings/SubPages/StocksScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
import BudgetDetail from './components/Budget/BudgetDetail';
import UserProfileCard from './components/Profile/UserProfileCard';
import Payment from './screens/Payment/Payment';
import StockDetails from './components/Stock/StockDetails';
import GoalDetailScreen from './components/Goals/GoalDetailScreen';
import SpendingAnalytics from './screens/Analytics/SubPages/SpendingAnalytics';
import Chatbot from './screens/Chatbot/Chatbot';
import RecurringAnalytics from './screens/Analytics/SubPages/RecurringAnalytics';
import CashFlowAnalytics from './screens/Analytics/SubPages/CashFlowAnalytics';
import BalanceAnalytics from './screens/Analytics/SubPages/BalanceAnalytics';
import StocksAndCryptoAnalytics from './screens/Analytics/SubPages/StocksAndCryptoAnalytics';
import Home from './screens/Home/Home';
import CurrencyPage from './screens/Settings/SubPages/CurrencyPage';
import LanguagePage from './screens/Settings/SubPages/LanguagePage';
import NotificationsPage from './screens/Settings/SubPages/NotificationsPage';
import BugReport from './screens/Settings/SubPages/BugReport';
import ConnectPage from './screens/Settings/SubPages/ConnectPage';
import FaqPage from './screens/Settings/SubPages/FaqPage';
import apiKeys from './apiKeys.json';
import Toast from 'react-native-toast-message';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStackScreen() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }}/>
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true }}/>

  </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
    </Stack.Navigator>
  );
}

function TabNavigator() {

  // TODO -> bugfix/refactor -> make language change dynamic here in tabs as well
  const authCtx = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  
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

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
    }
  }, []);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#F5F6F5' },
        tabBarActiveTintColor: '#35BA52',
        tabBarIndicatorStyle: {
          backgroundColor: '#35BA52', 
          height: '100%', 
        },
        headerShown: route.name === 'Welcome' ? true : false,
      })}
    >
       <Tab.Screen
        name={languages[selectedLanguage].welcome}
        component={HomeStack}
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/home.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
          headerShown: route.name === 'Welcome' ? true : false,
        })}
      />
      <Tab.Screen
        name={languages[selectedLanguage].payment}
        component={ExpensesStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/chart-pie.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={languages[selectedLanguage].analytics}
        component={AnalyticsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/analytics.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
        }
      }
      />
      <Tab.Screen
        name={languages[selectedLanguage].savings}
        component={SavingsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/nut.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext) as any;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <NavigationContainer>
        {!authCtx.isAuthenticated ? (
          <AuthStackScreen />
        ) : (
          <AuthenticatedStack />
        )}
        <Toast />
      </NavigationContainer>
    </View>

  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext) as any;
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthContextProvider>
          <StatusBar barStyle="dark-content" />
          <StripeProvider publishableKey={apiKeys.STRIPE_KEY}>
              <Root />
          </StripeProvider>
        </AuthContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function ExpensesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        
      }}
    >
      <Stack.Screen
        name="Payment"
        component={ExpensesScreen}
      />
      <Stack.Screen
        name="Recurrings"
        component={RecurringPayments}
      />

      <Stack.Screen
        name="Loans"
        component={LoansAndDebt}
      />

      <Stack.Screen
        name="Bills"
        component={Bills}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfilePage}
      />

      <Stack.Screen
        name="Chatbot"
        component={Chatbot}
      />

      <Stack.Screen
        name="Recurrings"
        component={RecurringPayments}
      />
      <Stack.Screen
        name="Transactions"
        component={TransactionsList}
      />
      <Stack.Screen
        name="Gamification"
        component={Gamification}
      />
      <Stack.Screen
        name="Challenges"
        component={Challanges}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsPage}
      />

      <Stack.Screen
        name="Currency"
        component={CurrencyPage}
      />

      <Stack.Screen
        name="Language"
        component={LanguagePage}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsPage}
      />

      <Stack.Screen
        name="Report"
        component={BugReport}
      />

      <Stack.Screen
        name="Connect"
        component={ConnectPage}
      />

      <Stack.Screen
        name="FAQ"
        component={FaqPage}
      />  

      <Stack.Screen 
        name="Budget" 
        component={BudgetDetail} />

      <Stack.Screen 
        name="Payment" 
        component={Payment} />

    </Stack.Navigator>
  );
}

function SavingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
      }}
    >
      <Stack.Screen
        name="Savings"
        component={SavingsScreen}
      />

      <Stack.Screen
        name="Goals"
        component={GoalScreen}
      />

      <Stack.Screen
        name="Goal Detail"
        component={GoalDetailScreen}
      /> 

      <Stack.Screen
        name="Stocks"
        component={StocksScreen}
      />

      <Stack.Screen
        name="Stock Details"
        component={StockDetails}
      />

      <Stack.Screen
        name="Cryptocurrencies"
        component={CryptoCurrenciesScreen}
      />

      <Stack.Screen
        name="Crypto Details"
        component={CryptoDetails}
      /> 
      
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{     
      }}
    >
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
      />

      <Stack.Screen
        name="Balance"
        component={BalanceAnalytics}
      />

      <Stack.Screen
        name="Spending"
        component={SpendingAnalytics}
      />
      
      <Stack.Screen
        name="Cash Flow"
        component={CashFlowAnalytics}
      />
      
      <Stack.Screen
        name="Recurring"
        component={RecurringAnalytics}
      />
      
      <Stack.Screen
        name="Investments"
        component={StocksAndCryptoAnalytics}
      />
    
    
      
    </Stack.Navigator>
  );
}
