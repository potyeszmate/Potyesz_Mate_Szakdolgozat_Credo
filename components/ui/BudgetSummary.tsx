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
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};



const BudgetSummary: React.FC<any> = ({ transactions, selectedLanguage, currency, conversionRate, symbol }) => {
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
  const [selectedMonth, setSelectedMonth] = React.useState('January');

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

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
    if (!loading && budgets.length > 0) {
      console.log('Calculating progress bar...');
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      const newTotalAmount = budgets.reduce((acc, budget) => acc + budget.Total_ammount, 0);
      
      console.log(`Current month/year: ${currentMonth}/${currentYear}`);

      const newSpentAmount = transactions
      ? transactions
          .filter((transaction: any) => {
            const transactionDate = transaction.date.toDate(); // If transaction.date is a Firestore Timestamp

            // const transactionDate = new Date(transaction.date.seconds * 1000); // Convert Firestore Timestamp to Date object
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

  let progressBarColor = '#35BA52'; // Default green color
  if (spentPercentage / 100 >= 0.8) {
    progressBarColor = '#FF5733'; // Red color for high expenditure
  } else if (spentPercentage / 100 >= 0.5) {
    progressBarColor = '#FFA500'; // Orange color for moderate expenditure
  }

  return (
    !loading && 
    <View style={styles.container}>
      {!loading && spentPercentage > 0 && (
      <View style={styles.summaryContainer}>
        <View>
          <Text style={styles.expenseSummaryText}>{languages[selectedLanguage].expenseSummary}</Text>
          {/* <View style={styles.monthSelectorContainer}>
            <View style={styles.monthSelectorCard}>
              <RNPickerSelect
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
                items={months.map(month => ({ label: month.label, value: month.value }))}
                style={{ inputIOS: styles.monthSelector }}
              />
              <Ionicons name="caret-down" size={20} style={styles.monthSelectorIcon} />
            </View>
          </View> */}
        </View>
        <Text style={styles.amountLeftText}>
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
          <View style={styles.spentSetRow}>
            <Text style={styles.spentText}>
              {currency === 'HUF' ? 
                Math.round(parseFloat(spentAmount) * conversionRate) :
                (parseFloat(spentAmount) * conversionRate).toFixed(0)
              }{symbol} {languages[selectedLanguage].spent}
            </Text>
            <Text style={styles.setText}>
              {currency === 'HUF' ? 
                Math.round(parseFloat(totalAmount) * conversionRate) :
                (parseFloat(totalAmount) * conversionRate).toFixed(0)
              }{symbol} {languages[selectedLanguage].set}
            </Text>
          </View>
        )
      )}

      
      <View style={styles.separator} />
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
            {index !== budgets.length - 1 && <View style={styles.separator} />}
          </View>
        ))}

      {/* {!loading && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Create new</Text>
          </TouchableOpacity>
        </View>
       )} */}

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
     
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 16,
      marginTop: 10,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
      shadowOpacity: 0.1, // Shadow for iOS
      shadowRadius: 4, // Shadow for iOS
      borderColor: '#E0E0E0', // A slightly darker shade for the border
    },
    summaryContainer: {
      // marginLeft: 5,
      // marginRight: 5,
      // marginTop: 5
    },
    expenseSummaryText: {
      fontSize: 16,
      color: '#888',
    },
    amountLeftText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 8,
      paddingBottom: 10, 
    },
    spentSetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      // marginLeft: 4,
      marginBottom: 20
    },
    spentText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 2
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
        marginRight: 3
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 4
      },
      separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
        // marginLeft: 5, // Adjust this value to align with the transactionInfo
        // marginRight: 5, // Add a bigger right margin
        marginBottom: 2, // Add a bigger right margin
        marginTop: 2, // Add a bigger right margin
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
        backgroundColor: '#35BA52',
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
    monthSelectorContainer: {
      position: 'absolute',
      top: 0,
      right: -3,
      zIndex: 1,
    },
    monthSelectorCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      flexDirection: 'row',
      alignItems: 'center',
    },
    monthSelector: {
      flex: 1,
      color: '#000000',
      paddingRight: 30, // To account for the icon
    },
    monthSelectorIcon: {
      position: 'absolute',
      right: 10,
    },
  });
    

export default BudgetSummary;
