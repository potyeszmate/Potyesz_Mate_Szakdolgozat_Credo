import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,  FlatList,Pressable, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import BottomSheet from '@gorhom/bottom-sheet';
import TransactionInput from './TransactionInput';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionsListStyles } from './TransactionComponentStyles';

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
  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  const checkAndCompleteFirstBigSpendingChallenge = async () => {
    console.log("in checkAndCompleteFirstBigSpendingChallenge ")
    const challengeName = "First big spending";

    const joinedChallengesQuery = query(
        collection(db, 'joinedChallenges'),
        where('uid', '==', userId),
        where('name', '==', challengeName),
        where('isActive', '==', true)
    );

    const challengeSnapshot = await getDocs(joinedChallengesQuery);
    const challengeDoc = challengeSnapshot.docs[0];
    const challenge = challengeDoc.data();

    const challengeEndDate = new Date(challenge.joinedDate.toDate().getTime() + challenge.durationInWeek * 7 * 24 * 60 * 60 * 1000);

    if (challengeEndDate >= new Date()) {  

      if (!challengeSnapshot.empty) {
          const challengeDoc = challengeSnapshot.docs[0];
          await updateDoc(challengeDoc.ref, { isActive: false });

          console.log("There is a challenge saved")

          const pointsQuery = query(collection(db, 'points'), where('uid', '==', userId));
          const pointsSnapshot = await getDocs(pointsQuery);

          if (!pointsSnapshot.empty) {
              const pointsDoc = pointsSnapshot.docs[0];
              const currentPoints = pointsDoc.data().score;
              const newPoints = currentPoints + 60;
              console.log("newPoints: ", newPoints)

              await updateDoc(pointsDoc.ref, { score: newPoints });
              console.log("Points updated for First Big Spending: ", newPoints);
          } else {
              console.log("No points document found for user:", userId);
              const pointsRef = doc(collection(db, 'points'));
              await setDoc(pointsRef, { uid: userId, score: 60 });
              console.log("Points document created for First Big Spending.");
          }

          Alert.alert(
            " 🎉 Challenge Complete 🎉",
            "Congratulations! You've completed the First Big Spending challenge and earned 60 points!",
            [
              {
                text: "OK",
                onPress: () => console.log("First Big Spending Challenge Completion Acknowledged"),
                style: "cancel"
              }
            ],
            { cancelable: false }
          );
      } else {
          console.log("No active 'First big spending' challenge found or criteria not met.");
      }
    }
    else {
      console.log("Challenge criteria not met or challenge expired.");
  }
  };

  const addTransactionHandler = async (newTransaction: any) => {
    try {
      console.log("IN addtransaction, ", newTransaction);
      await addDoc(collection(db, 'transactions'), {
        ...newTransaction,
        uid: userId,
      });

      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
      const querySnapshot = await getDocs(balanceQuery);

      if (!querySnapshot.empty) {
        const balanceDoc = querySnapshot.docs[0]; 
        const currentBalance = balanceDoc.data().balance;
        console.log("currentIncome", currentBalance)
        const updatedBalance = currentBalance - parseFloat(newTransaction.value);
        console.log("newTransaction.value", newTransaction.value)
        console.log("updatedIncome", updatedBalance)

        await updateDoc(balanceDoc.ref, { balance: updatedBalance });

      } else {
        console.log("No balance record found for user!");
      }

      fetchData();
      await AsyncStorage.setItem('transactionsChanged', 'true');
      setModalVisible(false);

      if (parseFloat(newTransaction.value) > 99) {
        await checkAndCompleteFirstBigSpendingChallenge();
      }
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

  const addIncomesHandler = async (newIncome: any) => {
    try {
      await addDoc(collection(db, 'incomes'), {
        ...newIncome,
        category: "Income",
        uid: userId,
      });

      const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
      const querySnapshot = await getDocs(balanceQuery);

      if (!querySnapshot.empty) {
        const balanceDoc = querySnapshot.docs[0]; 
        const currentBalance = balanceDoc.data().balance;
        const updatedBalance = currentBalance + parseFloat(newIncome.value);

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
        type: 'transaction',
        id: doc.id,
        ...doc.data()
      }));
  
      const fetchedIncomes = incomesSnapshot.docs.map(doc => ({
        type: 'income', 
        id: doc.id,
        ...doc.data()
      }));
  
      setData([...fetchedTransactions, ...fetchedIncomes]);
      setIsLoading(false);

    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      setIsLoading(false);

    }
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

  const groupTransactionsByDate = () => {
    const grouped = data.reduce((acc, transaction) => {
      const transactionDate = transaction.date.toDate(); 
      const key = transactionDate.toISOString().split('T')[0]; 
  
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
  
    return Object.keys(grouped)
      .map(date => ({
        date,
        transactions: grouped[date]
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    setGroupedTransactions(groupTransactionsByDate());
  }, [transactions, currentDate, filterType]);
  

if (isLoading) {
  return <Text>Loading...</Text>; 
}

  return (
    <View style={TransactionsListStyles.container}>
     

    <View style={TransactionsListStyles.filterBar}>
      <TouchableOpacity onPress={() => navigateDate(-1)}>
        <Feather name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
        <Text style={TransactionsListStyles.dateDisplay}>{formatDateDisplay()}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateDate(1)}>
        <Feather name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    </View>

    <FlatList
      data={groupedTransactions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={TransactionsListStyles.groupedTransactionCard}>
          <Text style={TransactionsListStyles.dateHeader}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
          {item.transactions.map((transaction, index) => (
            <View key={transaction.id}>
              <TouchableOpacity key={transaction.id} style={TransactionsListStyles.transactionCard} onPress={() => handleEditIconClick(transaction)}>
                <View style={TransactionsListStyles.transactionIcon}>
                  <Image source={iconMapping[transaction.category]} style={TransactionsListStyles.iconImage} />
                </View>
                <View style={TransactionsListStyles.transactionInfo}>
                  <Text style={TransactionsListStyles.transactionName}>{transaction.name}</Text>
                  <Text style={TransactionsListStyles.transactionCategory}>{transaction.category}</Text>
                </View>
                <View style={TransactionsListStyles.transactionAmount}>
                  <Text style={[TransactionsListStyles.transactionAmountText, 
                                transaction.category === "Income" ? {color: 'green'} : {color: 'red'}]}>
                    {transaction.category === "Income" ? 
                      `${(parseFloat(transaction.value) * conversionRate).toFixed(2)} ${symbol}` :
                      `- ${(parseFloat(transaction.value) * conversionRate).toFixed(2)} ${symbol}`}
                  </Text>
                  <Text style={TransactionsListStyles.transactionDate}>{transaction.date.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</Text>
                </View>
                {index < item.transactions.length - 1 && <View style={TransactionsListStyles.separator} />}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    />
    <View style={TransactionsListStyles.addButtonContainer}>
        <TouchableOpacity style={TransactionsListStyles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" style={TransactionsListStyles.addIcon} />
          <Text style={TransactionsListStyles.addButtonText}>Add a transaction</Text>
        </TouchableOpacity>
    </View>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}  
      >
      <View style={TransactionsListStyles.modalContent}>
          <View style={TransactionsListStyles.modalHeader}>
            <Text style={TransactionsListStyles.modalHeaderText}>Choose Filtering</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={TransactionsListStyles.closeButton}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleFilterChange('monthly')} style={TransactionsListStyles.modalOption}>
            <Text style={TransactionsListStyles.modalOptionText}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('weekly')} style={TransactionsListStyles.modalOption}>
            <Text style={TransactionsListStyles.modalOptionText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('yearly')} style={TransactionsListStyles.modalOption}>
            <Text style={TransactionsListStyles.modalOptionText}>Yearly</Text>
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
          style={TransactionsListStyles.modalBackground}
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
              <View style={[style, TransactionsListStyles.bottomSheetBackground]} />
            )}
          >
            <View style={TransactionsListStyles.contentContainer}>
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
          style={TransactionsListStyles.modalBackground}
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
              <View style={[style, TransactionsListStyles.bottomSheetBackground]} />
            )}
          >
            <View style={TransactionsListStyles.contentContainer}>
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

export default TransactionsList;
