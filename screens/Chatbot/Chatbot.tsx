import React, { useContext, useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import OpenAI from 'openai'; // Adjust based on actual exported name
import prompts from '../../util/prompts';
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
    const [conversation, setConversation] = useState([prompts.initialGreeting]);
    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;
    const scrollViewRef = useRef();

    const fetchAndFormatTransactions = async () => {
        try {
          const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
          const querySnapshot = await getDocs(transactionsQuery);
          const transactions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate().toLocaleDateString(); // Convert Firestore Timestamp to readable date
            return `${date} - ${data.name} (${data.category}): $${data.value}`;
          });
          return transactions.join(", ");
        } catch (error) {
          console.error('Error fetching transactions:', error.message);
          return "Failed to fetch transactions.";
        }
      };

      
      const handleSend = async () => {
        if (!userInput.trim()) return

        setConversation(prev => [...prev, `You: ${userInput}`]);
        setUserInput('');

        const formattedTransactions = await fetchAndFormatTransactions();
        
        console.log('formattedTransactions in handleSend: ', formattedTransactions)
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant, skilled in finance management and transaction analysis." },
                    { role: "user", content: userInput },
                    { role: "system", content: `The user's recent transactions are: ${formattedTransactions}` }
                ],
                max_tokens: 150,
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setConversation(prev => [...prev, `Chatbot: ${response.data.choices[0].message.content.trim()}`]);
        } catch (error) {
            console.error('Failed to fetch response:', error);
            setConversation(prev => [...prev, `Chatbot: Sorry, I couldn't fetch the response.`]);
        }
    
        setUserInput('');
    };
    

    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}  // Adjust the value based on your header or navbar height
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
            <View style={styles.inputContainer}>

            <TextInput
                style={styles.input}
                onChangeText={setUserInput}
                value={userInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#999"
                returnKeyType="send"
                onSubmitEditing={handleSend} // Allows sending the message by pressing the return key on the keyboard
            />
            

            <TouchableOpacity 
                style={styles.sendButton} 
                onPress={handleSend}
                disabled={!userInput.trim()} // Disable if input is empty
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
    sendButton: {
        height: 40, // Match height of TextInput
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#35BA52',
        justifyContent: 'center', // Center the icon vertically
        paddingHorizontal: 12, // You can adjust padding to adjust the size of the button
      },
      sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
});


export default Chatbot;
