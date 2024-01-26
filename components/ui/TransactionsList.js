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

const iconMapping = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),
  Housing: require('../../assets/Housing.png'),
  Transport: require('../../assets/Transport.png'),
  Sport: require('../../assets/Sport.png'),
};

const TransactionsList = () => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const handleDeleteIconClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setDeleteModalVisible(true);
  };

  const handleEditIconClick = (transaction) => {
    console.log("Clicked on edit icon",transaction.id )
    setSelectedTransaction(transaction);
    setEditModalVisible(true);  };


  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
      const querySnapshot = await getDocs(transactionsQuery);

      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const addTransactionHandler = async (newTransaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...newTransaction,
        uid: userId,
        // date: new Date(),
      });

      fetchTransactions();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  };


  const deleteTransactionHandler = async (transactionId) => {
    try {
      const docRef = doc(db, "transactions", transactionId);
      await deleteDoc(docRef);
  
      // Fetch transactions after deletion
      const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
      setTransactions(updatedTransactions);
  
      // Close the delete modal
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const editTransactionHandler = async (editedTransaction) => {
    try {
      const { id, ...editedData } = editedTransaction;
  
      const docRef = doc(db, 'transactions', id);
  
      await updateDoc(docRef, editedData);
  
      fetchTransactions();
  
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error editing transaction:', error.message);
      // Handle the error as needed
    }
  };
  
  
  
  useEffect(() => {
    fetchTransactions();
  }, [userId]);



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

  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  return (
    <View style={styles.container}>
      {/* Month Picker */}
      <DropDownPicker
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
        dropDownStyle={styles.dropDownStyle}
      />

      {/* Display Transactions */}
      <FlatList
        data={transactions
          .filter((transaction) => (selectedMonth === null ? true : transaction.date.toDate().getMonth() === selectedMonth))
          .sort((a, b) => b.date.toDate() - a.date.toDate())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Image source={iconMapping[item.category]} style={styles.iconImage} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionAmountText}>${item.value}</Text>
              <Text style={styles.transactionDate}>
                {item.date.toDate().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                {item.date.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEditIconClick(item)} style={styles.editIconContainer}>
              <Feather name="edit" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteIconClick(item.id)} style={styles.deleteIconContainer}>
              <Feather name="trash-2" size={20} color="#FF5733" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add a transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this transaction?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTransactionHandler(selectedTransactionId)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                <Text style={styles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
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
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
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
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconImage: {
    width: 24,
    height: 24,
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
});

export default TransactionsList;
