import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { languages } from '../../commonConstants/sharedConstants';
import { MonthlyIncomeStyles } from './BalanceComponentStyles';

const MonthlyIncome = ({ income, updateIncome, selectedLanguage, symbol, conversionRate, currency}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newIncome, setNewIncome] = useState('');
  const [textInputFocused, setTextInputFocused] = useState(false);

  const formatIncome = (income) => {
    return symbol === 'HUF'
      ? Math.round(parseFloat(income) * conversionRate).toString()
      : (parseFloat(income) * conversionRate).toFixed(2).toString();
  };

  const handleUpdate = async () => {
    await updateIncome(newIncome);
    setEditModalVisible(false);
  };

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['55%'] : [ '30%'];
  }, [textInputFocused]); 

  useEffect(() => {
    if (editModalVisible || income) {
      setNewIncome(formatIncome(income));
    }
  }, [editModalVisible, income, conversionRate, symbol]);

  return (
    <View style={MonthlyIncomeStyles.cardContainer}>
      <View style={MonthlyIncomeStyles.leftSide}>
        <Text style={MonthlyIncomeStyles.headerText}>{languages[selectedLanguage].upcomingSubs}</Text>
        <Text style={MonthlyIncomeStyles.incomeText}>
          {formatIncome(income)}{' '}{symbol}
        </Text>      
      </View>
      <View style={MonthlyIncomeStyles.rightSide}>
        <TouchableOpacity style={MonthlyIncomeStyles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={MonthlyIncomeStyles.editButtonText}>{languages[selectedLanguage].edit}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
            Keyboard.dismiss();
            setEditModalVisible(false);
        }}>
        <Pressable
            style={MonthlyIncomeStyles.modalBackground}
            onPress={() => {
              setEditModalVisible(false);
              Keyboard.dismiss();
            }}>
            <BottomSheet
              index={0}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={() => {
                Keyboard.dismiss();
                setEditModalVisible(false);
              }}            
              backgroundComponent={({ style }) => (
                <View style={[style, MonthlyIncomeStyles.bottomSheetBackground]} />
              )}>
              <View style={MonthlyIncomeStyles.sheetHeader}>
                <Text style={MonthlyIncomeStyles.sheetTitle}>Edit Monthly Income in {currency}</Text>
                <TouchableOpacity
                  style={MonthlyIncomeStyles.closeButton}
                  onPress={() => {
                    setEditModalVisible(false);
                    Keyboard.dismiss();
                  }}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={MonthlyIncomeStyles.contentContainer}>
                <TextInput
                  style={MonthlyIncomeStyles.input}
                  value={newIncome}
                  onChangeText={setNewIncome}
                  keyboardType="numeric"
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={MonthlyIncomeStyles.updateButtonTouchable}>
                  <Text style={MonthlyIncomeStyles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </BottomSheet>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MonthlyIncome;
