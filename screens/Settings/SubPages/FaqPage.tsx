import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQPage = () => {
  const [expanded, setExpanded] = useState({});

  const faqData = [
    {
      question: 'What is the purpose of this app?',
      answer: 'This app helps users manage their financial budgets effectively by providing features such as expense tracking, budget setting, goal setting, and more.',
    },
    {
      question: 'How can I track my expenses?',
      answer: 'You can track your expenses by adding transactions to the app. Simply navigate to the Transactions page and click on the "+" button to add a new transaction.',
    },
    {
      question: 'Can I set a monthly budget?',
      answer: 'Yes, you can set a monthly budget by navigating to the Budgets page and creating a new budget. You can specify the budget amount and category for each budget.',
    },
    {
      question: 'Are my financial data secure?',
      answer: 'Yes, your financial data is encrypted and securely stored on our servers. We use industry-standard security measures to protect your information.',
    },
  ];

  const toggleAccordion = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      {faqData.map((faq, index) => (
        <TouchableOpacity key={index} onPress={() => toggleAccordion(index)} style={styles.faqItem}>
          <View style={styles.questionContainer}>
            <Ionicons name="help-circle-outline" size={24} color="#333" style={styles.questionIcon} />
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons
              name={expanded[index] ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="#333"
            />
          </View>
          {expanded[index] && <Text style={styles.answer}>{faq.answer}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionIcon: {
    marginRight: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  answer: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default FAQPage;
