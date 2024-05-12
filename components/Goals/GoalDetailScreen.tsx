import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, addDoc, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { GoalDetailStyles } from './GoalComponentStyles';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params;
  const [amountToAdd, setAmountToAdd] = useState('');
  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;

  const addFundsToGoal = async () => {
    if (!amountToAdd) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }
  
    const amountToAddNumber = parseFloat(amountToAdd);
    if (isNaN(amountToAddNumber) || amountToAddNumber <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive number.");
      return;
    }
  
    const updatedAmount = parseFloat(goal.Current_Ammount) + amountToAddNumber;
  
    if (updatedAmount > goal.Total_Ammount) {
      Alert.alert("Exceeds goal", "The amount exceeds the goal limit.");
      return;
    }
  
    const batch = writeBatch(db);
  
    try {
      const goalFundsRef = collection(db, 'goalFunds');
      const newFundDocRef = doc(goalFundsRef);
      batch.set(newFundDocRef, {
        userId: userId,
        goalId: goal.id,
        amountAdded: amountToAddNumber,
        dateAdded: Timestamp.now(),
      });
  
      const goalRef = doc(db, 'goals', goal.id);
      batch.update(goalRef, {
        Current_Ammount: updatedAmount
      });
  
      await batch.commit();
  
      Alert.alert("Success", "Funds have been added to your goal.");
      navigation.goBack(); 
    } catch (error) {
      console.error("Error adding funds to goal:", error);
      Alert.alert("Error", "There was an error adding funds to the goal.");
    }
  };
  

  return (
    <View style={GoalDetailStyles.container}>
      <Text style={GoalDetailStyles.title}>{goal.Name}</Text>
      <Text>Current Amount: ${goal.Current_Ammount}</Text>
      <Text>Total Amount: ${goal.Total_Ammount}</Text>
      <TextInput 
        style={GoalDetailStyles.input} 
        value={amountToAdd} 
        onChangeText={setAmountToAdd} 
        placeholder="Enter amount to add" 
        keyboardType="numeric" 
      />
      <Button title="Add Funds" onPress={addFundsToGoal} />
    </View>
  );
};

export default GoalDetailScreen;
