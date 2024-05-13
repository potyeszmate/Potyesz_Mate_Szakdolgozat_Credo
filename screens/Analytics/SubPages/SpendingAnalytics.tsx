import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { AuthContext } from "../../../store/auth-context";
import DonutChart from "../../../components/Charts/DonutChart";
import DateLineChart from "../../../components/Charts/DateLineChart";
import BarChartSpending from "../../../components/Charts/BarchartSpending";
import { Transaction } from "../../Home/HomeTypes";
import { useRoute } from "@react-navigation/native";
import { SpendingAnalyticsStyles } from "../AnalyticsScreenStyles";

const SpendingAnalytics = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterType, setFilterType] = useState('monthly');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const route = useRoute();
    const { symbol, selectedLanguage, conversionRate } = route.params || {}

    console.log(route.params)

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;
    
    const fetchTransactions = async () => {
     
        try {
          setIsLoading(true);

          let transactionsCount = 0
          transactionsCount++
    
          console.log("transaction fetching, count: ", transactionsCount)

          const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
          const querySnapshot = await getDocs(transactionsQuery);
          const fetchedTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as any[];
    
          setTransactions(fetchedTransactions as any);

        } catch (error: any) {
          console.error('Error fetching transactions:', error.message);
          setIsLoading(false); 

        }
        setIsLoading(false); 

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
      
    const memoizedFilteredTransactions = useMemo(() => filterTransactionsByDate(), [transactions, currentDate, filterType]);


      useEffect(() => {
        fetchTransactions();
      }, [userId, filterType, currentDate]);
      
    
    return (
    <View> 
        <View style={SpendingAnalyticsStyles.filterBar}>
            <TouchableOpacity onPress={() => navigateDate(-1)}>
                <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                <Text style={SpendingAnalyticsStyles.dateDisplay}>{formatDateDisplay()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateDate(1)}>
                <Feather name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <ScrollView >
            <DonutChart data={memoizedFilteredTransactions} symbol={symbol} selectedLanguage={selectedLanguage} conversionRate={conversionRate} />
            <BarChartSpending data={memoizedFilteredTransactions} symbol={symbol} selectedLanguage={selectedLanguage} conversionRate={conversionRate} />
        </ScrollView>

        <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
        >
        <View style={SpendingAnalyticsStyles.modalContent}>
        <View style={SpendingAnalyticsStyles.modalHeader}>
            <Text style={SpendingAnalyticsStyles.modalHeaderText}>Choose Filtering</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={SpendingAnalyticsStyles.closeButton}>
                <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleFilterChange('monthly')} style={SpendingAnalyticsStyles.modalOption}>
            <Text style={SpendingAnalyticsStyles.modalOptionText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('weekly')} style={SpendingAnalyticsStyles.modalOption}>
            <Text style={SpendingAnalyticsStyles.modalOptionText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('yearly')} style={SpendingAnalyticsStyles.modalOption}>
            <Text style={SpendingAnalyticsStyles.modalOptionText}>Yearly</Text>
        </TouchableOpacity>
        </View>
        </Modal>
    </View>
    );
};

export default SpendingAnalytics;


