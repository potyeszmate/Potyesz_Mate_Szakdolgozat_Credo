import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import OpenAI from 'openai'; 
import prompts, { basicMessages, models, topicMessages, topicsTranslations } from '../../util/prompts';
import axios from 'axios';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc, Transaction } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Message from '../../components/Chatbot/Message';
import { Icon } from 'react-native-elements';
import apiKeys from './../../apiKeys.json';
import { chatbotStyles } from './ChatbotStyles';
import { api } from './ChatbotConstants';
import { handleSend } from './ChatbotHelpers';
import { Crypto, Stock } from '../Savings/SavingsTypes';
import { RecurringTransactions } from '../Expenses/ExspensesTypes';
import { Income } from '../Home/HomeTypes';
import { useRoute } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';


const Chatbot = () => {
    const route = useRoute();
    const {selectedLanguage } = route.params;
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([basicMessages[selectedLanguage].initialGreeting]);
    const [currentTopic, setCurrentTopic] = useState('');
    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;
    const scrollViewRef = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [showTopics, setShowTopics] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [subscriptions, setSubscriptions] = useState<RecurringTransactions[]>([]);
    const [loansAndDebts, setLoansAndDebts] = useState<RecurringTransactions[]>([]);
    const [bills, setBills] = useState<RecurringTransactions[]>([]);
    const [cryptocurrencies, setCryptocurrencies] = useState<Crypto[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [goals, setGoals] = useState<any[]>([]);

    const sendParams = {
      userInput, conversation, currentTopic, transactions, incomes, subscriptions, loansAndDebts, bills, cryptocurrencies, stocks, goals,
      setConversation, setUserInput, setShowTopics, setCurrentTopic, basicMessages, api, models, apiKeys,
      fetchTransactions, fetchIncomes, selectedLanguage
  };

    async function fetchTransactions(uid: string) {
      try {
        const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
        const snapshot = await getDocs(transactionsQuery);
        if (snapshot.empty) {
          return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        return []; 
      }
    }

    async function fetchIncomes(uid: string) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchSubscriptions(uid: string) {
      const recurringQuery = query(collection(db, 'recurring_payments'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })); 
    }

    async function fetchLoansAndDebts(uid: string) {
      const recurringQuery = query(collection(db, 'loans_and_debt'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })); 
    }

    async function fetchBills(uid: string) {
      const recurringQuery = query(collection(db, 'bills'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })); 
    }

    async function fetchBudgets(uid: string) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchCryptos(uid: string) {
      const transactionsQuery = query(collection(db, 'cryptocurrencies'), where('uid', '==', uid));
      const snapshot = await getDocs(transactionsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchStocks(uid: string) {
      const incomesQuery = query(collection(db, 'stocks'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchGoals(uid: string) {
      const incomesQuery = query(collection(db, 'goals'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

  const handleTopicSelection = (topicKey: string) => {
    const topic = topicsTranslations[selectedLanguage][topicKey];
    const messageTemplate = topicMessages[selectedLanguage].topicPrompt;
    const message = messageTemplate.replace('{topic}', topic);

    setConversation(prev => [...prev, `Chatbot: ${message}`]);
    setCurrentTopic(topicKey);
    setShowTopics(false);
};

    
    useEffect(() => {
      async function fetchData() {
          setIsLoading(true);
          try {
            const [transactions, incomes, subscriptions, loans, bills, stocks, cryptos, goal, budgets, ] = await Promise.all([
              fetchTransactions(userId),
              fetchIncomes(userId),
              fetchSubscriptions(userId),
              fetchLoansAndDebts(userId),
              fetchBills(userId),
              fetchStocks(userId),
              fetchCryptos(userId),
              fetchGoals(userId),
            ]);
            setTransactions(transactions);
            setIncomes(incomes);
            setSubscriptions(subscriptions);
            setLoansAndDebts(loans);
            setBills(bills);
            setStocks(stocks),
            setCryptocurrencies(cryptos)
            setGoals(goal);
           
          } catch (error) {
            setIsLoading(false);

          } finally {
            setIsLoading(false);
          }
      }

      fetchData();
  }, [userId]);


    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    
    return (
      <KeyboardAvoidingView 
          style={chatbotStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
          <ScrollView 
              style={chatbotStyles.conversationContainer}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
              {conversation.map((text, index) => (
                  <Message key={index} text={text} isUser={text.startsWith("You:")} />
              ))}
          </ScrollView>
  
          {showTopics && (
              <View style={chatbotStyles.topicContainer}>
                  {["Spendings", "Budgets", "Goals", "Incomes", "Subscriptions", "Bills", "Loans", "Cryptos", "Stocks"].map((topic) => (
                      <TouchableOpacity
                          key={topic}
                          style={chatbotStyles.topicButton}
                          onPress={() => handleTopicSelection(topic)}
                      >
                       <Text style={chatbotStyles.topicText}>{languages[selectedLanguage][topic]}</Text>                          
                      </TouchableOpacity>
                  ))}
              </View>
          )}
  
          <View style={chatbotStyles.inputContainer}>
              <TextInput
                  style={[chatbotStyles.input, showTopics && chatbotStyles.inputDisabled]}
                  onChangeText={setUserInput}
                  value={userInput}
                  placeholder={languages[selectedLanguage].askAnything}
                  placeholderTextColor="#999"
                  returnKeyType="send"
                  onSubmitEditing={() => handleSend(sendParams)}
                  editable={!showTopics}
              />
  
              <TouchableOpacity 
                  style={chatbotStyles.sendButton} 
                  onPress={() => handleSend(sendParams)}
                  disabled={!userInput.trim()}
              >
                  <Icon name="send" size={24} color="#fff" />
              </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
  );
  
};

export default Chatbot;
