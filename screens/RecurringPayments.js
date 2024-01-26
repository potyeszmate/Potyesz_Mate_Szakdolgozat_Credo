/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { db } from '../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import RecurringTransactionInput from '../components/ui/RecurringTransactionInput';

const iconMapping = {
  twitter: require('../assets/Recurrings/twitter.png'),
  youtube: require('../assets/Recurrings/youtube.png'),
  linkedIn: require('../assets/Recurrings/linkedin.png'),
  wordpress: require('../assets/Recurrings/wordpress.png'),
  pinterest: require('../assets/Recurrings/pinterest.png'),
  figma: require('../assets/Recurrings/figma.png'),
  behance: require('../assets/Recurrings/behance.png'),
  apple: require('../assets/Recurrings/apple.png'),
  googlePlay: require('../assets/Recurrings/google-play.png'),
  google: require('../assets/Recurrings/google.png'),
  appStore: require('../assets/Recurrings/app-store.png'),
  github: require('../assets/Recurrings/github.png'),
  xbox: require('../assets/Recurrings/xbox.png'),
  discord: require('../assets/Recurrings/discord.png'),
  stripe: require('../assets/Recurrings/stripe.png'),
  spotify: require('../assets/Recurrings/spotify.png'),
};

const RecurringPayments = () => {

  const navigation = useNavigation();
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const bottomSheetRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState(null);
  const [selectedRecurringTransactionId, setSelectedRecurringTransactionId] = useState(null);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  const fetchRecurringTransactions = async () => {
    try {
      const recurringTransactionsQuery = query(
        collection(db, 'recurring_payments'),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(recurringTransactionsQuery);


      const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

      setRecurringTransactions(fetchedRecurringTransactions);
      console.log("Fetched fetchedRecurringTransactions: ",fetchedRecurringTransactions )
    } catch (error) {
      console.error('Error fetching recurring transactions:', error.message);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, [userId]);

  const snapPoints = useMemo(() => ['33%', '66%', '85%'], []);

  const addTransactionHandler = async (newRecurringTransaction) => {
    try {
      await addDoc(collection(db, 'recurring_payments'), {
        ...newRecurringTransaction,
        uid: userId,
      });

      fetchRecurringTransactions();
      setModalVisible(false); // Close the modal after adding a transaction
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const handleDeleteIconClick = (recurringTransactionId) => {
    setSelectedRecurringTransactionId(recurringTransactionId);
    setDeleteModalVisible(true);
  };

  const handleEditIconClick = (selectedRecurringTransaction) => {
    console.log("Clicked on edit icon",selectedRecurringTransaction.id )
    console.log("Adding this to edit ",selectedRecurringTransaction )

    setSelectedRecurringTransaction(selectedRecurringTransaction);
    setEditModalVisible(true);
  };


  const deleteRecurringTransactionHandler = async (recurringTransactionId) => {
    try {
      const docRef = doc(db, 'recurring_payments', recurringTransactionId);
      await deleteDoc(docRef);

      fetchRecurringTransactions();
      // const updatedRecurringTransactions = recurringTransactions.filter(recurringTransactions => recurringTransactions.id !== recurringTransactionId);
      // setRecurringTransactions(updatedRecurringTransactions);

      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting recurring transaction:', error.message);
    }
  };

  const editRecurringTransactionHandler = async (editedRecurringTransaction) => {
    try {
      const { id, ...editedData } = editedRecurringTransaction;
  
      console.log("Editing this data: ", editedRecurringTransaction);
      const docRef = doc(db, 'recurring_payments', id);
  
      await updateDoc(docRef, editedData);
  
      fetchRecurringTransactions();
  
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error editing transaction:', error.message);
      // Handle the error as needed
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={recurringTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Image source={iconMapping[item.name.toLowerCase()]} style={styles.iconImage} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={[styles.transactionCategory, { color: '#888' }]}>{item.category}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionAmountValue}>${parseInt(item.value)}</Text>
              <Text style={styles.transactionDate}>
                {item.Date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEditIconClick(item)} style={styles.editIconContainer}>
              <Feather name="edit" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteIconClick(item.id)} style={styles.deleteIconContainer}>
              <Feather name="trash-2" size={20} color="#FF5733" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add Payment</Text>
      </TouchableOpacity>
        
      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this recurring transaction?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecurringTransactionHandler(selectedRecurringTransactionId)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
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
          // onPress={() => setEditModalVisible(false)}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('Edit BottomSheet closed');
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <RecurringTransactionInput
                initialRecurringTransaction={selectedRecurringTransaction}
                onAddRecurringTransaction={editRecurringTransactionHandler}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
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
              <RecurringTransactionInput
                onAddRecurringTransaction={addTransactionHandler}
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
    padding: 16,
  },
  addButton: {
    backgroundColor: '#1A1A2C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
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
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  transactionIcon: {
    marginRight: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
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
});

export default RecurringPayments;
