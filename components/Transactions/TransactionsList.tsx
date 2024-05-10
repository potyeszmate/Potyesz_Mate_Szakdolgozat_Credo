import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,  FlatList,Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import BottomSheet from '@gorhom/bottom-sheet';
import TransactionInput from './TransactionInput';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransactionsListParams {
  symbol: string;
  selectedLanguage: string;
  conversionRate: number;
  currency: string;
}

const iconMapping: any = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),
  Housing: require('../../assets/Housing.png'),
  Transport: require('../../assets/Transport.png'),
  Sport: require('../../assets/Sport.png'),
  Income: require('../../assets/incomeCategory.png'),

};

const months = [
  { label: 'Select a month', value: null },
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
];

const TransactionsList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<any | null>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<any | null>(null);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('monthly');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const route = useRoute<RouteProp<{ params: TransactionsListParams }>>();

  const { symbol, selectedLanguage, conversionRate, currency } = route.params || {}
  
  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      setTransactions(fetchedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const addTransactionHandler = async (newTransaction: any) => {
    try {
      console.log("IN addtransaction, ", newTransaction);
      // Add the new transaction
      await addDoc(collection(db, 'transactions'), {
        ...newTransaction,
        uid: userId,
      });

      // Query to find the income document based on uid
      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
      const querySnapshot = await getDocs(balanceQuery);

      if (!querySnapshot.empty) {
        const balanceDoc = querySnapshot.docs[0];  // Assuming there is only one income document per user
        const currentBalance = balanceDoc.data().balance;
        console.log("currentIncome", currentBalance)
        const updatedBalance = currentBalance - parseFloat(newTransaction.value);
        console.log("newTransaction.value", newTransaction.value)
        console.log("updatedIncome", updatedBalance)

        // Update the income document
        await updateDoc(balanceDoc.ref, { balance: updatedBalance });
      } else {
        console.log("No income record found for user!");
      }

      fetchData();
      await AsyncStorage.setItem('transactionsChanged', 'true');
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      setModalVisible(false);
    }
  };



  const deleteTransactionHandler = async (transactionId: string | null) => {
    try {
      if (!transactionId) return;

      const docRef = doc(db, 'transactions', transactionId);
      await deleteDoc(docRef);

      const updatedTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactionsChanged', 'true');
      setDeleteModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const editTransactionHandler = async (editedTransaction: any) => {

    try {
      const { id, ...editedData } = editedTransaction;
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, editedData);
      fetchData();
      await AsyncStorage.setItem('transactionsChanged', 'true');
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
      setEditModalVisible(false);
    }
  };


  const fetchIncomes = async () => {
    try {
      const transactionsQuery = query(collection(db, 'incomes'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      setIncomes(fetchedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const addIncomesHandler = async (newIncome: any) => {
    try {
      // Add the new income record
      await addDoc(collection(db, 'incomes'), {
        ...newIncome,
        category: "Income",
        uid: userId,
      });

      // Query to find the balance document based on uid
      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
      const querySnapshot = await getDocs(balanceQuery);

      if (!querySnapshot.empty) {
        const balanceDoc = querySnapshot.docs[0];  // Assuming there is only one balance document per user
        const currentBalance = balanceDoc.data().balance;
        const updatedBalance = currentBalance + parseFloat(newIncome.value);

        // Update the balance document
        await updateDoc(balanceDoc.ref, { balance: updatedBalance });
      } else {
        console.log("No balance record found for user!");
      }

      fetchData();
      await AsyncStorage.setItem('incomesChanged', 'true');
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding income:', error.message);
      setModalVisible(false);
    }
  };



  const deleteIncomesHandler = async (transactionId: string | null) => {
    try {
      if (!transactionId) return;

      const docRef = doc(db, 'incomes', transactionId);
      await deleteDoc(docRef);

      const updatedTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
      setIncomes(updatedTransactions);
      await AsyncStorage.setItem('incomesChanged', 'true');
      setDeleteModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const editIncomesHandler = async (editedTransaction: any) => {

    try {
      const { id, ...editedData } = editedTransaction;
      const docRef = doc(db, 'incomes', id);
      await updateDoc(docRef, editedData);
      fetchData();
      await AsyncStorage.setItem('incomesChanged', 'true');
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
      setEditModalVisible(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const incomesQuery = query(collection(db, 'incomes'), where('uid', '==', userId));
  
      const [transactionsSnapshot, incomesSnapshot] = await Promise.all([
        getDocs(transactionsQuery),
        getDocs(incomesQuery)
      ]);
  
      const fetchedTransactions = transactionsSnapshot.docs.map(doc => ({
        type: 'transaction', // Additional field to distinguish between transactions and incomes
        id: doc.id,
        ...doc.data()
      }));
  
      const fetchedIncomes = incomesSnapshot.docs.map(doc => ({
        type: 'income', // Additional field to distinguish between transactions and incomes
        id: doc.id,
        ...doc.data()
      }));
  
      // Combine and set the data
      setData([...fetchedTransactions, ...fetchedIncomes]);
      setIsLoading(false);

    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      setIsLoading(false);

    }
  };

  useEffect(() => {
    fetchData()
    // fetchTransactions();
    // fetchIncomes()
  }, []);



  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  const handleDeleteIconClick = (transactionId: any | null) => {
    setSelectedTransactionId(transactionId);
    setDeleteModalVisible(true);
  };

  const handleEditIconClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setEditModalVisible(true);
  };

  const handleFilterChange = (newFilterType: any) => {
    setFilterType(newFilterType);
    setFilterModalVisible(false);
  };

  const navigateDate = (direction: any) => {
    const newDate = new Date(currentDate);
    switch (filterType) {
      case 'monthly':
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
      case 'weekly':
        newDate.setDate(currentDate.getDate() + (7 * direction));
        break;
      case 'yearly':
        newDate.setFullYear(currentDate.getFullYear() + direction);
        break;
      default:
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDateDisplay = () => {
    switch (filterType) {
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'weekly':
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
      case 'yearly':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  //
  const groupTransactionsByDate = () => {
    const grouped = data.reduce((acc, transaction) => {
      const transactionDate = transaction.date.toDate(); // Assuming `date` is a Firestore Timestamp or similar
      // Use ISO string for key to ensure consistent formatting
      const key = transactionDate.toISOString().split('T')[0]; // This will give a format like '2024-04-19'
  
      if (filterType === 'monthly' && transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()) {
        acc[key] = acc[key] || [];
        acc[key].push(transaction);
      } else if (filterType === 'weekly') {
        let startWeek = new Date(currentDate);
        startWeek.setDate(startWeek.getDate() - startWeek.getDay());
        let endWeek = new Date(startWeek);
        endWeek.setDate(endWeek.getDate() + 6);
        if (transactionDate >= startWeek && transactionDate <= endWeek) {
          acc[key] = acc[key] || [];
          acc[key].push(transaction);
        }
      } else if (filterType === 'yearly' && transactionDate.getFullYear() === currentDate.getFullYear()) {
        acc[key] = acc[key] || [];
        acc[key].push(transaction);
      }
      return acc;
    }, {});
  
    // Convert to array and sort
    return Object.keys(grouped)
      .map(date => ({
        date,
        transactions: grouped[date]
      }))
      // Sorting by ISO date string ensures chronological order
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  useEffect(() => {
    setGroupedTransactions(groupTransactionsByDate());
  }, [transactions, currentDate, filterType]);
  

// In your render
if (isLoading) {
  return <Text>Loading...</Text>; // Or any other loading indicator
}

  return (
    <View style={styles.container}>
     

    <View style={styles.filterBar}>
      <TouchableOpacity onPress={() => navigateDate(-1)}>
        <Feather name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
        <Text style={styles.dateDisplay}>{formatDateDisplay()}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateDate(1)}>
        <Feather name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    </View>

    <FlatList
      data={groupedTransactions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.groupedTransactionCard}>
          {/* Convert the ISO date format to a more friendly format at the point of rendering */}
          <Text style={styles.dateHeader}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
          {item.transactions.map((transaction, index) => (
            <View key={transaction.id}>
              <TouchableOpacity key={transaction.id} style={styles.transactionCard} onPress={() => handleEditIconClick(transaction)}>
                <View style={styles.transactionIcon}>
                  <Image source={iconMapping[transaction.category]} style={styles.iconImage} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.transactionAmountText, 
                                transaction.category === "Income" ? {color: 'green'} : {color: 'red'}]}>
                    {transaction.category === "Income" ? 
                      `${(parseFloat(transaction.value) * conversionRate).toFixed(2)} ${symbol}` :
                      `- ${(parseFloat(transaction.value) * conversionRate).toFixed(2)} ${symbol}`}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</Text>
                </View>
                {index < item.transactions.length - 1 && <View style={styles.separator} />}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    />



      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add a transaction</Text>
        </TouchableOpacity>
      </View>

       <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}  
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Choose Filtering</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleFilterChange('monthly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('weekly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('yearly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Yearly</Text>
          </TouchableOpacity>
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
            setEditModalVisible(false);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <TransactionInput
                initialTransaction={selectedTransaction}
                onAddTransaction={editTransactionHandler}
                onAddIncomes={editIncomesHandler}
                selectedLanguage={selectedLanguage}
                onClose={() => setEditModalVisible(false)}
                currency={currency}
                onDeleteRecurringTransaction={deleteTransactionHandler}
                onDeleteIncome={deleteIncomesHandler}
                conversionRate={conversionRate}
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
            setModalVisible(false);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
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
              <TransactionInput
                onAddTransaction={addTransactionHandler}
                onAddIncomes={addIncomesHandler}
                selectedLanguage={selectedLanguage}
                onClose={() => setModalVisible(false)}
                currency={currency}
                onDeleteRecurringTransaction={deleteTransactionHandler}
                onDeleteIncome={deleteIncomesHandler}
                conversionRate={conversionRate}
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
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  closeButton: {
    padding: 10,  
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 8, 
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 140
  },
  transactionDate: {
    color: '#888',
  },
  transactionAmount: {
    width: 180, 
    alignItems: 'flex-end',
  },
  transactionCategory: {
    fontSize: 16,
    color: '#888',
    width: 200
  },
  transactionAmountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A1A2C',
    marginBottom: 2
  },
  editIconContainer: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
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
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconImage: {
    width: 35,
    height: 35,
  },
  deleteIconContainer: {
    marginLeft: 8,
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
  groupedTransactionCard: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 3,
    marginVertical: 8,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', 
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dateDisplay: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 20,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 18,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,  
  },

});

export default TransactionsList;
