/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
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
import WelcomeScreen from './screens/Home/WelcomeScreen';
import RecurringPayments from './screens/Recurrings/RecurringPayments';
import Gamification from './components/ui/Gamification';
import Challanges from './components/ui/Challanges';
import TransactionsList from './components/ui/TransactionsList';
import ExpensesScreen from './screens/Expenses/ExpensesScreen';
import AnalyticsScreen from './screens/Analytics/AnalyticsScreen';
import GoalScreen from './screens/Save/GoalScreen';
import CustomHeader from './components/ui/CustomHeader';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import TransactionInput from './components/ui/TransactionInput';
import SettingsPage from './screens/Settings/SettingsPage';
import ProfilePage from './screens/Profile/ProfilePage';
import CurrencyPage from './components/ui/CurrencyPage';
import LanguagePage from './components/ui/LanguagePage';
import NotificationsPage from './components/ui/NotificationsPage';
import ThemePage from './components/ui/ThemePage';
import BugReport from './components/ui/BugReport';
import ConnectPage from './components/ui/ConnectPage';
import FaqPage from './components/ui/FaqPage';
import LoansAndDebt from './screens/Recurrings/LoansAndDebt';
import Bills from './screens/Recurrings/Bills';
import en from './languages/en.json';
import de from './languages/de.json';
import hu from './languages/hu.json';
import SavingsScreen from './screens/Save/SavingsScreen';
import CryptoCurrenciesScreen from './screens/Save/CryptoCurrenciesScreen';
import CryptoDetails from './components/ui/CryptoDetails';
import StocksScreen from './screens/Save/StocksScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
import BudgetDetail from './components/ui/BudgetDetail';
import UserProfileCard from './components/ui/UserProfileCard';
import Payment from './screens/Payment/Payment';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const STRIPE_KEY = 'pk_test_51P7PiGRxFFZ42bcDIB4ZlNMLSkp7SxCfBXQjbsAlYVpcS8j6me3cjfcqNKrZZL7Gz4EybixVJibN0YkfWUnysMVL008ZkfArvi'
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
  const authCtx = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  
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
      fetchLanguage();
      console.log("In app.tsx useffect")
    }
  }, []);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#F5F6F5' },
        tabBarActiveTintColor: '#35BA52',
        headerShown: route.name === 'Welcome' ? true : false,
      })}
    >
       <Tab.Screen
        name={languages[selectedLanguage].welcome}
        component={WelcomeStack}
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/home.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
          headerShown: route.name === 'Welcome' ? true : false,
          // header: () => (
          //   <CustomHeader
          //     navigation={navigation}
          //     route={route}
          //     authCtx={authCtx}
          //   />
          // ),
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
        name="AddButton"
        component={TransactionInput}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/IconButton.png')}
              style={{ width: 62, height: 62, marginTop: 30 }}
              />
          ),
          tabBarLabel: '', // Set tabBarLabel to an empty string
        }}
      />
      
      <Tab.Screen
        name={languages[selectedLanguage].analytics}
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/analytics.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
          headerShown: true,
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
          // headerShown: true,

        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext) as any;

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated ? (
        <AuthStackScreen />
      ) : (
        <AuthenticatedStack />
      )}
    </NavigationContainer>
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
          <StatusBar style="light" />
          <StripeProvider publishableKey={STRIPE_KEY}>
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
        // headerStyle: { backgroundColor: '#F5F6F5' },
        // headerTintColor: 'white',
        // contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Payment"
        component={ExpensesScreen}
      />
      <Stack.Screen
        name="RecurringPayments"
        component={RecurringPayments}
      />

      <Stack.Screen
        name="LoansAndDebt"
        component={LoansAndDebt}
      />

      <Stack.Screen
        name="Bills"
        component={Bills}
      />
    </Stack.Navigator>
  );
}

function WelcomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerStyle: { backgroundColor: '#F5F6F5' },
        // headerTintColor: 'white',
        // contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }} // Set headerShown to false for the "Welcome" screen
      />

      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
      />

      <Stack.Screen
        name="RecurringPayments"
        component={RecurringPayments}
      />
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsList}
      />
      <Stack.Screen
        name="Gamification"
        component={Gamification}
      />
      <Stack.Screen
        name="Challanges"
        component={Challanges}
      />

      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        // options={{ headerShown: false }} // Set headerShown to false for the "Welcome" screen
      />

      <Stack.Screen
        name="CurrencyPage"
        component={CurrencyPage}
      />

      <Stack.Screen
        name="LanguagePage"
        component={LanguagePage}
      />

      <Stack.Screen
        name="NotificationsPage"
        component={NotificationsPage}
      />

      <Stack.Screen
        name="ThemePage"
        component={ThemePage}
      />

      <Stack.Screen
        name="BugReport"
        component={BugReport}
      />

      <Stack.Screen
        name="ConnectPage"
        component={ConnectPage}
      />

      <Stack.Screen
        name="FaqPage"
        component={FaqPage}
      />  

      <Stack.Screen 
        name="BudgetDetail" 
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
        // headerStyle: { backgroundColor: '#F5F6F5' },
        // headerTintColor: 'white',
        // contentStyle: { backgroundColor: Colors.primary100 },
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
        name="Stocks"
        component={StocksScreen}
      />

      <Stack.Screen
        name="CryptoCurrencies"
        component={CryptoCurrenciesScreen}
      />

      <Stack.Screen
        name="CryptoDetails"
        component={CryptoDetails}
      />
      
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerStyle: { backgroundColor: '#F5F6F5' },
        // headerTintColor: 'white',
        // contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{ headerShown: false }} // Hide the header for the SettingsPage screen

        // options={{ headerShown: false }} // Set headerShown to false for the "Welcome" screen
      />
      <Stack.Screen
        name="CurrencyPage"
        component={CurrencyPage}
        // options={{ headerShown: false }} // Hide the header for the SettingsPage screen
        
      />
      {/* <Stack.Screen
        name="TransactionsList"
        component={TransactionsList}
      />
      <Stack.Screen
        name="Gamification"
        component={Gamification}
      />
      <Stack.Screen
        name="Challanges"
        component={Challanges}
      />

      <Stack.Screen
        name="SettingsPage"  //PIN
        component={SettingsPage}
      /> */}

      {/* <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
      /> */}

    </Stack.Navigator>
  );
}
