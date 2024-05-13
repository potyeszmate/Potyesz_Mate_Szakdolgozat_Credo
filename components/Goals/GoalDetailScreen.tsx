import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, addDoc, Timestamp, writeBatch, doc, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { GoalDetailStyles } from './GoalComponentStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params;
  const [amountToAdd, setAmountToAdd] = useState('');
  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;
  const isCompleted = goal.Current_Ammount >= goal.Total_Ammount;

  const checkAndCompleteChallenge = async (addedAmount: number) => {
    console.log("In checkAndCompleteChallenge", addedAmount);
    
    const joinedChallengesQuery = query(
        collection(db, 'joinedChallenges'), 
        where('uid', '==', userId),
        where('name', '==', 'Savings Sprint'),
        where('isActive', '==', true)
    );
    const challengesSnapshot = await getDocs(joinedChallengesQuery);

    if (challengesSnapshot.empty) {
        console.log("No active 'Savings Sprint' challenge found.");
        return; 
    }

    const challengeDoc = challengesSnapshot.docs[0];
    const challenge = challengeDoc.data();
    const challengeEndDate = new Date(challenge.joinedDate.toDate().getTime() + challenge.durationInWeek * 7 * 24 * 60 * 60 * 1000);
    console.log("Challenge End Date:", challengeEndDate);

    if (challengeEndDate >= new Date() && addedAmount >= 300) {  
        await updateDoc(challengeDoc.ref, { isActive: false });

        // Query for points document based on userId
        const pointsQuery = query(collection(db, 'points'), where('uid', '==', userId));
        const pointsSnapshot = await getDocs(pointsQuery);

        if (!pointsSnapshot.empty) {
            const pointsDoc = pointsSnapshot.docs[0];
            const currentPoints = pointsDoc.data().score;
            const newPoints = currentPoints + 60;
            await updateDoc(pointsDoc.ref, { score: newPoints });
            console.log("Points updated: ", newPoints);
        } else {
            console.log("No points document found for user:", userId);
            const pointsRef = doc(collection(db, 'points'));
            await setDoc(pointsRef, { uid: userId, score: 60 }); // Initialize points if not present
            console.log("Points document created and initialized to 60 points.");
        }

        Alert.alert(
          " 🎉 Challenge Complete 🎉",
          "Congratulations! You've completed the Savings Sprint challenge and earned 60 points!",
          [
            {
              text: "OK",
              onPress: () => console.log("Challenge Completion Acknowledged"),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
    } else {
        console.log("Challenge criteria not met or challenge expired.");
    }
};

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
    console.log("Updated Amount:", updatedAmount);
  
    if (updatedAmount > goal.Total_Ammount) {
      const remainingAmount = goal.Total_Ammount - goal.Current_Ammount;
      Alert.alert(
        "Exceeds goal",
        "The amount exceeds the goal limit. Would you like to add just the remaining $" + remainingAmount + " to complete the goal?",
        [
          {
            text: "No",
            onPress: () => console.log("Addition cancelled"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => addRemainingAmount(remainingAmount)
          }
        ]
      );
      return;
    }
  
    // Proceed with adding funds if not exceeding the goal
    await addFunds(amountToAddNumber);
  };
  
  const addRemainingAmount = async (amount) => {
    await addFunds(amount);
    Alert.alert("Success", "The remaining funds have been added to your goal.");
    navigation.goBack();
  };
  
  const addFunds = async (amount) => {
    const batch = writeBatch(db);
  
    // Add fund to the goalFunds collection
    const goalFundsRef = collection(db, 'goalFunds');
    const newFundDocRef = doc(goalFundsRef);
    const updatedAmount = parseFloat(goal.Current_Ammount) + amount;
  
    batch.set(newFundDocRef, {
      userId: userId,
      goalId: goal.id,
      amountAdded: amount,
      dateAdded: Timestamp.now(),
    });
  
    // Update the current amount in the goal document
    const goalRef = doc(db, 'goals', goal.id);
    batch.update(goalRef, { Current_Ammount: updatedAmount });
  
    // Fetch and update the user's balance
    const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
    const balanceSnapshot = await getDocs(balanceQuery);
  
    if (!balanceSnapshot.empty) {
      const balanceDoc = balanceSnapshot.docs[0];  // Assuming one balance document per user
      const currentBalance = balanceDoc.data().balance;
      const newBalance = currentBalance - amount;  // Subtract the amount added to the goal from the balance
  
      console.log("Current Balance:", currentBalance);
      console.log("Amount to Subtract:", amount);
      console.log("Updated Balance:", newBalance);
  
      // Update the balance document within the same batch
      batch.update(balanceDoc.ref, { balance: newBalance });

      await checkAndCompleteChallenge(amount);

      await AsyncStorage.setItem('transactionsChanged', 'true');

    } else {
      console.error("No balance document found for user:", userId);
      Alert.alert("Error", "No balance document found.");
      return;  // Exit if no balance document is found
    }
  
    // Commit the batch
    try {
      await batch.commit();
      
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Funds have been added and balance updated.',
        visibilityTime: 2000
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error updating funds and balance:", error);
      Alert.alert("Error", "There was an error updating funds and balance.");
    }
  };
  

  return (
    <View style={GoalDetailStyles.container}>
      <View style={GoalDetailStyles.detailCard}>
        <Text style={GoalDetailStyles.title}>{goal.Name}</Text>
        <Text style={GoalDetailStyles.amountText}>Current Amount: ${goal.Current_Ammount}</Text>
        <Text style={GoalDetailStyles.amountText}>Total Amount: ${goal.Total_Ammount}</Text>
        
        {!isCompleted ? (
          <>
            <TextInput 
              style={GoalDetailStyles.input} 
              value={amountToAdd} 
              onChangeText={setAmountToAdd} 
              placeholder="Enter amount to add"
              keyboardType="numeric"
            />
            <TouchableOpacity style={GoalDetailStyles.button} onPress={addFundsToGoal}>
              <Text style={GoalDetailStyles.buttonText}>Add Funds</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={GoalDetailStyles.completedContainer}>
            <Text style={GoalDetailStyles.completedText}>Goal Completed! 🎉</Text>
          </View>
        )}
      </View>
    </View>
  );
};



export default GoalDetailScreen;
