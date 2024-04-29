/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { TextInput, Button, StyleSheet,TouchableWithoutFeedback,Keyboard, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


const allCategories: any = [
  { label: 'Select a category', value: null },
  { label: 'Entertainment', value: 2 },
  { label: 'Grocieries', value: 3 },
  { label: 'UtilityCosts', value: 4 },
  { label: 'Shopping', value: 5 },
  { label: 'Food', value: 6 },
  { label: 'Housing', value: 7 },
  { label: 'Transport', value: 8 },
];

const BudgetInput: React.FC<any> = ({ onAddBudget, existingCategories, initialBudget }) => {
  const [budgetTotalAmount, setBudgetTotalAmount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [openCategory, setopenCategory] = useState<boolean>(false);
  const [filteredCategories, setFilteredCategories] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    
    const availableCategories = allCategories.filter(
      (category) => !existingCategories.includes(category.label)
    );
    setFilteredCategories(availableCategories);
  }, [existingCategories]);
  
  useEffect(() => {
    if (initialBudget) {
  
      setSelectedCategory(allCategories.findIndex((cat: any) => cat.label === initialBudget.Category) + 1);
      setBudgetTotalAmount(initialBudget && initialBudget.Total_ammount ? initialBudget.Total_ammount.toString() : '');
    }
  }, [initialBudget]);

  const addOrUpdateBudgetHandler = () => {
    if (!budgetTotalAmount || !selectedCategory || selectedCategory === 1) {
      console.warn('Please fill in all fields');
      return;
    }
  
  
    const selectedCategoryLabel = filteredCategories.find((category) => category.value === selectedCategory)?.label;
  
    const budgetData: any = {
      Category: selectedCategoryLabel || '',
      Total_ammount: parseFloat(budgetTotalAmount || '0'),
    };

  
    if (initialBudget) {
      budgetData.id = initialBudget.id;
    }
  
  
    onAddBudget(budgetData); 
  
    setBudgetTotalAmount('');
    setSelectedCategory(1);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{initialBudget ? 'Edit budget' : 'New Budget'}</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Total Amount</Text>
          <TextInput
            placeholder="Enter total amount"
            style={styles.input}
            keyboardType="numeric"
            value={budgetTotalAmount || ''}
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
            />
          </View>
        ) : (
          <Text>There are no free categories left to add budgets with</Text>
        )}

        {filteredCategories.length > 1 && !openCategory && (
          <View style={styles.addButton}>
          <Button
            title={initialBudget ? 'Update Budget' : 'Add Budget'}
            onPress={addOrUpdateBudgetHandler}
            color="#FFFFFF"
          />
        </View>
        
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
  addButton: {
    backgroundColor: '#35BA52',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: -90
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
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
});

export default BudgetInput;