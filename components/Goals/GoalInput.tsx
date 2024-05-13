import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, Platform, View, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { languages } from '../../commonConstants/sharedConstants';
import { GoalInputStyles } from './GoalComponentStyles';
import { GoalInputProps } from './GoalComponentTypes';

const GoalInput: React.FC<GoalInputProps> = ({ onAddGoal, initialGoal, selectedLanguage }) => {
  const [goalName, setGoalName] = useState('');
  const [goalTotalAmount, setGoalTotalAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const valueInputRef = useRef<TextInput>(null);

  const addOrUpdateGoalsHandler = () => {
    if (!goalName || !goalTotalAmount) {
      console.warn('Please fill in all fields');
      return;
    }

    const goalsData: any = {
      Name: goalName,
      Total_Ammount: parseFloat(goalTotalAmount),
      Date: selectedDate,
    };

    if (initialGoal) {
      goalsData.id = initialGoal.id;
    }

    onAddGoal(goalsData);

    setGoalName('');
    setGoalTotalAmount('');
  };

  useEffect(() => {
    const isValidDate = initialGoal && initialGoal.Date && !isNaN(initialGoal.Date.toDate());

    if (initialGoal) {
      setGoalName(initialGoal.Name || '');
      setGoalTotalAmount(initialGoal && initialGoal.Total_Ammount ? initialGoal.Total_Ammount.toString() : '');
      setSelectedDate(isValidDate ? new Date(initialGoal.Date.toDate()) : new Date());

    }
  }, [initialGoal]);


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={GoalInputStyles.modalContainer}>
        <Text style={GoalInputStyles.modalTitle}>
          {initialGoal ? languages[selectedLanguage].editSaving : languages[selectedLanguage].newSaving}

          </Text>

        <View style={GoalInputStyles.inputWrapper}>
          <Text style={GoalInputStyles.label}>{languages[selectedLanguage].goalName}</Text>
          <TextInput
            placeholder={languages[selectedLanguage].enterGoalName}
            style={GoalInputStyles.input}
            value={goalName}
            onChangeText={(text) => setGoalName(text)}
          />
        </View>

        <View style={GoalInputStyles.inputWrapper}>
          <Text style={GoalInputStyles.label}>{languages[selectedLanguage].totalAmmount}</Text>
          <TextInput
            placeholder={languages[selectedLanguage].enterGoalAmmount}
            style={GoalInputStyles.input}
            keyboardType="numeric"
            value={goalTotalAmount}
            onChangeText={(text) => setGoalTotalAmount(text)}
          />
        </View>

        <View style={GoalInputStyles.inputWrapper}>
          <Text style={GoalInputStyles.label}>{languages[selectedLanguage].selectDate}</Text>
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
              <Text>{selectedDate.toDateString()}</Text>
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

        <Button title={initialGoal ? languages[selectedLanguage].updateGoal : languages[selectedLanguage].create} onPress={addOrUpdateGoalsHandler} color="green" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GoalInput;
