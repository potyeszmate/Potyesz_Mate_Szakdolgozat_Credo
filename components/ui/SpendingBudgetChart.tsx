import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SpendingBudgetChart = ({ transactions, totalAmount, conversionRate, symbol }) => {
  const screenWidth = Dimensions.get('window').width;

  const convertTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  // This function will generate the cumulative sum of spending per day
  const processData = (transactions) => {
    // Start with an array filled with zeros for each day of the month
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const cumulativeSpending = Array(daysInMonth).fill(0);

    // Convert transactions to dates and sort
    transactions.forEach(transaction => {
      const date = convertTimestampToDate(transaction.date);
      const dayIndex = date.getDate() - 1; // -1 as the array is zero-indexed
      cumulativeSpending[dayIndex] += Number(transaction.value);
    });

    // Calculate the cumulative sum for the graph
    for (let i = 1; i < cumulativeSpending.length; i++) {
      cumulativeSpending[i]  += (cumulativeSpending[i - 1] * conversionRate);  //cumulativeData
    }
    
    return cumulativeSpending;
  };

  const generateMonthDays = (date) => {
    const days = [];
    let day = new Date(date.getFullYear(), date.getMonth(), 1);
    while (day.getMonth() === date.getMonth()) {
      const label = `${day.getMonth() + 1}.${day.getDate().toString().padStart(2, '0')}`;
      days.push(label);
      day.setDate(day.getDate() + 5);
    }
    return days;
  };

  // Create the labels for the x-axis
  const xLabels = generateMonthDays(new Date());

  // Process the transaction data to get cumulative values
  const cumulativeData = processData(transactions);

  // Setup the chart data
  const chartData = {
    labels: xLabels,
    datasets: [{
      data: xLabels.map(label => {
        const day = parseInt(label.split('.')[1], 10) - 1; // -1 as the array is zero-indexed
        return cumulativeData[day];
      })
    }]
  };

  // Setup the chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`, // Line color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#35BA52'
    },
    propsForBackgroundLines: {
      stroke: '#35BA52' // Color for the background lines
    },
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Spending Over Time</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32} // Apply a padding of 16 on each side
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        yAxisLabel={symbol}
        yLabelsOffset={1}
        xLabelsOffset={-10}
        yAxisInterval={1} // This will space out the Y-axis labels according to the data.
        verticalLabelRotation={30}
        formatYLabel={(value) => `${Number(value).toFixed(2)}`}
      />
    </View>
  );
};

export default SpendingBudgetChart;
