import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import RecurringTransactionInput from '../../../components/Recurrings/RecurringTransactionInput';
import { Keyboard } from 'react-native';
import { RecurringStyles } from '../ExpensesSytles';
import { subscriptionsIconMapping } from '../ExspensesConstants';
import { languages } from '../../../commonConstants/sharedConstants';
import { RecurringTransactions } from '../ExspensesTypes';

const RecurringPayments = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransactions[]>([]);
  const bottomSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const totalSubscriptions = recurringTransactions.length;
  const totalValue = recurringTransactions.reduce((acc, curr) => acc + parseInt(curr.value), 0);
  const snapPoints = useMemo(() => ['33%', '66%', '85%'], []);
  const route = useRoute();
  const { userId, symbol, selectedLanguage, conversionRate, currency} = route.params; 

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);

      const recurringTransactionsQuery = query(
        collection(db, 'recurring_payments'),
        where('uid', '==', userId)
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
      setModalVisible(false);

      await addDoc(collection(db, 'recurring_payments'), {
        ...newRecurringTransaction,
        uid: userId,
      });
      fetchRecurringTransactions();
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const deleteRecurringTransactionHandler = async (recurringTransactionId: string) => {
    try {
      const docRef = doc(db, 'recurring_payments', recurringTransactionId);
      await deleteDoc(docRef);
      fetchRecurringTransactions();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting recurring transaction:', error.message);
    }

  };

  const editRecurringTransactionHandler = async (editedRecurringTransaction: any) => {
    try {
      setEditModalVisible(false);
      const { id, ...editedData } = editedRecurringTransaction;
      const docRef = doc(db, 'recurring_payments', id);
      await updateDoc(docRef, editedData);
      fetchRecurringTransactions();
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };

  const handleEditIconClick = (selectedRecurringTransaction: any) => {
    setSelectedRecurringTransaction(selectedRecurringTransaction);
    setEditModalVisible(true);
  };

  useEffect(() => {
    if (userId) {
      fetchRecurringTransactions();
    } else {
      console.error("No userId available, check navigation parameters");
    }
  }, [userId]);

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
                {`${totalSubscriptions} ${
                  totalSubscriptions !== 1
                    ? languages[selectedLanguage].subscriptions
                    : languages[selectedLanguage].subscription
                }`}
              </Text>
            )}
          </View>
          {loading ? (
            <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <View style={RecurringStyles.totalRow}>
              {conversionRate !== null ? (
                <Text style={RecurringStyles.totalValue}>
                  {' '}
                  {symbol === 'HUF'
                    ? Math.round(parseFloat(totalValue) * conversionRate)
                    : (parseFloat(totalValue) * conversionRate).toFixed(2)}{' '}
                  {symbol}
                </Text>
              ) : (
                <Text style={RecurringStyles.loadingText}>{languages[selectedLanguage].loading}</Text>
              )}
            </View>
          )}
        </View>

        <View style={RecurringStyles.listContainer}>
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
                  <Image source={subscriptionsIconMapping[item.name]} style={RecurringStyles.iconImage} />
                </View>
                <View style={RecurringStyles.transactionInfo}>
                  <Text style={RecurringStyles.transactionName}>{item.name}</Text>
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
                  <Text style={RecurringStyles.transactionAmountValue}>
                    {symbol} {(parseFloat(item.value) * conversionRate).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        )}
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
            style={RecurringStyles.modalBackground}
            onPress={() => {
              Keyboard.dismiss();
            }}>
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
              )}>
              <View style={RecurringStyles.contentContainer}>
                
                <RecurringTransactionInput
                  initialRecurringTransaction={selectedRecurringTransaction}
                  onAddRecurringTransaction={editRecurringTransactionHandler}
                  conversionRate={conversionRate}
                  currency={symbol}
                  selectedLanguage={selectedLanguage}
                  onDeleteRecurringTransaction={deleteRecurringTransactionHandler}
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
        }}>
        <Pressable
          style={RecurringStyles.modalBackground}
          onPress={() => {
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
            )}>
            <View style={RecurringStyles.contentContainer}>
          
              <RecurringTransactionInput
                onAddRecurringTransaction={addTransactionHandler}
                conversionRate={conversionRate}
                currency={currency}
                selectedLanguage={selectedLanguage}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>


      <TouchableOpacity style={RecurringStyles.addButton} onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={24} color="#fff" style={RecurringStyles.addIcon} />
        <Text style={RecurringStyles.addButtonText}>{languages[selectedLanguage].addSubscription}</Text>
      </TouchableOpacity>

      </View>
  );
};

export default RecurringPayments;
