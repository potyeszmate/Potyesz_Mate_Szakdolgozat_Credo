import React, { useState } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { Card } from 'react-native-elements';


const RecurringTransactionInput = ({ onAddRecurringTransaction }) => {
  const [recurringTransactionName, setRecurringTransactionName] = useState('');
  const [recurringTransactionCategory, setRecurringTransactionCategory] = useState('');
  const [recurringTransactionValue, setRecurringTransactionValue] = useState('');

  const addTransactionHandler = () => {
    if (!recurringTransactionName || !recurringTransactionCategory || !recurringTransactionValue) {
      console.warn('Please fill in all fields');
      return;
    }

    onAddRecurringTransaction({
      name: recurringTransactionName,
      category: recurringTransactionCategory,
      value: parseFloat(recurringTransactionValue),
      Acceptance: '',
      Usage_frequency: '',

    });

    setRecurringTransactionName('');
    setRecurringTransactionCategory('');
    setRecurringTransactionValue('');
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter name"
          style={styles.input}
          value={recurringTransactionName}
          onChangeText={(text) => setRecurringTransactionName(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          placeholder="Enter category"
          style={styles.input}
          value={recurringTransactionCategory}
          onChangeText={(text) => setRecurringTransactionCategory(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Value</Text>
        <TextInput
          placeholder="Enter value"
          style={styles.input}
          keyboardType="numeric"
          value={recurringTransactionValue}
          onChangeText={(text) => setRecurringTransactionValue(text)}
        />
      </View>

      <Button title="Add Transaction" onPress={addTransactionHandler} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    marginVertical: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '70%',

  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 10, // Adjusted padding
    paddingHorizontal: 10, // Adjusted padding
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
  },
});

export default RecurringTransactionInput;
