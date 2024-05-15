import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';
import { GoalCardStyles } from './GoalComponentStyles';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const GoalCard: React.FC<any> = ({ goal, onDelete, onEdit, selectedLanguage }) => {
  const navigation = useNavigation();
  const [monthlyAdded, setMonthlyAdded] = useState(0);

  let progressValue = 0; 
  let remainingAmount = 0;

  const fetchMonthlyAdded = async () => {
    console.log("!!!!!!!!!!!fetchMonthlyAdded!!!!!!!!!!!!!4")
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const q = query(
      collection(db, "goalFunds"),
      where("goalId", "==", goal.id),
      where("dateAdded", ">=", Timestamp.fromDate(startOfMonth)),
      where("dateAdded", "<=", Timestamp.fromDate(endOfMonth))
    );

    try {
      const querySnapshot = await getDocs(q);
      let totalAdded = 0;
      querySnapshot.forEach((doc) => {
        totalAdded += doc.data().amountAdded;
      });
      setMonthlyAdded(totalAdded);
    } catch (error) {
      console.error(`Error fetching funds for goal ${goal.id}:`, error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyAdded();
    }, [goal.id])
  );
   
  if (goal.Current_Ammount < 1 || goal.Current_Ammount == null || goal.Current_Ammount == undefined) {
    progressValue = 0;
    remainingAmount = goal.Total_Ammount;
    console.log("Progress Value in undefined:", progressValue);
  } else {
    console.log("Current_Ammount: ", goal.Current_Ammount);
    console.log("Total_Ammount: ", goal.Total_Ammount);

    progressValue = (goal.Current_Ammount && goal.Total_Ammount > 0) ? 
      goal.Current_Ammount / goal.Total_Ammount : 
      0; 

    remainingAmount = Number(goal.Total_Ammount - goal.Current_Ammount);

    console.log("Progress Value:", progressValue);
    console.log("remainingAmount Value:", remainingAmount);
  }

const isCompleted = progressValue >= 1;

console.log(progressValue); 

  return (
    // @ts-ignore
    <TouchableOpacity style={GoalCardStyles.cardContainer} onPress={() => navigation.navigate('Goal Detail', { goal })}>
      <View style={GoalCardStyles.rowContainer}>
        <Text style={GoalCardStyles.goalName}>{goal.Name}</Text>
        <View style={GoalCardStyles.iconContainer}>
          <TouchableOpacity onPress={() => onEdit(goal)}>
            <Feather name="edit" size={24} color="#1A1A2C" style={GoalCardStyles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(goal)}>
            <Feather name="trash-2" size={24} color="#FF5733" style={GoalCardStyles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={GoalCardStyles.progressBarContainer}>
        <View style={GoalCardStyles.rowContainer}>
          <Text style={[GoalCardStyles.amountTextCurrent, { color: '#1A1A2C' }]}>${goal.Current_Ammount}</Text>

          <View style={GoalCardStyles.rightPart}>
            <Text style={[GoalCardStyles.remainingAmount, { color: '#7E8086', marginRight: 4 }]}>${remainingAmount}</Text>
            <Text style={[GoalCardStyles.amountText, { color: '#7E8086', marginLeft: 4 }]}>{languages[selectedLanguage].leftOf}</Text>
            <Text style={[GoalCardStyles.amountTextTotal, { color: '#1A1A2C', marginLeft: 4 }]}>${goal.Total_Ammount}</Text>
          </View>
        </View>

        <View style={GoalCardStyles.progressBarWrapper}>
        <Progress.Bar
          progress={isNaN(progressValue) ? 0 : progressValue} 
          width={320}
          height={15}
          color={'#35BA52'}
          borderRadius={10}
          borderColor='#FFFFFF'
          unfilledColor='#F3F4F7'  
          />
        </View>

      </View>

      <View style={GoalCardStyles.monthlySpentRowContainer}>
        <Text style={[GoalCardStyles.amountTextCurrent, { color: '#35BA52' }]}>${monthlyAdded}</Text> 
        <Text style={[GoalCardStyles.remainingAmount, { color: '#7E8086', marginRight: 4 }]}>this month</Text> 
      </View>

      {isCompleted && (
          <View style={GoalCardStyles.completionBadge}>
            <Feather name="check-circle" size={24} color="#4CAF50" />
            <Text style={GoalCardStyles.completionText}>Completed</Text>
          </View>
        )}
    </TouchableOpacity>
  );
};

export default GoalCard;
