import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import OpenAI from 'openai'; // Adjust based on actual exported name
import prompts, { basicMessages, models } from '../../util/prompts';
import axios from 'axios';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Message from '../../components/ui/Message';
import { Icon } from 'react-native-elements';

export const OPENAI_API_KEY= 'sk-proj-BAjAoTHZearEfetmybGmT3BlbkFJTBtAGIoFP7bThJTv4Wz3'

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([basicMessages.initialGreeting]);
    const [currentTopic, setCurrentTopic] = useState('');

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;
    const scrollViewRef = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [showTopics, setShowTopics] = useState(true);

    const [transactions, setTransactions] = useState<any[]>([]);
    const [incomes, setIncomes] = useState<any[]>([]);

    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loansAndDebts, setLoansAndDebts] = useState<any[]>([]);
    const [bills, setBills] = useState<any[]>([]);
    const [cryptocurrencies, setCryptocurrencies] = useState<any[]>([]);
    const [stocks, setStocks] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);

    const [challanges, setChallenges] = useState<any[]>([]);
    const [balance, setBalance] = useState<number | null>(null);

    const api = 'https://api.openai.com/v1/chat/completions'

    async function fetchTransactions(uid) {
      console.log(`Fetching transactions for user ID: ${uid}`); // Log the user ID being used
      try {
        const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
        const snapshot = await getDocs(transactionsQuery);
        if (snapshot.empty) {
          console.log('No matching documents.');
          return [];
        }
        console.log("There was data in transaction")
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        return []; // Return an empty array or handle the error appropriately
      }
    }

    async function fetchIncomes(uid: any) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchSubscriptions(uid: any) {
      const recurringQuery = query(collection(db, 'recurring_payments'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })); 
    }

    async function fetchLoansAndDebts(uid: any) {
      const recurringQuery = query(collection(db, 'loans_and_debt'), where('uid', '==', uid));
      const snapshot = await getDocs(recurringQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })); 
    }

    async function fetchBills(uid: any) {
      const recurringQuery = query(collection(db, 'bills'), where('uid', '==', uid));
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

    async function fetchBalance(uid: string) {
      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', uid));
      const snapshot = await getDocs(balanceQuery);
      return snapshot.docs[0]?.data()?.balance ? snapshot.docs[0]?.data().balance : 0;
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      // console.log("BALANCE ", balance)

      // setBalance(balance);  // Convert balance o number if it exists
    }

    async function fetchBudgets(uid: any) {
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      // setIsIncomeLoading(false)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchCryptos(uid: any) {
      const transactionsQuery = query(collection(db, 'cryptocurrencies'), where('uid', '==', uid));
      const snapshot = await getDocs(transactionsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchStocks(uid: any) {
      const incomesQuery = query(collection(db, 'stocks'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    async function fetchGoals(uid: any) {
      const incomesQuery = query(collection(db, 'goals'), where('uid', '==', uid));
      const snapshot = await getDocs(incomesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));  
    }

    const handleTopicSelection = (topic) => {
      setConversation(prev => [...prev, `Chatbot: Sure, please ask me any question about your ${topic}.`]);
      setCurrentTopic(topic);
      setShowTopics(false);
  };
    
    useEffect(() => {
      async function fetchData() {
          setIsLoading(true);
          try {
              const [transactions, incomes, subscriptions, loans, bills, stocks, cryptos, goal, balance, budgets, ] = await Promise.all([
                  fetchTransactions(userId),
                  fetchIncomes(userId),
                  fetchSubscriptions(userId),
                  fetchLoansAndDebts(userId),
                  fetchBills(userId),
                  fetchStocks(userId),
                  fetchCryptos(userId),
                  fetchGoals(userId),
                  // fetchBudgets(userId),
                  
              ]);
              setTransactions(transactions);
              setIncomes(incomes);
              setSubscriptions(subscriptions);
              setLoansAndDebts(loans);
              setBills(bills);
              setStocks(stocks),
              setCryptocurrencies(cryptos)
              setGoals(goal);
              // fetchBudgets(budgets),
           

          } catch (error) {
              setIsLoading(false);

          } finally {
              setIsLoading(false);
          }
      }

      console.log("FETCHED THE DATA")
      fetchData();
  }, [userId]);

      
  useEffect(() => {
    console.log("Updated goals: ", goals );
  }, [goals]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
  
    const isAwaitingFollowUp = conversation.length > 0 && conversation[conversation.length - 1].includes("Do you want to ask another question about");

    if (isAwaitingFollowUp) {
      const userResponse = userInput.trim().toLowerCase();
      if (userResponse === 'yes') {
        setConversation(prev => [...prev, `You: ${userInput}`, `Chatbot: What else would you like to know about ${currentTopic}?`]);
        // Allow the user to ask another question within the current topic
        setUserInput(''); // This should clear the input field.
      } else if (userResponse === 'no') {
        setShowTopics(true); // Show the topic selection again
        setConversation(prev => [...prev, `You: ${userInput}`, basicMessages.selectFromTopics]);
        setCurrentTopic(''); // Reset current topic
        setUserInput(''); // This should clear the input field.
      } else {
        // The user didn't respond with 'yes' or 'no'
        setConversation(prev => [...prev, `You: ${userInput}`, `Chatbot: I didn't really catch that, can you answer again with 'yes' or 'no', please?`]);
        setUserInput(''); // This should clear the input field.
        return; // Early return to avoid processing the input as a new query
      }
    } 
    else {
      setConversation(prev => [...prev, `You: ${userInput}`]);
      setUserInput('');
      // Check if the current topic is 'Spendings' and format transactions accordingly.
      let systemMessageContent = "";

      // Set up prompts about spendings 
      if (currentTopic === 'Spendings') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        if (transactions.length > 0) {
          const formattedTransactions = transactions.map(transaction => {
            const dateOptions: any = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
            return `Date: ${date.replace(/ /g, ' ')} - Name: ${transaction.name} - Category: (${transaction.category}) Spent ammount: $${transaction.value}`;
          }).join(", ");
          console.log("formattedTransactions for spending", formattedTransactions)
          
        systemMessageContent = `The user's incomes and earnings are the following earning transactions: ${formattedTransactions}`;
        }
      else {
        // Handle the case where there are no transactions
        systemMessageContent = "The user has no recent transactions.";
      }

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in finance management and transaction analysis." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 2000,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Incomes') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        if (incomes.length > 0) {
          const formattedIncomes = incomes.map(transaction => {
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
            return `Date: ${date.replace(/ /g, ' ')} - Name: ${transaction.name} - Earned amount: $${transaction.value}`;
          }).join(", ");
          
          systemMessageContent = `The user's incomes and earnings are the following earning transactions: ${formattedIncomes}`;
        } else {
          systemMessageContent = "The user has no recorded income transactions. Let the user know he has no income yet.";
        }
      console.log('incomes in handleSend: ', systemMessageContent)

      try {
        // const systemPromptForIncomeAnalysis = `Provide a summary of the user's income transactions and any notable trends, such as regular payments that might indicate stable salary deposits or irregular large amounts that could suggest freelance payments.`;

        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in finance management, income and expense analysis." },
            { role: "user", content: userInput },
            // { role: "system", content: systemPromptForIncomeAnalysis },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 2000,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Subscriptions') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedSubscriptions = "";
        try {
          if (subscriptions.length > 0) {
            formattedSubscriptions = subscriptions.map(subscription => {
              const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
              const date = new Date(subscription.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions);
              const value = Math.trunc(subscription.value);
              return `Date: ${date.replace(/ /g, ' ')} - Name: ${subscription.name} - Importance: ${subscription.Importance} - Value: $${value} - Frequency: ${subscription.category}`;
            }).join(", ");
            systemMessageContent = `The user's subscriptions details are as follows: ${formattedSubscriptions}`;
            console.log("formattedSubscriptions", formattedSubscriptions)
          }
          else{
            systemMessageContent = "The user has no recorded subscriptions yet. Let the user know he has no subscription yet.";

          }
        } catch (error) {

          console.error("Error formatting subscriptions: ", error);
        }

      console.log('Subscription in handleSend: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in subscription management and analysis. You can identify subscription patterns, suggest optimizations, and advise on managing recurring payments or answer other questions." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 1000,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Loans') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedLoansAndDebts = "";
        try {
          if (loansAndDebts.length > 0) {
            formattedLoansAndDebts = loansAndDebts.map(loan => {
              const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
              const createDate = loan.Date && typeof loan.Date.seconds === 'number' 
                                 ? new Date(loan.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions) 
                                 : 'No creation date provided';
              const dueDate = loan.dueDate && typeof loan.dueDate.seconds === 'number'
                              ? new Date(loan.dueDate.seconds * 1000).toLocaleDateString('en-US', dateOptions)
                              : 'No due date provided';
              const value = Math.trunc(loan.value);
              return `Creation Date: ${createDate} - Due Date: ${dueDate} - Name: ${loan.name} - Value: $${value} - Frequency: ${loan.category}`;
            }).join(", ");
            systemMessageContent = `The user's loans and debts details are as follows: ${formattedLoansAndDebts}`;
            console.log("formattedSubscriptions", formattedLoansAndDebts)
          }
          else{
            systemMessageContent = "The user has no recorded loans or debts yet. Let the user know he has no loans or debts yet so he is lucky.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      console.log('Loans in handleSend: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in loans and debt management and analysis. You can identify patterns, suggest optimizations, and advise on managing debts or answer other related questions." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Bills') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedBills = "";
        try {
          if (bills.length > 0) {
            formattedBills = bills.map(bill => {
              const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
              const date = bill.Date && typeof bill.Date.seconds === 'number' 
                           ? new Date(bill.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions) 
                           : 'No date provided';
              const value = Math.trunc(bill.value);
              return `Date: ${date} - Name: ${bill.name} bill - Value: $${value}`;
            }).join(", ");
            systemMessageContent = `The user's bills are detailed below, providing insights into upcoming dues and financial commitments: ${formattedBills}`;
            console.log("formattedBills", formattedBills)
          }
          else{
            systemMessageContent = "The user has no recorded bills yet. Let the user know he has no bills yet so he is lucky.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      console.log('Loans in handleSend: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in bill management and analysis. You can suggest payment strategies, and help prioritize bills and answer other questions" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Cryptos') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedCryptos = "";
        try {
          if (cryptocurrencies.length > 0) {
            formattedCryptos = cryptocurrencies.map(crypto => {
              const amountFormatted = crypto.amount.toFixed(3); // Ensure 3 decimal places
              return `Cryptocurrency Name: ${crypto.name} - Share amount: ${amountFormatted}`;
            }).join(", ");
            systemMessageContent = `The user's cryptocurrency portfolio is detailed below: ${formattedCryptos}. Please provide the current value analysis based on these holdings.`;
            console.log("formattedCryptos", formattedCryptos)
          }
          else{
            systemMessageContent = "The user has no cryptos yet. Let the user know he has no cryptocurrencies yet.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      console.log('Loans in handleSend: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in cryptocurrency portfolio management and valuation analysis. You can count how much money the user has in his owned crypto based on his share of that crypto" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Stocks') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedStocks  = "";
        try {
          if (stocks.length > 0) {
            formattedStocks = stocks.map(stock => {
              const amountFormatted = stock.amount.toFixed(3); // Ensure 3 decimal places
              return `Stock Name: ${stock.name} - Share amount: ${amountFormatted}`;
            }).join(", ");
            systemMessageContent = `The user's stock portfolio is detailed below: ${formattedStocks}. Please provide the current value analysis based on these holdings.`;
            console.log("formattedCryptos", formattedStocks)
          }
          else{
            systemMessageContent = "The user has no cryptos yet. Let the user know he has no cryptocurrencies yet.";

          }
        } catch (error) {

          console.error("Error formatting loans: ", error);
        }

      console.log('Loans in handleSend: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in stock portfolio management and valuation analysis. You can count how much money the user has in his owned stock based on his share of that stock" },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 400,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
      if (currentTopic === 'Goals') {
        console.log("CURRENT TOPIC IS: ", currentTopic)
        let formattedGoals = "";
        const today = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayFormatted = today.toLocaleDateString('en-US', dateOptions);
        try {
          if (goals.length > 0) {
            formattedGoals = goals.map(goal => {
              const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
              const dueDate = goal.Date && typeof goal.Date.seconds === 'number' 
                             ? new Date(goal.Date.seconds * 1000).toLocaleDateString('en-US', dateOptions)
                             : 'No due date provided';
              return `| Goal Name: ${goal.Name} - Already saved amount: $${goal.Current_Ammount.toFixed(0)} - Needed amount: $${goal.Total_Ammount.toFixed(0)} - Approximately  Due Date: ${dueDate} |`;
            }).join(", ");
            systemMessageContent = `As of today, ${todayFormatted}, the user's financial goals are detailed below: ${formattedGoals}. Please provide advice on how the user can efficiently meet these goals based on their current progress and the timelines.`;
            console.log("formattedGoals", formattedGoals)
          }

          else{
            systemMessageContent = "The user has no financial goals set up yet. Let the user know he has  no financial goals yet.";

          }
        } catch (error) {

          console.error("Error formatting goals: ", error);
        }

      console.log('goals: ', systemMessageContent)

      try {
        const response = await axios.post(api, {
          model: models.gpt4Turbo,
          messages: [
            { role: "system", content: "You are a helpful assistant, skilled in financial goal planning and advising on saving strategies." },
            { role: "user", content: userInput },
            { role: "system", content: systemMessageContent }
          ],
          max_tokens: 800,
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        // After the chatbot response, ask if the user wants to continue with the current topic.
        setConversation(prev => [...prev, basicMessages.askNewQuestonCheck]);
      } catch (error) {
        console.error('Failed to fetch response:', error);
        setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
      }
    
      // Reset user input after sending
      setUserInput('');
      }
    
    setUserInput('');

  };
  }

    if (isLoading) {
      console.log("CHATBOT IS LOADING")
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    
    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
        >
            <ScrollView 
              style={styles.conversationContainer}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                 {conversation.map((text, index) => (
                <Message key={index} text={text} isUser={text.startsWith("You:")}/>
            ))}
            </ScrollView>

            {showTopics && (
            <View style={styles.topicContainer}>
                {["Spendings", "Budgets", "Goals", "Incomes", "Subscriptions", "Bills", "Loans", "Cryptos", "Stocks"].map((topic) => (
                    <TouchableOpacity
                        key={topic}
                        style={styles.topicButton}
                        onPress={() => handleTopicSelection(topic)}
                    >
                        <Text style={styles.topicText}>{topic}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            )}

            <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, showTopics && styles.inputDisabled]} // Apply the disabled style conditionally
                onChangeText={setUserInput}
                value={userInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#999"
                returnKeyType="send"
                onSubmitEditing={handleSend}
                editable={!showTopics} // Disable input when topics are visible
            />

            <TouchableOpacity 
                style={styles.sendButton} 
                onPress={handleSend}
                disabled={!userInput.trim()} // Disable if input is empty or topics are visible
            >
                <Icon name="send" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between', // Ensures input area stays visible
    },
    conversationContainer: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        flex: 1, // TextInput will take up as much space as possible, pushing the button to the end
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: 5
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 8,
      },
    userContainer: {
        alignItems: 'flex-end',
        marginRight: 10,
        marginLeft: 50,
    },
    chatContainer: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 50,
    },
    userMessage: {
        color: '#fff',
        backgroundColor: '#35BA52',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    chatMessage: {
        color: '#000',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    inputDisabled: {
      backgroundColor: '#f0f0f0', // or any color that indicates it's disabled
      color: '#999', // optional: change text color to indicate it's disabled
    },
    sendButton: {
        height: 40, // Match height of TextInput
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#35BA52',
        justifyContent: 'center', // Center the icon vertically
        paddingHorizontal: 12, // You can adjust padding to adjust the size of the button
        marginBottom: 6
      },
      sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      topicContainer: {
        flexDirection: 'row', // Align items in a row
        flexWrap: 'wrap', // Allow items to wrap to the next line
        justifyContent: 'center', // Center items in the container
        // padding: 4, // Add padding around the container
        marginBottom: 3,

      },
      topicButton: {
        backgroundColor: '#4CAF50', // Green background
        paddingVertical: 8, // Vertical padding
        paddingHorizontal: 7, // Horizontal padding
        height: 40,
        margin: 4, // Margin around the buttons
        borderRadius: 10, // Rounded corners
        // Adding flex basis for equal width & margins for three buttons per row
        flexBasis: '30%', 
        justifyContent: 'center', // Center text horizontally in button
        alignItems: 'center', // Center text vertically in button
      },
      topicText: {
        color: '#fff', // White text color
        fontSize: 14, // Font size
      },
});


export default Chatbot;
