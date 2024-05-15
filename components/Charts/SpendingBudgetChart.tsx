import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SpendingBudgetChart = ({ transactions, totalAmount, conversionRate, symbol }) => {
  const screenWidth = Dimensions.get('window').width;

  const convertTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const processData = (transactions) => {
    const today = new Date().getDate();
    const cumulativeSpending = Array(today).fill(0);

    transactions.forEach(transaction => {
      const date = convertTimestampToDate(transaction.date);
      const dayIndex = date.getDate() - 1;
      if (dayIndex < today) {
        cumulativeSpending[dayIndex] += Number(transaction.value);
      }
    });

    for (let i = 1; i < cumulativeSpending.length; i++) {
      cumulativeSpending[i] += (cumulativeSpending[i - 1] * conversionRate);
    }
    
    return cumulativeSpending;
  };

  const generateMonthDays = (date) => {
    const days = [];
    const today = date.getDate();
    let day = new Date(date.getFullYear(), date.getMonth(), 1);
    while (day.getMonth() === date.getMonth() && day.getDate() <= today) {
      const label = `${day.getMonth() + 1}.${day.getDate().toString().padStart(2, '0')}`;
      days.push(label);
      day.setDate(day.getDate() + 1); 
    }
    const step = Math.max(1, Math.floor(days.length / 6)); 
    return days.filter((_, index) => index % step === 0);
  };

  const xLabels = generateMonthDays(new Date());

  const cumulativeData = processData(transactions);

  const chartData = {
    labels: xLabels,
    datasets: [{
      data: xLabels.map(label => {
        const day = parseInt(label.split('.')[1], 10) - 1;
        return cumulativeData[day];
      })
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '0',
      strokeWidth: '0',
      stroke: '#35BA52'
    },
    propsForBackgroundLines: {
      stroke: '#35BA52'
    },
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Spending Over Time</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
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
        yAxisInterval={1}
        verticalLabelRotation={30}
        formatYLabel={(value) => `${Number(value).toFixed(2)}`}
      />
    </View>
  );
};



export default SpendingBudgetChart;
