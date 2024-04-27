import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BarChartSpending = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }

  const screenWidth = Dimensions.get('window').width;

  // Aggregate values for the same category
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
    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`,   //    color: (opacity = 1) => `rgba(53, 186, 82, ${opacity})`, // Bar color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    // ... more config
    barPercentage: 0.7,
    fillShadowGradientOpacity: 0.4, // Ensure bars are fully filled with color
    strokeWidth: 10,
    paddingLeft: 25, // Try increasing this if labels are still cut off


  };

  
    
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues.map(value => parseFloat(value)), // Make sure values are numbers
      }
    ]
  };

  return (
    <View style={styles.chartContainer}>
    <View style={styles.card}>

      {/* <Text style={styles.cardTitle}>Category Statistic</Text> */}

      <BarChart
        data={chartData}
        width={screenWidth - 70}
        height={500}
        yAxisLabel="$"
        yAxisSuffix="k" // If no suffix is needed, set it to an empty string
        chartConfig={chartConfig}
        verticalLabelRotation={67}
        fromZero={true}
        showBarTops={true}
        // showValuesOnTopOfBars={true}
        withInnerLines={true}
        segments={5}
        // horizontalLabelRotation={1}

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
    flex: 1, // Takes full height of the container
  },
  barChartStyle: {
    marginVertical: 8,
    marginRight: 20,
    marginLeft: 20, // This gives space on the left side of the chart
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
    // marginTop: 10,
    alignItems: 'center',
    marginTop: 20
  },
  // Add any additional styles you need
});

export default BarChartSpending;
