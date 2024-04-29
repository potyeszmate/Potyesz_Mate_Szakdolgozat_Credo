import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SpendingHistoryBudgetsBarChart = ({ budgetId, category, conversionRate, symbol }) => {
  const [spendingData, setSpendingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchSpendingData = async () => {
      setIsLoading(true);
      const now = new Date();
      const spendingByMonth = new Map();

      for (let i = 0; i < 5; i++) {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        const monthKey = `${startOfMonth.toLocaleString('default', { month: 'short' })} ${startOfMonth.getFullYear()}`;

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('category', '==', category),
          where('date', '>=', startOfMonth),
          where('date', '<=', endOfMonth)
        );

        try {
          const snapshot = await getDocs(transactionsQuery);
          const transactions = snapshot.docs.map(doc => doc.data());

          const totalSpentThisMonth = transactions.reduce((sum, transaction) => sum + Number(transaction.value), 0);
          spendingByMonth.set(monthKey, totalSpentThisMonth);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setIsLoading(false);
          return;
        }
      }

      setSpendingData(Array.from(spendingByMonth, ([month, total]) => ({ month, total })).reverse());
      setIsLoading(false);
    };

    fetchSpendingData();
  }, [budgetId, category]);

  const chartData = {
    labels: spendingData.map((data) => data.month),
    datasets: [{
      data: spendingData.map((data) => data.total.toFixed(2))
    }]
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
  };

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>;
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Spending History for the last 5 months</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel={symbol}
        yAxisSuffix=""
        chartConfig={chartConfig}
        fromZero={true}
        showBarTops={true}
        showValuesOnTopOfBars={true}
        withInnerLines={false}
      />
    </View>
  );
};

export default SpendingHistoryBudgetsBarChart;
