import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image, ActivityIndicator, Keyboard } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import RecurringBillsInput from '../../../components/Recurrings/RecurringBillsInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertCurrencyToCurrency } from '../../../util/conversion';
import { RecurringStyles } from '../ExpensesSytles';
import { languages } from '../../../commonConstants/sharedConstants';
import { billsIconMapping } from '../ExspensesConstants';
import { RecurringTransactions } from '../ExspensesTypes';

const Bills = () => {
  const navigation = useNavigation();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransactions[]>([]);
  const bottomSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const snapPoints = useMemo(() => ['33%', '66%', '85%'], []);
  const route = useRoute();
  const { userID, symbol, selectedLanguage, conversionRate, currency} = route.params; 
  const totalSubscriptions = recurringTransactions.length;
  const totalValue = recurringTransactions.reduce((acc, curr) => acc + parseInt(curr.value), 0);


  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);

      const recurringTransactionsQuery = query(
        collection(db, 'bills'),
        where('uid', '==', userID)
      );
      const querySnapshot = await getDocs(recurringTransactionsQuery);
      const fetchedRecurringTransactions: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecurringTransactions(fetchedRecurringTransactions);
      setLoading(false);

    } catch (error: any) {
      console.error('Error fetching recurring transactions:', error.message);
      setLoading(false);

    }
  };

  const addTransactionHandler = async (newRecurringTransaction: any) => {
    try {
      await addDoc(collection(db, 'bills'), {
        ...newRecurringTransaction,
        uid: userID,
      });
      fetchRecurringTransactions();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const deleteRecurringTransactionHandler = async (recurringTransactionId: string) => {
    try {
      const docRef = doc(db, 'bills', recurringTransactionId);
      await deleteDoc(docRef);
      fetchRecurringTransactions();
      setDeleteModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting recurring transaction:', error.message);
    }
  };

  const editRecurringTransactionHandler = async (editedRecurringTransaction: any) => {
    try {
      const { id, ...editedData } = editedRecurringTransaction;
      const docRef = doc(db, 'bills', id);
      await updateDoc(docRef, editedData);
      fetchRecurringTransactions();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };

  const handleEditIconClick = (selectedRecurringTransaction: any) => {
    setSelectedRecurringTransaction(selectedRecurringTransaction);
    setEditModalVisible(true);
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, [userID]);

  return (
    <View style={RecurringStyles.container}>
      <View style={RecurringStyles.space}></View>

      <View style={RecurringStyles.totalCard}>
        <View style={RecurringStyles.totalRow}>
        <Text style={RecurringStyles.totalLabel}>{languages[selectedLanguage].total}</Text>
          {loading ? (
                <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
              ) : (          
              <Text style={RecurringStyles.totalSubscriptions}>
              {`${totalSubscriptions} ${totalSubscriptions !== 1 ? languages[selectedLanguage].bills : languages[selectedLanguage].bills}`}
              </Text>
          )}

        </View>
        {loading ? (
            <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
        ) : (
          <View style={RecurringStyles.totalRow}>
            {conversionRate !== null ? (
                <Text style={RecurringStyles.totalValue}> {currency === 'HUF' ? 
                    Math.round(parseFloat(totalValue) * conversionRate) :
                    (parseFloat(totalValue) * conversionRate).toFixed(2)
                  } {symbol}
                </Text>
                ) : (
                  <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
                )}
          </View>
        )}

      </View>

      {loading ? (
          <ActivityIndicator size="large" color="#000" style={RecurringStyles.loadingIndicator} />
        ) : (
      <FlatList
        data={recurringTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {

          const transactionDate = item.Date.toDate(); 
            const now = new Date();
            const isPastDate = transactionDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);

            return (

          <TouchableOpacity style={RecurringStyles.transactionItem} onPress={() => handleEditIconClick(item)}>
            <View style={RecurringStyles.transactionIcon}>
            <Image source={billsIconMapping[item.name]} style={RecurringStyles.iconImage} />
            </View>
            <View style={RecurringStyles.transactionInfo}>
              <Text style={RecurringStyles.transactionName}>{languages[selectedLanguage][item.name]}</Text>
              <View style={RecurringStyles.categoryDateContainer}>
                <Text style={[RecurringStyles.transactionCategory, { color: '#888' }]}>                
                  {languages[selectedLanguage][item.category]}
                </Text>
                <View style={RecurringStyles.separator} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[RecurringStyles.transactionDate, isPastDate ? RecurringStyles.pastDateText : null]}>
                        {transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      {isPastDate && <Feather name="alert-circle" size={16} style={RecurringStyles.warningIcon} />}
                </View>
              </View>
            </View>
            <View style={RecurringStyles.transactionAmount}>
              {conversionRate !== null ? (
              <Text style={RecurringStyles.transactionAmountValue}> {currency === 'HUF' ? 
                  Math.round(parseFloat(item.value) * conversionRate) :
                  (parseFloat(item.value) * conversionRate).toFixed(2)
                } {symbol}
              </Text>
              ) : (
                <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
              )}
            </View>
          </TouchableOpacity>
)
}}      />
      )}

        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={RecurringStyles.deleteModalContainer}>
            <View style={RecurringStyles.deleteModalContent}>
            <Text style={RecurringStyles.deleteModalText}>{languages[selectedLanguage].deleteBillModalText}</Text>
              <View style={RecurringStyles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={RecurringStyles.deleteModalButton}>
                <Text style={RecurringStyles.deleteModalButtonText}>{languages[selectedLanguage].no}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecurringTransactionHandler(selectedRecurringTransactionId!)} style={[RecurringStyles.deleteModalButton, RecurringStyles.deleteModalButtonYes]}>
                <Text style={RecurringStyles.deleteModalButtonText}>{languages[selectedLanguage].yes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            Keyboard.dismiss();
            setEditModalVisible(false);
          }}         >
          <Pressable
            style={RecurringStyles.modalBackground}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <BottomSheet
              ref={bottomSheetRef}
              index={2}
              snapPoints={snapPoints}
              enablePanDownToClose
              onClose={() => {
                Keyboard.dismiss();
                setEditModalVisible(false);
              }}
              backgroundComponent={({ style }) => (
                <View style={[style, RecurringStyles.bottomSheetBackground]} />
              )}
            >
              <View style={RecurringStyles.contentContainer}>
                <RecurringBillsInput
                  initialRecurringTransaction={selectedRecurringTransaction}
                  onAddRecurringTransaction={editRecurringTransactionHandler}
                  conversionRate = {conversionRate}
                  currency = {currency}
                  selectedLanguage = {selectedLanguage}
                  onDeleteRecurringTransaction = {deleteRecurringTransactionHandler}
                  onClose={() => setEditModalVisible(false)}
                />
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            Keyboard.dismiss();
            setModalVisible(false);
          }}         >
          <Pressable
            style={RecurringStyles.modalBackground}
            onPress={() => {
              setModalVisible(false)
              Keyboard.dismiss();
            }}>
            <BottomSheet
              ref={bottomSheetRef}
              index={2}
              snapPoints={snapPoints}
              enablePanDownToClose
              onClose={() => {
                Keyboard.dismiss(); 
                setModalVisible(false);
              }}
              backgroundComponent={({ style }) => (
                <View style={[style, RecurringStyles.bottomSheetBackground]} />
              )}
            >
              <View style={RecurringStyles.contentContainer}>
                <RecurringBillsInput
                  onAddRecurringTransaction={addTransactionHandler}
                  conversionRate = {conversionRate}
                  currency = {currency}
                  selectedLanguage= {selectedLanguage}
                  onClose={() => setModalVisible(false)}
                />
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>

      <TouchableOpacity
        style={RecurringStyles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" style={RecurringStyles.addIcon} />
        <Text style={RecurringStyles.addButtonText}>{languages[selectedLanguage].addBill}</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Bills;
