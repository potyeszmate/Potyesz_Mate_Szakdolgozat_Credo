import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';
import { GoalCardStyles } from './GoalComponentStyles';

const GoalCard: React.FC<any> = ({ goal, onDelete, onEdit, selectedLanguage }) => {
  const navigation = useNavigation();
  let progressValue = 0;
  let remainingAmount = 0;

  if (goal.Current_Ammount < 1 || goal.Current_Ammount == null || goal.Current_Ammount == undefined) {
    progressValue = 0;
    remainingAmount = goal.Total_Ammount;
  } else {
    progressValue = goal.Current_Ammount / goal.Total_Ammount;
    remainingAmount = goal.Total_Ammount - goal.Current_Ammount;
  }

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
          progress={progressValue}
          width={Math.round(Dimensions.get('window').width * 0.82)}
          height={15}
          color={'#35BA52'}
          borderRadius={10}
          borderColor='#FFFFFF'
          animationType='decay'   
          unfilledColor='#F3F4F7'  
          />
        </View>

      </View>

      <View style={GoalCardStyles.monthlySpentRowContainer}>
        <Text style={[GoalCardStyles.amountTextCurrent, { color: '#35BA52' }]}>$200</Text> 
        <Text style={[GoalCardStyles.remainingAmount, { color: '#7E8086', marginRight: 4 }]}>this month</Text> 
      </View>
    </TouchableOpacity>
  );
};

export default GoalCard;
