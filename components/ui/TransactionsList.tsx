// TransactionsList.js
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,  FlatList,Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import BottomSheet from '@gorhom/bottom-sheet';
// import GoalInput from './TransactionsInput';
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
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<any | null>(null);
  const [groupedTransactions, setGroupedTransactions] = useState([]);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('monthly'); // 'monthly', 'weekly', 'yearly'
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
    console.log("newTransaction in add: ",newTransaction)
    try {
      await addDoc(collection(db, 'transactions'), {
        ...newTransaction,
        uid: userId,
      });

      fetchTransactions();
      //set trigger so last transactions cna be fetched as well.
      await AsyncStorage.setItem('transactionsChanged', 'true');
      console.log("ADDED NEW TRANSACTION")

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
      console.log("ADDED NEW TRANSACTION")
      setDeleteModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const editTransactionHandler = async (editedTransaction: any) => {
    console.log("editedTransaction in edit: ",editedTransaction)

    try {
      const { id, ...editedData } = editedTransaction;
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, editedData);
      fetchTransactions();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
      setEditModalVisible(false);
    }
  };

  // const groupTransactionsByDate = (transactions: any) => {
  //   const grouped: any = {};
  
  //   transactions.forEach((transaction: any) => {
  //     const dateObj = transaction.date.toDate();
  //     const dateStr = `${dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`; // "April 10."
  //     if (!grouped[dateStr]) {
  //       grouped[dateStr] = [];
  //     }
  //     grouped[dateStr].push(transaction);
  //   });
  
  //   return Object.keys(grouped).map((date) => ({
  //     date,
  //     transactions: grouped[date]
  //   }));
  // };
  
  //Not in userId change
  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // useEffect(() => {
  //   const groupedTransactions = groupTransactionsByDate(transactions);
  //   setGroupedTransactions(groupedTransactions);
  // }, [transactions, currentDate, filterType]);  // Make sure to recompute when these values change
  

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

  // Format date for display in the filter bar
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

  const groupTransactionsByDate = () => {
    const grouped = transactions.reduce((acc, transaction) => {
      const transactionDate = transaction.date.toDate();
      let key = transactionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + '.';  //, year: 'numeric'
      
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
    
    return Object.keys(grouped).map(date => ({ date, transactions: grouped[date] }));
  };
  
  useEffect(() => {
    setGroupedTransactions(groupTransactionsByDate());
  }, [transactions, currentDate, filterType]);
  
  // const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);


  return (
    <View style={styles.container}>
      {/* Month Picker */}
      {/* <DropDownPicker
        open={open}
        value={selectedMonth}
        items={months}
        setOpen={setOpen}
        setValue={(value) => {
          setSelectedMonth(value);
          setOpen(false);
        }}
        setItems={() => {}}
        style={styles.pickerContainer}
        containerStyle={styles.pickerContainer}
        placeholder="Select a month"
        // dropDownStyle={styles.dropDownStyle}
      /> */}

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
            <Text style={styles.dateHeader}>{item.date}</Text>
            {item.transactions.map((transaction: any, index: any) => (
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
                    <Text style={styles.transactionAmountText}>
                      {currency === 'HUF' ? 
                    Math.round(parseFloat(transaction.value) * conversionRate) :
                    (parseFloat(transaction.value) * conversionRate).toFixed(2)
                  } {symbol}</Text>
                    <Text style={styles.transactionDate}>{transaction.date.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</Text>
                  </View>
                  {index < item.transactions.length - 1 && <View style={styles.separator} />}
                </TouchableOpacity>

                {index < item.transactions.length - 1 && <View style={styles.separator} />} 
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
        onRequestClose={() => setFilterModalVisible(false)}  // This allows pressing the hardware back button on Android to close the modal.
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
              console.log('BottomSheet closed');
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
                selectedLanguage={selectedLanguage}
                onClose={() => setEditModalVisible(false)}
                currency={currency}
                onDeleteRecurringTransaction={deleteTransactionHandler}
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
              console.log('BottomSheet closed');
              setModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <TransactionInput
                onAddTransaction={addTransactionHandler}
                selectedLanguage={selectedLanguage}
                onClose={() => setModalVisible(false)}
                currency={currency}
                onDeleteRecurringTransaction={deleteTransactionHandler}
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
  // transactionCard: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   backgroundColor: '#EDEDED',
  //   borderRadius: 8,
  //   padding: 16,
  //   marginVertical: 8,
  // },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 16,

  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  closeButton: {
    padding: 10,  // Padding makes it easier to tap
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 8, // ensures spacing between name/category and amount/time
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionDate: {
    color: '#888',
  },
  transactionAmount: {
    width: 80, // fixed width to ensure alignment, adjust as needed
    alignItems: 'flex-end',
  },
  transactionCategory: {
    fontSize: 16,
    color: '#888',
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#FFFFFF', // White background for the cards
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
    elevation: 4, // Elevation for Android
    borderWidth: 1, // Optional: If you want a border
    borderColor: '#E0E0E0', // Light grey border
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 3,
    // marginRight: 16,
    marginVertical: 8,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', // Dark grey for better readability
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
    elevation: 5,  // For Android
  },
  // dateDisplay: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginHorizontal: 20,
  // },
});

export default TransactionsList;
