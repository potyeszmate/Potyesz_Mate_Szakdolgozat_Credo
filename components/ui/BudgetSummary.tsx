/* eslint-disable react/prop-types */
// BudgetSummary.js
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import { ProgressCircle } from 'react-native-progress';
import Budget from './Budget';
import BudgetItem from './BudgetItem';
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import BudgetInput from './BudgetInput';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc,deleteDoc,updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../../store/auth-context';
import { Feather } from '@expo/vector-icons';

import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const BudgetSummary: React.FC<any> = ({ transactions, selectedLanguage }) => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [spentAmount, setSpentAmount] = useState<any>(0);
  const [remainingAmount, setRemainingAmount] = useState<any>(0);
  const [spentPercentage, setSpentPercentage] = useState<any>(0);
  const [loading, setLoading] = useState<any>(true);
  const bottomSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<any>(false);
  const [editModalVisible, setEditModalVisible] = useState<any>(false);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

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
      console.log("Before deleting this budget: ", selectedBudget.id)
      const docRef = doc(db, 'budgets', selectedBudget.id);
      await deleteDoc(docRef);
      fetchBudgets();
      hideDeleteModal()
      setDeleteModalVisible(false); // Close the delete modal
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchBudgets();
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!loading) {
      console.log('Calculating progress bar...');
      const newTotalAmount = budgets.reduce((acc, budget) => acc + budget.Total_ammount, 0);
      const newSpentAmount = transactions
        ? transactions
          .filter((transaction: any) => transaction.category)
          .reduce((acc: any, transaction: any) => {
            const matchingBudget = budgets.find((budget) => budget.Category === transaction.category);
            return acc + (matchingBudget ? transaction.value : 0);
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

  useEffect(() => {
    console.log('spentAmount:', spentAmount);
    console.log('totalAmount:', totalAmount);
    console.log('spentPercentage:', spentPercentage);
  }, [spentAmount, totalAmount, spentPercentage]);

  const snapPoints = useMemo(() => ['20%', '45%'], []);

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

  const showDeleteModal = (budget: any) => {
    console.log("Delete this budget: ", budget)
    setSelectedBudget(budget);
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedBudget(null);
  };

  const showEditModal = (budget: any) => {
    console.log("Edit this budget: ", budget)
    setSelectedBudget(budget);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setSelectedBudget(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.expenseSummaryText}>{languages[selectedLanguage].expenseSummary}</Text>
      <Text style={styles.amountLeftText}>${remainingAmount} {languages[selectedLanguage].left}</Text>
      {!loading && spentPercentage > 0 && (
        <Progress.Bar
          progress={spentPercentage / 100}
          width={Math.round(Dimensions.get('window').width * 0.82)}
          height={15}
          color={'#35BA52'}
          borderRadius={10}
          borderColor='#FFFFFF'
          animationType='decay'   
          unfilledColor='#F3F4F7'
        />
      )}
      <View style={styles.spentSetRow}>
        <Text style={styles.spentText}>${spentAmount} {languages[selectedLanguage].spent}</Text>
        <Text style={styles.setText}>${totalAmount} {languages[selectedLanguage].set}</Text>
      </View>
      {budgets.map((budget) => (
        <Budget key={budget.id} budget={budget} transactions={transactions} onDelete={() => showDeleteModal(budget)} onEdit={() => showEditModal(budget)} />
      ))}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Create new</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this expense?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteBudgetHandler()} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                <Text style={styles.deleteModalButtonText}>Yes</Text>
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
          style={styles.modalBackground}
          onPress={() => {
            // Close both the modal and BottomSheet when clicking outside
            // setModalVisible(false);
            // bottomSheetRef.current?.close();
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('BottomSheet closed');
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <BudgetInput
                onAddBudget={editBudgetHandler}
                existingCategories={budgets.map(budget => budget.Category)}
                initialBudget={selectedBudget}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>
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
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('BottomSheet closed');
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
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      marginTop: 16,
      width: '90%',
      alignSelf: 'center',

    },
    expenseSummaryText: {
      fontSize: 16,
      color: '#888',
    },
    amountLeftText: {
      fontSize: 29,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 8,
      paddingBottom: 10, 
    },
    spentSetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
     marginLeft: 4

    },
    spentText: {
      fontSize: 16,
      color: '#333',
    //   marginLeft: -17
    },
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    setText: {
        fontSize: 16,
        color: '#888',
        marginRight: 6
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 4
      },
      
      editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#1A1A2C',
        marginRight: 4, // Updated right margin for spacing
        width: '50%', 
        height: 45,
      },      
      editButtonText: {
        color: '#1A1A2C',
        fontSize: 16,
        fontWeight: 'bold',
      },
      addButtonContainer: {
        padding: 16,
      },
      addButton: {
        backgroundColor: '#1A1A2C',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      },
      addIcon: {
        marginRight: 8,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
    deleteModalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    deleteModalContent: {
      backgroundColor: '#fff',
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 5,
    },
    deleteModalText: {
      fontSize: 18,
      marginBottom: 16,
    },
    deleteModalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    deleteModalButton: {
      marginLeft: 16,
      padding: 8,
    },
    deleteModalButtonYes: {
      backgroundColor: '#FF5733',
      borderRadius: 8,
    },
    deleteModalButtonText: {
      fontSize: 16,
      color: '#1A1A2C',
    },
      
  });
    

export default BudgetSummary;
