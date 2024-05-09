import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BarChartSpending = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }

  const screenWidth = Dimensions.get('window').width;

  const sumsByCategory = data.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.value/1000;
    return acc;
  }, {});

  const chartLabels = Object.keys(sumsByCategory);
  const chartValues = Object.values(sumsByCategory);


  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`,  
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.7,
    fillShadowGradientOpacity: 0.4, 
    strokeWidth: 10,
    paddingLeft: 25, 
  };

  
    
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues.map(value => parseFloat(value)),
      }
    ]
  };

  return (
    <View style={styles.chartContainer}>
    <View style={styles.card}>


      <BarChart
        data={chartData}
        width={screenWidth - 70}
        height={500}
        yAxisLabel="$"
        yAxisSuffix="k" 
        chartConfig={chartConfig}
        verticalLabelRotation={67}
        fromZero={true}
        showBarTops={true}
        withInnerLines={true}
        segments={5}
      />
    </View>
    </View>

  );
};

const styles = StyleSheet.create({
  noDataText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
  },
  barChartStyle: {
    marginVertical: 8,
    marginRight: 20,
    marginLeft: 20, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    marginTop: 20
  },
});

export default BarChartSpending;
