import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { languages } from '../../commonConstants/sharedConstants';
import { BarchartSpendingStyles } from './ChartComponentsStyles';

const BarChartSpending = ({ data, symbol, selectedLanguage, conversionRate}: { data: any[], symbol: string, selectedLanguage: string, conversionRate: string }) => {
  if (!data || data.length === 0) {
    return <Text style={BarchartSpendingStyles.noDataText}>{languages[selectedLanguage].noDataAvailable}</Text>;
  }

  const screenWidth = Dimensions.get('window').width;

  const sumsByCategory = data.reduce((acc, transaction) => {
    const category = `${languages[selectedLanguage][transaction.category]}` ;
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
        data: chartValues.map(value => parseFloat(value * conversionRate)),
      }
    ]
  };

  return (
    <View style={BarchartSpendingStyles.chartContainer}>
    <View style={BarchartSpendingStyles.card}>

      <BarChart
        data={chartData}
        width={screenWidth - 70}
        height={500}
        yAxisLabel={symbol}
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

export default BarChartSpending;
