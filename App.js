/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { Image, View, Text } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import LoginScreen from './screens/LoginScreen';
import Welcome from './screens/Welcome';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RecurringPayments from './screens/RecurringPayments';
import Gamification from './components/ui/Gamification';
import Challanges from './components/ui/Challanges';
import TransactionsList from './components/ui/TransactionsList';


import ExpensesScreen from './screens/ExpensesScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import CustomHeader from './components/ui/CustomHeader';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import TransactionInput from './components/ui/TransactionInput';

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

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#F5F6F5' },
        tabBarActiveTintColor: '#1A1A2C',
        headerShown: route.name === 'Welcome' ? true : false,
      })}
    >
       <Tab.Screen
        name="Welcome"
        component={WelcomeStack}
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/home.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
          headerShown: true,
          header: () => (
            <CustomHeader
              navigation={navigation}
              route={route}
              authCtx={authCtx}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Payment"
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
              source={require('./assets/plus-navbar.png')}
              style={{ width: 62, height: 62, marginTop: 30 }}
              />
          ),
          tabBarLabel: '', // Set tabBarLabel to an empty string
        }}
      />
      
      <Tab.Screen
        name="Analytics"
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
        name="Save"
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/nut.png')}
              style={{ tintColor: color, width: 24, height: 24 }}
            />
          ),
          headerShown: true,

        }}
      />
    </Tab.Navigator>
  );
}


function Navigation() {
  const authCtx = useContext(AuthContext);

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

  const authCtx = useContext(AuthContext);

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
          <Root />
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
    </Stack.Navigator>
  );
}
