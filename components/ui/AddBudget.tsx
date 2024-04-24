import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BudgetInput from './BudgetInput';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../store/auth-context';

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

const AddBudget = ({ updateIncome, selectedLanguage, symbol, conversionRate, currency}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newIncome, setNewIncome] = useState('');
  const [textInputFocused, setTextInputFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const bottomSheetRef = useRef<any>(null);


  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  
  // Helper function to format income
  // const formatIncome = (income) => {
  //   return symbol === 'HUF'
  //     ? Math.round(parseFloat(income) * conversionRate).toString()
  //     : (parseFloat(income) * conversionRate).toFixed(2).toString();
  // };

  // useEffect(() => {
  //   // Update newIncome when modal opens or income changes
  //   if (editModalVisible || income) {
  //     setNewIncome(formatIncome(income));
  //   }
  // }, [editModalVisible, income, conversionRate, symbol]);

  // const handleUpdate = async () => {
  //   await updateIncome(newIncome);
  //   setEditModalVisible(false);
  // };

  const fetchBudgets = async () => {
    try {
      const budgetsQuery = query(collection(db, 'budgets'), where('uid', '==', userId));
      const querySnapshot = await getDocs(budgetsQuery);
      const fetchedBudgets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as any);
      setBudgets(fetchedBudgets);
    } catch (error: any) {
      console.error('Error fetching budgets:', error.message);
    }
  };


  const addBudgetHandler = async (newBudget: any) => {
    try {
      console.log('ADDING THIS NEW BUDGET: ', newBudget);
      await addDoc(collection(db, 'budgets'), {
        ...newBudget,
        uid: userId,
      });
      fetchBudgets();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding budget:', error.message);
    }
  };

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['50%'] : [ '60%'];
  }, [textInputFocused]); 

  const existingCategories= budgets.map(budget => budget.Category)

  const availableCategories = allCategories.filter(
    (category: any) => !existingCategories.includes(category.label)
  );

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSide}>
        <Text style={styles.headerText}>Budget for categories</Text>
        <Text style={styles.incomeText}>
        {availableCategories.length} more categories left
        </Text>      
      </View>
      <View style={styles.rightSide}>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Set up new</Text>
        </TouchableOpacity>
      </View>

      <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  style={styles.modalBackground}
                  onPress={() => {
                    // Close both the modal and BottomSheet when clicking outside
                    // setModalVisible(false);
                    // bottomSheetRef.current?.close();
                  }}
                >
                  <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onClose={() => {
                      setModalVisible(false);
                    }}
                    backgroundComponent={({ style }) => (
                      <View style={[style, styles.bottomSheetBackground]} />
                    )}
                  >
                    <View style={styles.contentContainer}>
                      <BudgetInput onAddBudget={addBudgetHandler} existingCategories={budgets.map(budget => budget.Category)} />
                    </View>
                  </BottomSheet>
                </Pressable>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 4, // Shadow for iOS
    borderColor: '#E0E0E0', // A slightly darker shade for the border
    flexDirection: 'row',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
    // fontFamily: 'Inter',
  },
  incomeText: {
    fontSize: 14,
    color: '#7E8086',
    // fontFamily: 'Inter',
    marginTop: 4,
    // fontWeight: 'bold'
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#149E53',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    height: 35,
    // width: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#149E53',
    fontSize: 14,
    // fontFamily: 'Inter',
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

export default AddBudget;
