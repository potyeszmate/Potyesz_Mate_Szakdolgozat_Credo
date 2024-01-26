/* eslint-disable react/prop-types */
// GoalInput.js
import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Button, StyleSheet, Text, Platform, View,Keyboard,TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const GoalInput = ({ onAddGoal, initialGoal }) => {
  // const [goalCategory, setGoalCategory] = useState('');
  const [goalName, setGoalName] = useState('');
  // const [goalCurrentAmount, setGoalCurrentAmount] = useState('');
  const [goalTotalAmount, setGoalTotalAmount] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const valueInputRef = useRef(null);

  
  useEffect(() => {
    const isValidDate = initialGoal && initialGoal.Date && !isNaN(initialGoal.Date.toDate());
  
    // If initialTransaction is provided, populate fields with its data
    if (initialGoal) {
      console.log("In initial goal set")
      setGoalName(initialGoal.Name || '');
      setGoalTotalAmount(initialGoal && initialGoal.Total_Ammount ? initialGoal.Total_Ammount.toString() : '');
      setSelectedDate(isValidDate ? new Date(initialGoal.Date.toDate()) : new Date());
    }
  }, [initialGoal]);
  

  const addOrUpdateGoalsHandler = async () => {
    if (!goalName || !goalTotalAmount) {
      console.warn('Please fill in all fields');
      return;
    }

    
    console.log("goalName: ", goalName);
    console.log("goalTotalAmount: ", goalTotalAmount);

    const goalsData = {
      Name: goalName,
      Total_Ammount: parseFloat(goalTotalAmount),
      Date: selectedDate,
    };

    console.log("goalsData: ", goalsData)


    if (initialGoal) {
      console.log("Edit mode")
      // If it's an existing transaction, add id to the transactionData
      goalsData.id = initialGoal.id;
    }

  

    // Call the parent handler
    onAddGoal(goalsData);

    // Clear the input fields
    // setGoalCategory('');
    setGoalName('');
    // setGoalCurrentAmount('');
    setGoalTotalAmount('');
    // setSelectedDate(new Date());
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

    <View style={styles.modalContainer}>

    <Text style={styles.modalTitle}>{initialGoal ? 'Edit Goal' : 'New Goal'}</Text>

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
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          placeholder="Enter total amount"
          style={styles.input}
          keyboardType="numeric"
          value={goalTotalAmount}
          onChangeText={(text) => setGoalTotalAmount(text)}
        />
      </View>

      <View style={styles.inputWrapper}>
          <Text style={styles.label}>Select date</Text>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => setSelectedDate(date || selectedDate)}
              style={{ width: '100%' }}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>
          )}
          {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                setSelectedDate(date || selectedDate);
              }}
            />
          )}
        </View>

      {/* <Button title="Add Goal" onPress={addGoalHandler} color="blue" /> */}
      <Button title={initialGoal ? 'Update goal' : 'Add goal'} onPress={addOrUpdateGoalsHandler} color="blue" />

    </View>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
    marginTop: -50
    // marginTop: Platform.OS === 'ios' && showDatePicker ? -60 : 0,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
