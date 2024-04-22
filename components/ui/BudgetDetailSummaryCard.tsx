import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { Feather } from '@expo/vector-icons';

const BudgetDetailsSummaryCard = ({ currentMonth, totalAmount, spentPercentage, spentAmount, remainingAmount, onEditPress, conversionRate, symbol }) => {
  // Determine the color based on spent percentage
  const getColor = (percentage) => {
    if (percentage > 100) return '#FF6347'; // Red
    if (percentage > 50) return '#FFA500'; // Orange
    return '#32CD32'; // Green
  };

  return (
    <View style={{ marginVertical: 16, marginHorizontal: 16, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{currentMonth}</Text>
        <TouchableOpacity onPress={onEditPress} style={{ width: 20, height: 20 }}>
          <Feather name="edit" size={20} color="#1A1A2C" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {symbol === 'HUF' ? 
            Math.round(parseFloat(totalAmount) * conversionRate) :
            (parseFloat(totalAmount) * conversionRate).toFixed(2)
          }{symbol}
          </Text>
        <View style={{ padding: 4, backgroundColor: '#F3F4F7', borderRadius: 5 }}>
          <Text style={{ color: getColor(spentPercentage), fontSize: 16, fontWeight: 'bold' }}>{spentPercentage.toFixed(2)}% Spent</Text>
        </View>
      </View>

      <View style={{ marginVertical: 4 }}>
        <Progress.Bar
          progress={spentPercentage / 100}
          width={320} // Increased width
          height={20} // Increased height
          color={getColor(spentPercentage)}
          borderRadius={10}
          borderColor='#FFFFFF'
          unfilledColor='#F3F4F7'
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Spent:</Text>
          <Text style={{ fontSize: 16 }}>
          {symbol === 'HUF' ? 
            Math.round(parseFloat(spentAmount) * conversionRate) :
            (parseFloat(spentAmount) * conversionRate).toFixed(2)
          }{symbol}
            </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Remaining:</Text>
          <Text style={{ fontSize: 16 }}>
          {symbol === 'HUF' ? 
            Math.round(parseFloat(remainingAmount) * conversionRate) :
            (parseFloat(remainingAmount) * conversionRate).toFixed(2)
          }{symbol}</Text>
        </View>
      </View>
    </View>
  );
};


export default BudgetDetailsSummaryCard;
