import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { AuthContext } from "../../../store/auth-context";
import CashFlowSummary from "../../../components/Analytics/CashFlowSummary";
import { BalanceAnalyticsStyles } from "../AnalyticsScreenStyles";

const BalanceAnalytics = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterType, setFilterType] = useState('monthly');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [incomes, setIncomes] = useState<any[]>([]);
    const [balance, setBalance] = useState<any>({});

    const [isLoading, setIsLoading] = useState(true);

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;

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

    const fetchTransactions = async () => {
        try {
          const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
          const querySnapshot = await getDocs(transactionsQuery);
          const fetchedTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            type: 'expense',
            ...doc.data(),
          })) as any[];
    
          setTransactions(fetchedTransactions);
        } catch (error: any) {
          console.error('Error fetching transactions:', error.message);
        }
    };

    const fetchBalance = async () => {
        const balanceQuery = query(collection(db, 'balance'), where('uid', '==', userId));
        const querySnapshot = await getDocs(balanceQuery);
        const balanceData = querySnapshot.docs[0]?.data();
        if (balanceData) {
            setBalance(balanceData.ammount); 
        }
      };

    const fetchIncomes = async () => {
        try {
          const incomeQuery = query(collection(db, 'incomes'), where('uid', '==', userId));
          const querySnapshot = await getDocs(incomeQuery);
          const fetchedIcomes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            type: 'income',
            ...doc.data(),
          })) as any[];
    
          setIncomes(fetchedIcomes);
        } catch (error: any) {
          console.error('Error fetching incomes:', error.message);
        }
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

    const handleFilterChange = (newFilterType: any) => {
        setFilterType(newFilterType);
        setFilterModalVisible(false);
    };

    const filterTransactionsByDate = () => {
        let filteredTransactions = transactions;
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
      
        if (filterType === 'monthly') {
          filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date.seconds * 1000); 
            return transactionDate.getMonth() === currentDate.getMonth() &&
                   transactionDate.getFullYear() === currentDate.getFullYear();
          });
        } else if (filterType === 'weekly') {
          filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date.seconds * 1000);
            return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
          });
        } else if (filterType === 'yearly') {
          filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date.seconds * 1000); 
            return transactionDate.getFullYear() === currentDate.getFullYear();
          });
        }
        
        return filteredTransactions || [];
    };

    const filterIncomesByDate = () => {
        let filteredIncomes = incomes;
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
      
        if (filterType === 'monthly') {
            filteredIncomes = incomes.filter((income) => {
            const incomeDate = new Date(income.date.seconds * 1000);
            return incomeDate.getMonth() === currentDate.getMonth() &&
            incomeDate.getFullYear() === currentDate.getFullYear();
          });
        } else if (filterType === 'weekly') {
            filteredIncomes = incomes.filter((income) => {
            const incomeDate = new Date(income.date.seconds * 1000);
            return incomeDate >= startOfWeek && incomeDate <= endOfWeek;
          });
        } else if (filterType === 'yearly') {
            filteredIncomes = incomes.filter((income) => {
            const incomeDate = new Date(income.date.seconds * 1000);
            return incomeDate.getFullYear() === currentDate.getFullYear();
          });
        }
        
        return filteredIncomes || [];
    };
         
    const memoizedFilteredTransactions = useMemo(() => filterTransactionsByDate(), [transactions, currentDate, filterType]);
    const memoizedIncomeTransactions = useMemo(() => filterIncomesByDate(), [incomes, currentDate, filterType]);
 
      
      useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); 
            await Promise.all([fetchTransactions(), fetchIncomes(), fetchBalance()]);
            setIsLoading(false); 
          };
          
        fetchData();
      }, [userId, filterType])

      if (isLoading) {
        return (
          <View style={BalanceAnalyticsStyles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    
      
    return (
        <View> 
            <View> 
                <View style={BalanceAnalyticsStyles.filterBar}>
                <TouchableOpacity onPress={() => navigateDate(-1)}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                    <Text style={BalanceAnalyticsStyles.dateDisplay}>{formatDateDisplay()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateDate(1)}>
                    <Feather name="chevron-right" size={24} color="black" />
                </TouchableOpacity>
            </View>
            </View>

            <ScrollView >
            </ScrollView>

            <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
                >
                <View style={BalanceAnalyticsStyles.modalContent}>
                <View style={BalanceAnalyticsStyles.modalHeader}>
                    <Text style={BalanceAnalyticsStyles.modalHeaderText}>Choose Filtering</Text>
                    <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={BalanceAnalyticsStyles.closeButton}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleFilterChange('monthly')} style={BalanceAnalyticsStyles.modalOption}>
                    <Text style={BalanceAnalyticsStyles.modalOptionText}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterChange('weekly')} style={BalanceAnalyticsStyles.modalOption}>
                    <Text style={BalanceAnalyticsStyles.modalOptionText}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilterChange('yearly')} style={BalanceAnalyticsStyles.modalOption}>
                    <Text style={BalanceAnalyticsStyles.modalOptionText}>Yearly</Text>
                </TouchableOpacity>
                </View>
            </Modal>
        </View>

    );
};

export default BalanceAnalytics;
