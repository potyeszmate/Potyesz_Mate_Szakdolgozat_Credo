import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../firebaseConfig';
import BudgetDetailsSummaryCard from './BudgetDetailSummaryCard';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import SpendingBudgetChart from '../Charts/SpendingBudgetChart';
import SpendingHistoryBudgetsBarChart from '../Charts/SpendingHistoryBudgetsBarChart';

const BudgetDetails = ({ route,  }) => {
  const { budgetId, conversionRate, symbol } = route.params; 

  const [budget, setBudget] = useState<any | null>(null);
  const [spentPercentage, setSpentPercentage] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const budgetDocRef = doc(db, 'budgets', budgetId);
        const budgetDocSnapshot = await getDoc(budgetDocRef);
        if (budgetDocSnapshot.exists()) {
          const fetchedBudget = budgetDocSnapshot.data();
          setBudget(fetchedBudget)
          const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            
                    const transactionsQuery = query(
                      collection(db, 'transactions'),
                      where('category', '==', fetchedBudget.Category),
                      where('date', '>=', currentMonthStart),
                      where('date', '<=', currentMonthEnd)
                    );
            
                    const transactionsSnapshot = await getDocs(transactionsQuery);
                    const transactionsData: any = transactionsSnapshot.docs.map(doc => doc.data());

                    setFilteredData(transactionsData)

                    const totalAmount = fetchedBudget.Total_ammount;
                    const spentAmount = transactionsData.reduce((acc: any, transaction: any) => acc + parseFloat(transaction.value), 0);
                    const spentPercentage = (spentAmount / totalAmount) * 100;
                    const remainingAmount = totalAmount - spentAmount;
            
                    setSpentAmount(spentAmount);
                    setSpentPercentage(spentPercentage);
                    setRemainingAmount(remainingAmount);
        } else {
          console.error('Budget document not found');
        }
      } catch (error: any) {
        console.error('Error fetching budget details:', error.message);
      }
    };
  
    fetchBudgetDetails();
  }, [budgetId]);
  

  const handleEditPress = () => {
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F7' }}>
      <Text style={styles.titleStyle}>{budget && budget.Category}</Text>
      {budget && (
        <BudgetDetailsSummaryCard
          currentMonth={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          totalAmount={budget.Total_ammount}
          spentPercentage={spentPercentage}
          spentAmount={spentAmount}
          remainingAmount={remainingAmount}
          onEditPress={handleEditPress}
          conversionRate={conversionRate}
          symbol={symbol}

        />
      )}

    {budget && (
        <SpendingBudgetChart transactions={filteredData} totalAmount={budget.Total_ammount} conversionRate={conversionRate} symbol={symbol} />
    )}

    {budget && (
        <SpendingHistoryBudgetsBarChart budgetId={budgetId} category={budget.Category} conversionRate={conversionRate} symbol={symbol} />
    )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'center',
    fontWeight: 'bold',  
    fontSize: 20,        
    marginVertical: 10, 
    color: '#333',      
  },
});


export default BudgetDetails;
