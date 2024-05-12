import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Budget from './Budget';
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import BudgetInput from './BudgetInput';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc,deleteDoc,updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../../store/auth-context';
import { languages } from '../../commonConstants/sharedConstants';
import { BudgetSummaryStyles } from './BudgetComponentStyles';

const BudgetSummary: React.FC<any> = ({ transactions, selectedLanguage, currency, conversionRate, symbol }) => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [spentAmount, setSpentAmount] = useState<any>(0);
  const [remainingAmount, setRemainingAmount] = useState<any>(0);
  const [spentPercentage, setSpentPercentage] = useState<any>(0);
  const [loading, setLoading] = useState<any>(true);
  const bottomSheetRef = useRef<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<any>(false);
  const [editModalVisible, setEditModalVisible] = useState<any>(false);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  const snapPoints = useMemo(() => ['20%', '45%'], []);

  let progressBarColor = '#35BA52'; 
  if (spentPercentage / 100 >= 0.8) {
    progressBarColor = '#FF5733'; 
  } else if (spentPercentage / 100 >= 0.5) {
    progressBarColor = '#FFA500';
  }

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

  const deleteBudgetHandler = async () => {
    try {
      if (!selectedBudget) {
        console.error("THERE IS NO SELECTED Budget");
        return;
      }
      const docRef = doc(db, 'budgets', selectedBudget.id);
      await deleteDoc(docRef);
      fetchBudgets();
      hideDeleteModal()
      setDeleteModalVisible(false); 
    } catch (error: any) {
      console.error('Error deleting budget:', error.message);
    }
  };

  const editBudgetHandler = async (editedTransaction: any) => {
    try {
      const { id, ...editedData } = editedTransaction;
      const docRef = doc(db, 'budgets', id);
      await updateDoc(docRef, editedData);
      fetchBudgets();
      hideEditModal();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };

  // const addBudgetHandler = async (newBudget: any) => {
  //   try {
  //     await addDoc(collection(db, 'budgets'), {
  //       ...newBudget,
  //       uid: userId,
  //     });
  //     fetchBudgets();
  //     setModalVisible(false);
  //   } catch (error: any) {
  //     console.error('Error adding budget:', error.message);
  //   }
  // };

  const showDeleteModal = (budget: any) => {
    setSelectedBudget(budget);
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedBudget(null);
  };

  const showEditModal = (budget: any) => {
    setSelectedBudget(budget);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setSelectedBudget(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchBudgets();
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!loading && budgets.length > 0) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      const newTotalAmount = budgets.reduce((acc, budget) => acc + budget.Total_ammount, 0);
      

      const newSpentAmount = transactions
      ? transactions
          .filter((transaction: any) => {
            const transactionDate = transaction.date.toDate(); 

            return transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
          })
          .reduce((acc: any, transaction: any) => {
            const matchingBudget = budgets.find((budget) => budget.Category === transaction.category);
            return matchingBudget ? acc + parseFloat(transaction.value) : acc;
          }, 0)
      : 0;
  
      const newRemainingAmount = newTotalAmount - newSpentAmount;
      const newSpentPercentage = newTotalAmount !== 0 ? (newSpentAmount / newTotalAmount) * 100 : 0;
  
      setTotalAmount(newTotalAmount);
      setSpentAmount(newSpentAmount);
      setRemainingAmount(newRemainingAmount);
      setSpentPercentage(newSpentPercentage);
    }
  }, [loading, budgets, transactions]);
  
  // useEffect(() => {
   
  // }, [spentAmount, totalAmount, spentPercentage]);


  return (
    !loading && 
    <View style={BudgetSummaryStyles.container}>
      {!loading && spentPercentage > 0 && (
      <View style={BudgetSummaryStyles.summaryContainer}>
        <View>
          <Text style={BudgetSummaryStyles.expenseSummaryText}>{languages[selectedLanguage].expenseSummary}</Text>
        </View>
        <Text style={BudgetSummaryStyles.amountLeftText}>
          {currency === 'HUF' ? 
            Math.round(parseFloat(remainingAmount) * conversionRate) :
            (parseFloat(remainingAmount) * conversionRate).toFixed(2)
          }{symbol} {languages[selectedLanguage].left}</Text>
      </View>
      )}
      {!loading && spentPercentage > 0 && (
        <View style={{ }}>
          <Progress.Bar
            progress={spentPercentage / 100}
            width={Math.round(Dimensions.get('window').width * 0.82)}
            height={15}
            color={progressBarColor}
            borderRadius={10}
            borderColor='#FFFFFF'
            animationType='decay'   
            unfilledColor='#F3F4F7'
          />
        </View>

      )}
      {!loading && (
      budgets.length === 0 ? ( 
        <View>
          <Text> No budgets created yet.</Text>
        </View>
        ) : ( 
          <View style={BudgetSummaryStyles.spentSetRow}>
            <Text style={BudgetSummaryStyles.spentText}>
              {currency === 'HUF' ? 
                Math.round(parseFloat(spentAmount) * conversionRate) :
                (parseFloat(spentAmount) * conversionRate).toFixed(0)
              }{symbol} {languages[selectedLanguage].spent}
            </Text>
            <Text style={BudgetSummaryStyles.setText}>
              {currency === 'HUF' ? 
                Math.round(parseFloat(totalAmount) * conversionRate) :
                (parseFloat(totalAmount) * conversionRate).toFixed(0)
              }{symbol} {languages[selectedLanguage].set}
            </Text>
          </View>
        )
      )}

      
      <View style={BudgetSummaryStyles.separator} />
       {budgets.map((budget, index) => (
          <View key={budget.id}>
            <Budget 
              budget={budget} 
              transactions={transactions} 
              onDelete={() => showDeleteModal(budget)} 
              onEdit={() => showEditModal(budget)} 
              currency = {currency}
              conversionRate = {conversionRate}
              symbol = {symbol}
            />
            {index !== budgets.length - 1 && <View style={BudgetSummaryStyles.separator} />}
          </View>
        ))}

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={BudgetSummaryStyles.deleteModalContainer}>
          <View style={BudgetSummaryStyles.deleteModalContent}>
            <Text style={BudgetSummaryStyles.deleteModalText}>Are you sure you want to delete this expense?</Text>
            <View style={BudgetSummaryStyles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={BudgetSummaryStyles.deleteModalButton}>
                <Text style={BudgetSummaryStyles.deleteModalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteBudgetHandler()} style={[BudgetSummaryStyles.deleteModalButton, BudgetSummaryStyles.deleteModalButtonYes]}>
                <Text style={BudgetSummaryStyles.deleteModalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={BudgetSummaryStyles.modalBackground}
          onPress={() => {
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, BudgetSummaryStyles.bottomSheetBackground]} />
            )}
          >
            <View style={BudgetSummaryStyles.contentContainer}>
              <BudgetInput
                onAddBudget={editBudgetHandler}
                existingCategories={budgets.map(budget => budget.Category)}
                initialBudget={selectedBudget}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>
     
    </View>
  );
};    

export default BudgetSummary;
