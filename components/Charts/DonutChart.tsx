import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';


const categoryColors: any = { 
  Food: "#4793AF",
  Entertainment: "#FFC470",
  Grocieries: "#DD5746",
  Shopping: "#8B322C",
  UtilityCosts: "#416D19",
  Transportation: "#C4E4FF",
  Housing: "#121481"

};

const DonutChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }
  
  const screenWidth = Dimensions.get('window').width;

  const aggregatedData = data.reduce((acc: any[], transaction: any) => {
    const existingCategory = acc.find((item: any) => item.name === transaction.category);

    if (existingCategory) {
      existingCategory.value += transaction.value;
    } else {
      acc.push({ name: transaction.category, value: transaction.value });
    }

    return acc;
  }, []);

  const totalAmount = aggregatedData.reduce((total: number, category: any) => total + category.value, 0);

  const chartData = aggregatedData.map((category: any) => ({
    name: category.name,
    value: category.value,
    percentage: ((category.value / totalAmount) * 100).toFixed(2),
    color: categoryColors[category.name] || '#999999', 
  }));

  return (
    <View style={styles.chartContainer}>
      
      <View style={styles.card}>

        <PieChart
          data={chartData}
          width={screenWidth - 120}
          height={250}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="70"
          absolute
          hasLegend={false} 
        />
        <Text style={styles.totalAmountText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
        <View style={styles.legendContainer}>
          {chartData.map((category: any, index: number) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: category.color }]} />
              <Text>{category.name}: {category.percentage}% - {category.value}$</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  totalAmountText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 10, 
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
    marginBottom: 10
  },
  noDataText: {
    fontSize: 16,
  },
 
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
});

export default DonutChart;
