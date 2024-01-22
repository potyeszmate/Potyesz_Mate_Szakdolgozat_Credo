// GoalInput.js
import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const GoalInput = ({ onAddGoal }) => {
  const [goalCategory, setGoalCategory] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalCurrentAmount, setGoalCurrentAmount] = useState('');
  const [goalTotalAmount, setGoalTotalAmount] = useState('');


  const addGoalHandler = async () => {
    if (!goalCategory || !goalName || !goalCurrentAmount || !goalTotalAmount) {
      console.warn('Please fill in all fields');
      return;
    }


    // Call the parent handler
    onAddGoal({
      Category: goalCategory,
      Name: goalName,
      Current_Ammount: parseFloat(goalCurrentAmount),
      Total_Ammount: parseFloat(goalTotalAmount)
    });

    // Clear the input fields
    setGoalCategory('');
    setGoalName('');
    setGoalCurrentAmount('');
    setGoalTotalAmount('');
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Goal Category</Text>
        <TextInput
          placeholder="Enter goal category"
          style={styles.input}
          value={goalCategory}
          onChangeText={(text) => setGoalCategory(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          placeholder="Enter goal name"
          style={styles.input}
          value={goalName}
          onChangeText={(text) => setGoalName(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Current Amount</Text>
        <TextInput
          placeholder="Enter current amount"
          style={styles.input}
          keyboardType="numeric"
          value={goalCurrentAmount}
          onChangeText={(text) => setGoalCurrentAmount(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          placeholder="Enter total amount"
          style={styles.input}
          keyboardType="numeric"
          value={goalTotalAmount}
          onChangeText={(text) => setGoalTotalAmount(text)}
        />
      </View>

      <Button title="Add Goal" onPress={addGoalHandler} color="blue" />
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

export default GoalInput;
