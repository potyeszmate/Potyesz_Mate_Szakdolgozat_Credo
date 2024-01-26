/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { TextInput, Button, StyleSheet,TouchableWithoutFeedback,Keyboard, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


const allCategories = [
  { label: 'Select a category', value: null },
  { label: 'Entertainment', value: 2 },
  { label: 'Grocieries', value: 3 },
  { label: 'UtilityCosts', value: 4 },
  { label: 'Shopping', value: 5 },
  { label: 'Food', value: 6 },
  { label: 'Housing', value: 7 },
  { label: 'Transport', value: 8 },
];

const BudgetInput = ({ onAddBudget, existingCategories, initialBudget }) => {
  const [budgetTotalAmount, setBudgetTotalAmount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [openCategory, setopenCategory] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const availableCategories = allCategories.filter(
      (category) => !existingCategories.includes(category.label)
    );
    setFilteredCategories(availableCategories);
  }, [existingCategories]);
  
  useEffect(() => {
    // If initialTransaction is provided, populate fields with its data
    if (initialBudget) {
      console.log("Edited category: ", initialBudget.Category)
      console.log("Edited totalAmount: ", initialBudget.Total_ammount)
  
      setSelectedCategory(allCategories.findIndex((cat) => cat.label === initialBudget.Category) + 1);
      setBudgetTotalAmount(initialBudget && initialBudget.Total_ammount ? initialBudget.Total_ammount.toString() : '');
    }
  }, [initialBudget]);
  
  

  const addOrUpdateBudgetHandler = () => {
    if (!budgetTotalAmount || !selectedCategory || selectedCategory === 1) {
      console.warn('Please fill in all fields');
      return;
    }
  
    console.log("budgetTotalAmount: ", budgetTotalAmount);
    console.log("selectedCategory: ", selectedCategory);
  
    const selectedCategoryLabel = filteredCategories.find((allCategories) => allCategories.value === selectedCategory)?.label;
  
    const budgetData = {
      Category: selectedCategoryLabel,
      Total_ammount: parseFloat(budgetTotalAmount),
    };

    console.log("budgetData: ", budgetData)
  
    if (initialBudget) {
      budgetData.id = initialBudget.id;
    }
  
    console.log("Budget data before atting: ", initialBudget);
  
    onAddBudget(budgetData); 
  
    setBudgetTotalAmount('');
    setSelectedCategory(1);
  };
  

  return (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.modalContainer}>
      {/* <Text style={styles.modalTitle}>New Subscription</Text> */}
      <Text style={styles.modalTitle}>{initialBudget ? 'Edit budget' : 'New Budget'}</Text>

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

      {filteredCategories.length > 0 ? (
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Select Category</Text>
          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={filteredCategories}
            setOpen={setopenCategory}
            setValue={(value) => {
              setSelectedCategory(value);
              setopenCategory(false);
            }}
            setItems={() => {}}
            style={styles.pickerContainer}
            containerStyle={styles.pickerContainer}
            placeholder="Select a category"
            dropDownStyle={styles.dropDownStyle}
            placeholderValue={null}
          />
        </View>
      ) : (
        <Text style={styles.noCategoryText}>There are no free categories left to add budgets with</Text>
      )}

      {filteredCategories.length > 1 && openCategory === false && (
        <Button
          style={styles.addButton}
          title={initialBudget ? 'Update Transaction' : 'Add Transaction'}
          onPress={addOrUpdateBudgetHandler}
          color="blue"
        />

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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
    paddingTop: 20
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: -40,
    textAlign: 'center',
    color: 'grey',
    // marginTop: Platform.OS === 'ios' && showDatePicker ? -60 : 0,
  },
});

export default BudgetInput;