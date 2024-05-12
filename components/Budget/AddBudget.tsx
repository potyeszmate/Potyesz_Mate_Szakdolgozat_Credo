import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, Pressable, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BudgetInput from './BudgetInput';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../store/auth-context';
import { languages } from '../../commonConstants/sharedConstants';
import { AddBudgetStyles } from './BudgetComponentStyles';
import { AddBudgetAllCategories } from './BudgetComponentConstants';

const AddBudget = ({ updateIncome, selectedLanguage, symbol, conversionRate, currency}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newIncome, setNewIncome] = useState('');
  const [textInputFocused, setTextInputFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const bottomSheetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  
  const snapPoints = useMemo(() => {
    return textInputFocused ? ['50%'] : [ '60%'];
  }, [textInputFocused]); 

  const existingCategories= budgets.map(budget => budget.Category)

  const availableCategories = AddBudgetAllCategories.filter(
    (category: any) => !existingCategories.includes(category.label)
  );

  const fetchBudgets = async () => {
    try {
      setIsLoading(true); 

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
    setIsLoading(false); 

  };

  const addBudgetHandler = async (newBudget: any) => {
    try {
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

  useEffect(() => {
    fetchBudgets();
  }, []); 

  return (
    <View style={AddBudgetStyles.cardContainer}>
      <View style={AddBudgetStyles.leftSide}>
        <Text style={AddBudgetStyles.headerText}>{languages[selectedLanguage].budgetsForCat}</Text>  
        {isLoading ? (
          <Text style={AddBudgetStyles.incomeText}>
        </Text>
        ) : (
            <Text style={AddBudgetStyles.incomeText}>
                {availableCategories.length} {languages[selectedLanguage].xMoreLeft}
            </Text>
        )}
      </View>
      <View style={AddBudgetStyles.rightSide}>
        <TouchableOpacity style={AddBudgetStyles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={AddBudgetStyles.editButtonText}>{languages[selectedLanguage].setUpNew}</Text>
        </TouchableOpacity>
      </View>

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  style={AddBudgetStyles.modalBackground}
                  onPress={() => {

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
                      <View style={[style, AddBudgetStyles.bottomSheetBackground]} />
                    )}
                  >
                    <View style={AddBudgetStyles.contentContainer}>
                      <BudgetInput onAddBudget={addBudgetHandler} existingCategories={budgets.map((budget) => budget.Category)} />
                    </View>
                  </BottomSheet>
                </Pressable>
              </Modal>
    </View>
  );
};

export default AddBudget;
