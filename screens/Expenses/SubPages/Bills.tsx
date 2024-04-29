import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image, ActivityIndicator, Keyboard } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import RecurringBillsInput from '../../../components/Recurrings/RecurringBillsInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertCurrencyToCurrency } from '../../../util/conversion';

const iconMapping: { [key: string]: any } = {
  Electricity: require('../../../assets/Recurrings/electricity.png'),
  Water: require('../../../assets/Recurrings/water.png'),
  Gas: require('../../../assets/Recurrings/gas.png'),
  Phone: require('../../../assets/Recurrings/phone.png'),
  Internet: require('../../../assets/Recurrings/internet.png'),
  Hospitality: require('../../../assets/Recurrings/hospitality.png'),
};

import en from '../../../languages/en.json';
import de from '../../../languages/de.json';
import hu from '../../../languages/hu.json';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

// !TODO! - Refactor - Make a shared, dynamic component from the subpages
const Bills = () => {
  const navigation = useNavigation();
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  const bottomSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState<any>(null);
  const [selectedRecurringTransactionId, setSelectedRecurringTransactionId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<any>({});
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [prevCurrency, setPrevCurrency] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
  };

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);

      const recurringTransactionsQuery = query(
        collection(db, 'bills'),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(recurringTransactionsQuery);
      const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
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

  const fetchUserSettings = async () => {
    try {
      const settingsQuery = query(collection(db, 'users'),  where('uid', '==', userId))
      const querySnapshot = await getDocs(settingsQuery);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0]?.data(); 
        if (userData) {
          setUserSettings(userData);
        } else {
        }
      } else {
        console.error('No documents found.');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error.message);
    }
  };

  const getCurrencySymbol = (currencyCode: any) => {
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'HUF':
        return 'HUF';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return ''; 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userSettings.currency) {
          await fetchUserSettings();
        }
        
        if (userSettings.currency && userSettings.currency !== prevCurrency) {
          const savedSymbol = await AsyncStorage.getItem('symbol');
          const symbolHaveNotChanged = savedSymbol === getCurrencySymbol(userSettings.currency);
    
          if (symbolHaveNotChanged) {
            const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');
            setConversionRate(parseFloat(savedConversionRate));
            setSymbol(savedSymbol);
          } else {
            const result = await convertCurrencyToCurrency('USD', userSettings.currency);
            setConversionRate(result);
        
            await AsyncStorage.setItem('conversionRate', result.toString());
            const newSymbol = getCurrencySymbol(userSettings.currency);
            setSymbol(newSymbol);
            await AsyncStorage.setItem('symbol', newSymbol);
          }
          
          setPrevCurrency(userSettings.currency);
        }
      } catch (error) {
        console.error('Error fetching user settings or converting currency:', error);
      }
    };
  
    fetchData();
  }, [userSettings.currency, prevCurrency]);

  const snapPoints = useMemo(() => ['33%', '66%', '85%'], []);

  const addTransactionHandler = async (newRecurringTransaction: any) => {
    try {
      await addDoc(collection(db, 'bills'), {
        ...newRecurringTransaction,
        uid: userId,
      });
      fetchRecurringTransactions();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const handleDeleteIconClick = (recurringTransactionId: string) => {
    setSelectedRecurringTransactionId(recurringTransactionId);
    setDeleteModalVisible(true);
  };

  const handleEditIconClick = (selectedRecurringTransaction: any) => {
    setSelectedRecurringTransaction(selectedRecurringTransaction);
    setEditModalVisible(true);
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

  const totalSubscriptions = recurringTransactions.length;
  const totalValue = recurringTransactions.reduce((acc, curr) => acc + parseInt(curr.value), 0);

  useEffect(() => {
    fetchRecurringTransactions();
    fetchUserSettings();
    fetchLanguage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.space}></View>

      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{languages[selectedLanguage].total}</Text>
          {loading ? (
                <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
              ) : (          
              <Text style={styles.totalSubscriptions}>
              {`${totalSubscriptions} ${totalSubscriptions !== 1 ? languages[selectedLanguage].bills : languages[selectedLanguage].bills}`}
              </Text>
          )}

        </View>
        {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
        ) : (
          <View style={styles.totalRow}>
            {conversionRate !== null ? (
                <Text style={styles.totalValue}> {userSettings.currency === 'HUF' ? 
                    Math.round(parseFloat(totalValue) * conversionRate) :
                    (parseFloat(totalValue) * conversionRate).toFixed(2)
                  } {symbol}
                </Text>
                ) : (
                  <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
                )}
          </View>
        )}

      </View>

      {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
        ) : (
      <FlatList
        data={recurringTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {

          const transactionDate = item.Date.toDate(); 
            const now = new Date();
            const isPastDate = transactionDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);

            return (

          <TouchableOpacity style={styles.transactionItem} onPress={() => handleEditIconClick(item)}>
            <View style={styles.transactionIcon}>
            <Image source={iconMapping[item.name]} style={styles.iconImage} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{languages[selectedLanguage][item.name]}</Text>
              <View style={styles.categoryDateContainer}>
                <Text style={[styles.transactionCategory, { color: '#888' }]}>                
                  {languages[selectedLanguage][item.category]}
                </Text>
                <View style={styles.separator} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.transactionDate, isPastDate ? styles.pastDateText : null]}>
                        {transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      {isPastDate && <Feather name="alert-circle" size={16} style={styles.warningIcon} />}
                </View>
              </View>
            </View>
            <View style={styles.transactionAmount}>
              {conversionRate !== null ? (
              <Text style={styles.transactionAmountValue}> {userSettings.currency === 'HUF' ? 
                  Math.round(parseFloat(item.value) * conversionRate) :
                  (parseFloat(item.value) * conversionRate).toFixed(2)
                } {symbol}
              </Text>
              ) : (
                <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
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
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>{languages[selectedLanguage].deleteBillModalText}</Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>{languages[selectedLanguage].no}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecurringTransactionHandler(selectedRecurringTransactionId!)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                <Text style={styles.deleteModalButtonText}>{languages[selectedLanguage].yes}</Text>
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
            style={styles.modalBackground}
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
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <RecurringBillsInput
                  initialRecurringTransaction={selectedRecurringTransaction}
                  onAddRecurringTransaction={editRecurringTransactionHandler}
                  conversionRate = {conversionRate}
                  currency = {userSettings.currency}
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
            style={styles.modalBackground}
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
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <RecurringBillsInput
                  onAddRecurringTransaction={addTransactionHandler}
                  conversionRate = {conversionRate}
                  currency = {userSettings.currency}
                  selectedLanguage= {selectedLanguage}
                  onClose={() => setModalVisible(false)}
                />
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>{languages[selectedLanguage].addBill}</Text>
      </TouchableOpacity>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    maxHeight: '65%',
    marginBottom: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20, 
    left: 21, 
    right: 21, 
    backgroundColor: '#35BA52',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  addIcon: {
    marginRight: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  space: {
    marginBottom: 20, 
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
    marginLeft: 16,
    marginRight: 16,
  },
  transactionIcon: {
    marginRight: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionDate: {
    color: '#888',
  },
  deleteIconContainer: {
    marginLeft: 8,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    overflow: 'hidden', 
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end', 
  },
  categoryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#7E8086',
    marginHorizontal: 8,
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
  editIconContainer: {
    marginLeft: 8,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
  },
  totalCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7E8086',
  },
  totalSubscriptions: {
    fontSize: 16,
    color: '#7E8086',
  },
  totalValue: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginTop: 200, 
  },
  pastDateText: {
    color: 'red',
  },
  warningIcon: {
    marginLeft: 5,
    color: 'red',
  },
});

export default Bills;
