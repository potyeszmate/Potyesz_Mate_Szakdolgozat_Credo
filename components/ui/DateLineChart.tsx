import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { isValid, format } from 'date-fns';

const DateLineChart: React.FC<any> = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Text style={styles.noDataText}></Text>;
  }

  const sortedData = data
    .filter((transaction) => transaction.date && transaction.value)
    .sort((a, b) => a.date - b.date);

  const aggregatedData: { [key: string]: number } = sortedData.reduce((result, transaction) => {
    const monthKey = format(transaction.date, 'MMMM');

    if (!result[monthKey]) {
      result[monthKey] = 0;
    }

    result[monthKey] += transaction.value;

    return result;
  }, {});

  const chartData: any = Object.entries(aggregatedData).reduce((result: any, [month, value], index, array) => {
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

  if (chartData.length === 0) {
    return <Text style={styles.noDataText}></Text>;
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.cardTitle}>Monthly Transactions</Text>
      <View style={styles.card}>
        <BarChart
          data={{
            labels: chartData.map((item: any) => item.label),
            datasets: [{ data: chartData.map((item: any) => item.value) }],
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
          yAxisLabel="$"
          yAxisSuffix=""
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
