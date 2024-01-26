/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const providers = [
  { label: 'Select a provider', value: null },
  { label: 'twitter', value: 2 },
  { label: 'youtube', value: 3 },
  { label: 'spotify', value: 4 },
  { label: 'wordpress', value: 5 },
  { label: 'pinterest', value: 6 },
  { label: 'figma', value: 7 },
  { label: 'behance', value: 8 },
  { label: 'apple', value: 9 },
  { label: 'google', value: 10 },
  { label: 'github', value: 11 },
  { label: 'discord', value: 12 },
  { label: 'xbox', value: 13 },
  { label: 'stripe', value: 14 },
];

const RecurringTransactionInput = ({ onAddRecurringTransaction, initialRecurringTransaction }) => {
  const [recurringTransactionName, setRecurringTransactionName] = useState('');
  const [recurringTransactionValue, setRecurringTransactionValue] = useState('');

  const [selectedProvider, setSelectedProvider] = useState(1);
  const [activeTab, setActiveTab] = useState('Monthly');

  const [openProvider, setOpenProvider] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const valueInputRef = useRef(null);

  
  useEffect(() => {
    const isValidDate = initialRecurringTransaction && initialRecurringTransaction.Date && !isNaN(initialRecurringTransaction.Date.toDate());
  
    if (initialRecurringTransaction) {
      console.log("WE ARE EDITING RECURRINGS ")

      console.log("Edited Recurring category: ", initialRecurringTransaction.name)
      console.log("Edited Recurring category: ", initialRecurringTransaction.category)
      console.log("Edited Recurring category: ", initialRecurringTransaction.value)
      console.log("Edited Recurring category: ", initialRecurringTransaction.Date)
      console.log("Edited Recurring category: ", initialRecurringTransaction.Usage_frequency)


      setRecurringTransactionName(initialRecurringTransaction.name || '');
      setSelectedProvider(providers.findIndex((prov) => prov.label === initialRecurringTransaction.name) + 1);
      setRecurringTransactionValue(initialRecurringTransaction && initialRecurringTransaction.value ? initialRecurringTransaction.value.toString() : '');

      setSelectedDate(isValidDate ? new Date(initialRecurringTransaction.Date.toDate()) : new Date());  
      setActiveTab(initialRecurringTransaction.Usage_frequency || 'Monthly');
    }
  }, [initialRecurringTransaction]);
  
  const addOrUpdateRecurringTransactionHandler = () => {
    if (!recurringTransactionValue || selectedProvider === null || selectedProvider === 1 || !activeTab) {
      console.warn('Please fill in all fields');
      return;
    }
  
    const categoryToUse = activeTab;
  
    const selectedProviderLabel = providers[selectedProvider - 1].label;
  
    const recurringTransactionData = {
      name: selectedProviderLabel,
      category: categoryToUse,
      value: parseFloat(recurringTransactionValue),
      Date: selectedDate,
      Usage_frequency: activeTab,
      Acceptance: '',
    };
  
    if (initialRecurringTransaction && initialRecurringTransaction.id) {
      // If it's an existing transaction, add id to the transactionData
      recurringTransactionData.id = initialRecurringTransaction.id;
    }
  
    onAddRecurringTransaction(recurringTransactionData);
  
    setRecurringTransactionName('');
    setRecurringTransactionValue('');
    setSelectedProvider(1);
    setActiveTab('Monthly');
    setSelectedDate(new Date());
  };
  

  useEffect(() => {
    console.log('Current Category:', activeTab);
  }, [activeTab]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.modalContainer}>
          {openProvider === true && (
            <View style={styles.debug}>
            </View>
          )}

        <Text style={styles.modalTitle}>{initialRecurringTransaction ? 'Edit Subscription' : 'New Subscription'}</Text>


        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Weekly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Weekly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Weekly' && styles.activeTabButtonText]}>Weekly</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Monthly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Monthly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Monthly' && styles.activeTabButtonText]}>Monthly</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Yearly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Yearly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Yearly' && styles.activeTabButtonText]}>Yearly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Subscription value in dollar</Text>
          <TextInput
            ref={valueInputRef}
            placeholder="Enter transaction amount"
            style={styles.input}
            keyboardType="numeric"
            value={recurringTransactionValue}
            onChangeText={(text) => setRecurringTransactionValue(text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Select provider</Text>
          <DropDownPicker
            open={openProvider}
            value={selectedProvider}
            items={providers}
            setOpen={setOpenProvider}
            setValue={(value) => {
              setSelectedProvider(value);
              setOpenProvider(false);
            }}
            setItems={() => {}}
            style={styles.pickerContainer}
            containerStyle={styles.pickerContainer}
            placeholder="Select a provider"
            dropDownStyle={styles.dropDownStyle}
            placeholderValue={null}
          />
          
        </View>
        
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
          <Button style={styles.addButton} title={initialRecurringTransaction ? 'Update subscription' : 'Add subscription'} onPress={addOrUpdateRecurringTransactionHandler} color="#35BA52" />

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
  closeButton: {
    color: '#35BA52',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  activeTabButton: {
    backgroundColor: '#1A1A2C',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  dateText: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  debug: {
    marginTop: -240
  },
});

export default RecurringTransactionInput;
