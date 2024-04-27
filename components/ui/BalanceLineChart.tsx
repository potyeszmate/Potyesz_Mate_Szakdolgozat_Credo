// import React, { useState, useEffect } from 'react';
// import { View, Text, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import moment from 'moment';

// const BalanceLineChart = ({ transactions, incomes, balance, filterType, currentDate }) => {
//   const [chartData, setChartData] = useState(null);

//   const getStartingBalance = (transactions, incomes, currentBalance, endDate) => {
//     // Sum all past transactions and incomes to find the starting balance
//     const pastTransactionsSum = transactions
//       .filter(t => new Date(t.date.seconds * 1000) < endDate)
//       .reduce((acc, t) => acc - t.value, 0);
//     const pastIncomesSum = incomes
//       .filter(i => new Date(i.date.seconds * 1000) < endDate)
//       .reduce((acc, i) => acc + i.value, 0);

//     // Starting balance is current balance plus past transactions and incomes
//     return currentBalance + pastTransactionsSum + pastIncomesSum;
//   };

//   const prepareChartData = (transactions, incomes, initialBalance, startDate, endDate) => {
//     let currentBalance = initialBalance; // This should be the balance as of the start date.
//     let balanceHistory = [{ date: startDate, balance: currentBalance }];
    
//     // Combine transactions and incomes and sort by date
//     let allEvents = [...transactions, ...incomes].sort((a, b) => a.date.seconds - b.date.seconds);
    
//     // Filter out events that are before the startDate or after the endDate
//     allEvents = allEvents.filter(e => {
//       const eventDate = new Date(e.date.seconds * 1000);
//       return eventDate >= startDate && eventDate <= endDate;
//     });
  
//     allEvents.forEach(event => {
//       const eventDate = new Date(event.date.seconds * 1000);
//       const amount = event.type === 'income' ? event.value : -event.value;
  
//       if (isNaN(amount)) {
//         console.error(`Invalid amount for event at date ${eventDate}: `, event);
//         return; // Skip this event
//       }
  
//       currentBalance += amount; // Adjust balance based on event type
//       balanceHistory.push({ date: eventDate, balance: currentBalance });
  
//       // Log the calculation for debugging
//       console.log(`${event.type} on ${eventDate}: ${amount}, new balance: ${currentBalance}`);
//     });
  
//     // Map balance history to chart data format
//     const labels = balanceHistory.map(item => moment(item.date).format('MM/DD'));
//     const data = balanceHistory.map(item => item.balance);
  
//     return {
//       labels,
//       datasets: [
//         {
//           data,
//           color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
//           strokeWidth: 2,
//         }
//       ]
//     };
//   };
  
  

//   useEffect(() => {
//     let startDate;
//     let endDate = new Date(currentDate);
    
//     if (filterType === 'monthly') {
//       startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
//       endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0); // Last day of the current month
//     } else if (filterType === 'weekly') {
//       startDate = new Date(endDate.setDate(endDate.getDate() - endDate.getDay()));
//       endDate = new Date(startDate);
//       endDate.setDate(startDate.getDate() + 6); // Last day of the week
//     } else if (filterType === 'yearly') {
//       startDate = new Date(endDate.getFullYear(), 0, 1); // First day of the year
//       endDate = new Date(startDate.getFullYear() + 1, 0, 0); // Last day of the year
//     }

//     setChartData(prepareChartData(transactions, incomes, balance, startDate, endDate));
//   }, [transactions, incomes, balance, filterType, currentDate]);

//   const chartConfig = {
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//     color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
//     strokeWidth: 2,
//     useShadowColorFromDataset: false,
//   };

//   const screenWidth = Dimensions.get('window').width;

//   return (
//     <View>
//       {chartData ? (
//         <LineChart
//           data={chartData}
//           width={screenWidth}
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//         />
//       ) : (
//         <Text>No data available</Text>
//       )}
//     </View>
//   );
// };

// export default BalanceLineChart;
