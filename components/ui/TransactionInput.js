/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const categories = [
  { label: 'Select a category', value: null },
  { label: 'Entertainment', value: 2 },
  { label: 'Grocieries', value: 3 },
  { label: 'UtilityCosts', value: 4 },
  { label: 'Shopping', value: 5 },
  { label: 'Food', value: 6 },
  { label: 'Housing', value: 7 },
  { label: 'Transport', value: 8 },
];

const TransactionInput = ({ onAddTransaction, initialTransaction }) => {
  const [transactionName, setTransactionName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [transactionValue, setTransactionValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);

  const valueInputRef = useRef(null);

  useEffect(() => {
    const isValidDate = initialTransaction && initialTransaction.date && !isNaN(initialTransaction.date.toDate());

    if (initialTransaction) {
      console.log("Edited category: ", initialTransaction.category)

      setTransactionName(initialTransaction.name || '');
      setSelectedCategory(categories.findIndex((cat) => cat.label === initialTransaction.category) + 1);
      setTransactionValue(initialTransaction.value.toString() || '');
      setSelectedDate(isValidDate ? new Date(initialTransaction.date.toDate()) : new Date());
    }
  }, [initialTransaction]);

  const addOrUpdateTransactionHandler = () => {
    if (!transactionName || !selectedCategory || selectedCategory === 1 || !transactionValue) {
      console.warn('Please fill in all fields');
      return;
    }

    const selectedCategoryLabel = categories[selectedCategory - 1].label;

    const transactionData = {
      name: transactionName,
      category: selectedCategoryLabel,
      value: parseFloat(transactionValue),
      date: selectedDate,
    };

    if (initialTransaction) {
      // If it's an existing transaction, add id to the transactionData
      transactionData.id = initialTransaction.id;
    }

    onAddTransaction(transactionData);

    // Clear fields after adding/updating
    setTransactionName('');
    setSelectedCategory(1);
    setTransactionValue('');
    setSelectedDate(new Date());
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.modalContainer}>
        {/* Your existing components */}
        {/* ... */}
        {openProvider === true && (
            <View style={styles.debug}>
            </View>
          )}

        <Text style={styles.modalTitle}>{initialTransaction ? 'Edit Transaction' : 'New Transaction'}</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Select a category</Text>
          <DropDownPicker
            open={openProvider}
            value={selectedCategory}
            items={categories}
            setOpen={setOpenProvider}
            setValue={(value) => {
              setSelectedCategory(value);
              setOpenProvider(false);
            }}
            setItems={() => {}}
            style={styles.pickerContainer}
            containerStyle={styles.pickerContainer}
            placeholder="Select a category"
            dropDownStyle={styles.dropDownStyle}
            placeholderValue={null}
          />
        </View>

        {openProvider === false && (

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Value</Text>
          <TextInput
            placeholder="Enter value"
            style={styles.input}
            keyboardType="numeric"
            value={transactionValue}
            onChangeText={(text) => setTransactionValue(text)}
          />
        </View>

        )}
        {openProvider === false && (

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Transaction Name</Text>
          <TextInput
            placeholder="Enter name"
            style={styles.input}
            value={transactionName}
            onChangeText={(text) => setTransactionName(text)}
          />
        </View>
        )}

        {openProvider === false && (

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
        )}
        {openProvider === false && (

        <Button title={initialTransaction ? 'Update Transaction' : 'Add Transaction'} onPress={addOrUpdateTransactionHandler} color="blue" />
        )}

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
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
    marginTop: -60
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
  },
  debug: {
    marginTop: -272.5
  },

});

export default TransactionInput;
