import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Button, StyleSheet, Text, Platform, View, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

interface GoalInputProps {
  onAddGoal: (goalData: any) => void;
  initialGoal?: any;
  selectedLanguage: string
}

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const GoalInput: React.FC<GoalInputProps> = ({ onAddGoal, initialGoal, selectedLanguage }) => {
  const [goalName, setGoalName] = useState('');
  const [goalTotalAmount, setGoalTotalAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const valueInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const isValidDate = initialGoal && initialGoal.Date && !isNaN(initialGoal.Date.toDate());

    if (initialGoal) {
      setGoalName(initialGoal.Name || '');
      setGoalTotalAmount(initialGoal && initialGoal.Total_Ammount ? initialGoal.Total_Ammount.toString() : '');
      setSelectedDate(isValidDate ? new Date(initialGoal.Date.toDate()) : new Date());

    }
  }, [initialGoal]);

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {/* {initialGoal ? 'Edit Goal' : 'New Goal'} */}
          {initialGoal ? languages[selectedLanguage].editSaving : languages[selectedLanguage].newSaving}

          </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{languages[selectedLanguage].goalName}</Text>
          <TextInput
            placeholder={languages[selectedLanguage].enterGoalName}
            style={styles.input}
            value={goalName}
            onChangeText={(text) => setGoalName(text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{languages[selectedLanguage].totalAmmount}</Text>
          <TextInput
            placeholder={languages[selectedLanguage].enterGoalAmmount}
            style={styles.input}
            keyboardType="numeric"
            value={goalTotalAmount}
            onChangeText={(text) => setGoalTotalAmount(text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{languages[selectedLanguage].selectDate}</Text>
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

        <Button title={initialGoal ? languages[selectedLanguage].updateGoal : languages[selectedLanguage].create} onPress={addOrUpdateGoalsHandler} color="blue" />
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
