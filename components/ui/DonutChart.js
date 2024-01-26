/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const DonutChart = ({ data }) => {
  if (data.length === 0) {
    return <Text style={styles.noDataText}></Text>;
  }

  // Aggregate values for the same category
  const aggregatedData = data.reduce((acc, transaction) => {
    const existingCategory = acc.find(item => item.name === transaction.category);

    if (existingCategory) {
      existingCategory.value += transaction.value;
    } else {
      acc.push({ name: transaction.category, value: transaction.value });
    }

    return acc;
  }, []);

  const totalAmount = aggregatedData.reduce((total, category) => total + category.value, 0);

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = aggregatedData.map((category) => ({
    name: category.name,
    value: category.value,
    percentage: ((category.value / totalAmount) * 100).toFixed(2),
    color: getRandomColor(),
  }));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.cardTitle}>Category Statistic</Text>
      <View style={styles.card}>
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        <Text style={styles.totalAmountText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
        <View style={styles.legendContainer}>
          {chartData.map((category, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: category.color }]} />
              <Text>{category.name}: {category.percentage}%</Text>
            </View>
          ))}
        </View>
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
    marginTop: 60,
  },
  totalAmountText: {
    marginTop: 10,
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
});

export default DonutChart;
