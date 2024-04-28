import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import BudgetDetailsSummaryCard from './BudgetDetailSummaryCard';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import SpendingBudgetChart from './SpendingBudgetChart';
import SpendingHistoryBudgetsBarChart from './SpendingHistoryBudgetsBarChart';
// import { query, collection, where, getDocs, addDoc,deleteDoc,updateDoc, doc } from 'firebase/firestore';

const BudgetDetails = ({ route,  }) => {
  const { budgetId, conversionRate, symbol } = route.params; // Get budgetId from route params

//   console.log(budgetId)
  // State to store budget details
  const [budget, setBudget] = useState<any | null>(null);
  const [spentPercentage, setSpentPercentage] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     const fetchBudgetDetails = async () => {
//       try {
//         const budgetDocRef = doc(db, 'budgets', budgetId);
//         const budgetDocSnapshot = await getDoc(budgetDocRef);
  
//         if (budgetDocSnapshot.exists()) {
//           const fetchedBudget = budgetDocSnapshot.data();
//           const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//           const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
//           const transactionsQuery = query(
//             collection(db, 'transactions'),
//             where('category', '==', fetchedBudget.Category),
//             where('date', '>=', currentMonthStart),
//             where('date', '<=', currentMonthEnd)
//           );
  
//           const transactionsSnapshot = await getDocs(transactionsQuery);
//           const transactionsData = transactionsSnapshot.docs.map(doc => doc.data());
  
//           const totalAmount = fetchedBudget.Total_ammount;
//           const spentAmount = transactionsData.reduce((acc, transaction) => acc + parseFloat(transaction.value), 0);
//           const spentPercentage = (spentAmount / totalAmount) * 100;
//           const remainingAmount = totalAmount - spentAmount;
  
//           setSpentAmount(spentAmount);
//           setSpentPercentage(spentPercentage);
//           setRemainingAmount(remainingAmount);
//         } else {
//           console.error('Budget document not found');
//         }
//       } catch (error) {
//         console.error('Error fetching budget details:', error.message);
//       }
//     };
  
//     fetchBudgetDetails();
//   }, [budgetId]);
  
    useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const budgetDocRef = doc(db, 'budgets', budgetId);
        const budgetDocSnapshot = await getDoc(budgetDocRef);
        // console.log("Snapshot Exists:", budgetDocSnapshot.exists()); // Log if the document exists
        if (budgetDocSnapshot.exists()) {
          const fetchedBudget = budgetDocSnapshot.data();
        //   console.log("Fetched Budget:", fetchedBudget); // Log fetched data
          // Further processing...
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

                    // console.log("transactionsData for budget:", transactionsData)
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
    // Handle edit button press here
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
  // ... other styles ...
  titleStyle: {
    textAlign: 'center', // Center the text
    fontWeight: 'bold',  // Make the text bold
    fontSize: 20,        // Increase the font size
    marginVertical: 10,  // Add vertical margin for spacing
    color: '#333',       // Set the text color (optional)
  },
});


export default BudgetDetails;
