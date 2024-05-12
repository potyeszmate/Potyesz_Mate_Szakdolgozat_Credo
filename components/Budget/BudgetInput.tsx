import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { TextInput, Button, StyleSheet,TouchableWithoutFeedback,Keyboard, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { BudgetInputAllCategories } from './BudgetComponentConstants';
import { BudgetInputStyles } from './BudgetComponentStyles';

const BudgetInput: React.FC<any> = ({ onAddBudget, existingCategories, initialBudget }) => {
  const [budgetTotalAmount, setBudgetTotalAmount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [openCategory, setopenCategory] = useState<boolean>(false);
  const [filteredCategories, setFilteredCategories] = useState<{ label: string; value: number }[]>([]);

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

  useEffect(() => {
    
    const availableCategories = BudgetInputAllCategories.filter(
      (category) => !existingCategories.includes(category.label)
    );
    setFilteredCategories(availableCategories);
  }, [existingCategories]);
  
  useEffect(() => {
    if (initialBudget) {
  
      setSelectedCategory(BudgetInputAllCategories.findIndex((cat: any) => cat.label === initialBudget.Category) + 1);
      setBudgetTotalAmount(initialBudget && initialBudget.Total_ammount ? initialBudget.Total_ammount.toString() : '');
    }
  }, [initialBudget]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={BudgetInputStyles.modalContainer}>
        <Text style={BudgetInputStyles.modalTitle}>{initialBudget ? 'Edit budget' : 'New Budget'}</Text>

        <View style={BudgetInputStyles.inputWrapper}>
          <Text style={BudgetInputStyles.label}>Total Amount</Text>
          <TextInput
            placeholder="Enter total amount"
            style={BudgetInputStyles.input}
            keyboardType="numeric"
            value={budgetTotalAmount || ''}
            onChangeText={(text) => setBudgetTotalAmount(text)}
          />
        </View>

        {filteredCategories.length > 0 ? (
          <View style={BudgetInputStyles.inputWrapper}>
            <Text style={BudgetInputStyles.label}>Select Category</Text>
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
              style={BudgetInputStyles.pickerContainer}
              containerStyle={BudgetInputStyles.pickerContainer}
              placeholder="Select a category"
            />
          </View>
        ) : (
          <Text>There are no free categories left to add budgets with</Text>
        )}

        {filteredCategories.length > 1 && !openCategory && (
          <View style={BudgetInputStyles.addButton}>
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

export default BudgetInput;