import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, addDoc, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";

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
  
    // Start a batched write to ensure both operations succeed or fail together
    const batch = writeBatch(db);
  
    try {
      // Record the fund addition in goalFunds
      const goalFundsRef = collection(db, 'goalFunds');
      const newFundDocRef = doc(goalFundsRef);
      batch.set(newFundDocRef, {
        userId: userId,
        goalId: goal.id,
        amountAdded: amountToAddNumber,
        dateAdded: Timestamp.now(),
      });
  
      // Update the goal's Current_Ammount
      const goalRef = doc(db, 'goals', goal.id);
      batch.update(goalRef, {
        Current_Ammount: updatedAmount
      });
  
      // Commit the batch
      await batch.commit();
  
      Alert.alert("Success", "Funds have been added to your goal.");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error adding funds to goal:", error);
      Alert.alert("Error", "There was an error adding funds to the goal.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{goal.Name}</Text>
      <Text>Current Amount: ${goal.Current_Ammount}</Text>
      <Text>Total Amount: ${goal.Total_Ammount}</Text>
      <TextInput 
        style={styles.input} 
        value={amountToAdd} 
        onChangeText={setAmountToAdd} 
        placeholder="Enter amount to add" 
        keyboardType="numeric" 
      />
      <Button title="Add Funds" onPress={addFundsToGoal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default GoalDetailScreen;
