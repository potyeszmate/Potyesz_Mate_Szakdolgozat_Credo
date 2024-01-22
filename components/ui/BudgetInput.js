import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';

const BudgetInput = ({ onAddBudget }) => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetTotalAmount, setBudgetTotalAmount] = useState('');
  const [budgetSpentAmount, setBudgetSpentAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [durationName, setDurationNamet] = useState('');

  const addBudgetHandler = async () => {
    if (!budgetName || !budgetTotalAmount || !budgetSpentAmount || !accountName || !durationName) {
      console.warn('Please fill in all fields');
      return;
    }
  
    const newBudget = {
      Category: budgetName, // Assuming Category is the name field in the Budget component
      Total_ammount: parseFloat(budgetTotalAmount),
      Spent_ammount: parseFloat(budgetSpentAmount),
      Account: accountName,
      Duration: durationName,
    };
  
    // Call the parent handler
    onAddBudget(newBudget);
  
    // Clear the input fields
    setBudgetName('');
    setBudgetTotalAmount('');
    setBudgetSpentAmount('');
    setAccountName('');
    setDurationNamet('');
  };
  
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Budget Name</Text>
        <TextInput
          placeholder="Enter budget name"
          style={styles.input}
          value={budgetName}
          onChangeText={(text) => setBudgetName(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Account name</Text>
        <TextInput
          placeholder="Enter account name"
          style={styles.input}
          value={accountName}
          onChangeText={(text) => setAccountName(text)}
        />
      </View>


      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Account duration</Text>
        <TextInput
          placeholder="Enter duration"
          style={styles.input}
          value={durationName}
          onChangeText={(text) => setDurationNamet(text)}
        />
      </View>


      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          placeholder="Enter total amount"
          style={styles.input}
          keyboardType="numeric"
          value={budgetTotalAmount}
          onChangeText={(text) => setBudgetTotalAmount(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Spent ammount</Text>
        <TextInput
          placeholder="Enter spent amount"
          style={styles.input}
          keyboardType="numeric"
          value={budgetSpentAmount}
          onChangeText={(text) => setBudgetSpentAmount(text)}
        />
      </View>

      <Button title="Add Budget" onPress={addBudgetHandler} color="blue" />
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
    padding: 20,
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
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default BudgetInput;
