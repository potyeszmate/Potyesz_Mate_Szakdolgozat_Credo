import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { isValid, format } from 'date-fns';

const DateLineChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Text style={styles.noDataText}></Text>;
  }

  // Sort transactions by date
  const sortedData = data
    .filter(transaction => transaction.date && transaction.value)
    .sort((a, b) => a.date.toDate() - b.date.toDate());

  // Aggregate values by month
  const aggregatedData = sortedData.reduce((result, transaction) => {
    const monthKey = format(transaction.date.toDate(), 'MMMM');

    if (!result[monthKey]) {
      result[monthKey] = 0;
    }

    result[monthKey] += transaction.value;

    return result;
  }, {});

  // Create chart data, grouping months two by two
  const chartData = Object.entries(aggregatedData).reduce((result, [month, value], index, array) => {
    const label = month.substring(0, 3);
  
    if (index % 2 === 0) {
      const nextMonthIndex = (index + 1) % array.length;
      const nextMonthData = array[nextMonthIndex];
  
      if (nextMonthData) {
        const nextMonth = nextMonthData[0];
        const combinedLabel = `${label}-${nextMonth.substring(0, 3)}`;
        result.push({ label: combinedLabel, value: value + nextMonthData[1] });
      } else {
        result.push({ label, value });
      }
    }
  
    return result;
  }, []);
  // Output sorted months for debugging
  console.log('Sorted Months:', sortedData.map(transaction => format(transaction.date.toDate(), 'MMMM')));

  if (chartData.length === 0) {
    return <Text style={styles.noDataText}></Text>;
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.cardTitle}>Monthly Transactions</Text>
      <View style={styles.card}>
        <BarChart
          data={{
            labels: chartData.map(item => item.label),
            datasets: [{ data: chartData.map(item => item.value) }],
          }}
          width={310}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
  },
});

export default DateLineChart;
