import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { languages } from '../../commonConstants/sharedConstants';
import { DonutChartStyles } from './ChartComponentsStyles';
import { DonutchartCategoryColors } from './ChartComponentStyles';

const DonutChart = ({ data, symbol, selectedLanguage, conversionRate }: { data: any[], symbol: string, selectedLanguage: string, conversionRate: string }) => {
  if (!data || data.length === 0) {
    return <Text style={DonutChartStyles.noDataText}>{languages[selectedLanguage].noDataAvailable}</Text>;
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
    color: DonutchartCategoryColors[category.name] || '#999999', 
  }));

  return (
    <View style={DonutChartStyles.chartContainer}>
      
      <View style={DonutChartStyles.card}>

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
        <Text style={DonutChartStyles.totalAmountText}>
        {languages[selectedLanguage].totalAmount}: {(parseFloat(totalAmount) * conversionRate).toFixed(2)} {symbol}
          </Text>
        <View style={DonutChartStyles.legendContainer}>
          {chartData.map((category: any, index: number) => (
            <View key={index} style={DonutChartStyles.legendItem}>
              <View style={[DonutChartStyles.legendColor, { backgroundColor: category.color }]} />
              <Text>{languages[selectedLanguage][category.name]} : {category.percentage}% - {(parseFloat(category.value) * conversionRate).toFixed(2)} {symbol}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DonutChart;
