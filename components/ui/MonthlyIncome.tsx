import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MonthlyIncome = ({ income, updateIncome, selectedLanguage, symbol, conversionRate, currency}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newIncome, setNewIncome] = useState('');
  const [textInputFocused, setTextInputFocused] = useState(false);

  // Helper function to format income
  const formatIncome = (income) => {
    return symbol === 'HUF'
      ? Math.round(parseFloat(income) * conversionRate).toString()
      : (parseFloat(income) * conversionRate).toFixed(2).toString();
  };

  useEffect(() => {
    // Update newIncome when modal opens or income changes
    if (editModalVisible || income) {
      setNewIncome(formatIncome(income));
    }
  }, [editModalVisible, income, conversionRate, symbol]);

  const handleUpdate = async () => {
    await updateIncome(newIncome);
    setEditModalVisible(false);
  };

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['55%'] : [ '30%'];
  }, [textInputFocused]); 

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSide}>
        <Text style={styles.headerText}>Monthly income</Text>
        <Text style={styles.incomeText}>
          {formatIncome(income)}{' '}{symbol}
        </Text>      
      </View>
      <View style={styles.rightSide}>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit</Text>
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
            style={styles.modalBackground}
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
                <View style={[style, styles.bottomSheetBackground]} />
              )}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Edit Monthly Income in {currency}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setEditModalVisible(false);
                    Keyboard.dismiss();
                  }}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                <TextInput
                  style={styles.input}
                  value={newIncome}
                  onChangeText={setNewIncome}
                  keyboardType="numeric"
                //   onFocus={() => setNewIncome('')}
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={styles.updateButtonTouchable}>
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </BottomSheet>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 15,
    color: '#7E8086',
    fontFamily: 'Inter',
  },
  incomeText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter',
    marginTop: 4,
    fontWeight: 'bold'
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#149E53',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    height: 35,
    width: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#149E53',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 18,
    padding: 8,
    fontSize: 16,
    borderRadius: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sheetTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    // Style for close button
  },
  updateButtonTouchable: {
    backgroundColor: '#35BA52',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MonthlyIncome;
