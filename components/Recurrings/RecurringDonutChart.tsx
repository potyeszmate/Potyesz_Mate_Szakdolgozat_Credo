import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { languages } from '../../commonConstants/sharedConstants';
import { colorMapping } from '../../screens/Analytics/AnalyticsScreenConstants';
import { RecurringDonutChartStyles } from './RecurringComponentStyles';

const RecurringDonutChart = ({ data, total, recurringType, symbol, selectedLanguage, conversionRate}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = data.map(item => ({
    name: languages[selectedLanguage][item.name] || item.name,
    value: item.value,
    color: colorMapping[item.name] || '#999',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  const chartConfig = {
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };
  // const calculatePercentage = (value) => (value / total * 100).toFixed(2) + '%';

  if (!data || data.length === 0) {
    return <Text style={RecurringDonutChartStyles.noDataText}>{languages[selectedLanguage].noDataAvailable}</Text>;
  }

  return (
    <View style={RecurringDonutChartStyles.chartContainer}>
      <View style={RecurringDonutChartStyles.innerChartContainer}>
        <Text style={RecurringDonutChartStyles.title}>{recurringType}</Text>
        <Text style={RecurringDonutChartStyles.totalValue}>
        {languages[selectedLanguage].total} {(parseFloat(total) * conversionRate).toFixed(2)} {symbol}
          </Text>

          <PieChart
            data={chartData}
            width={screenWidth - 40}  
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={true}
            absolute={false}

          />
         
      </View>
    </View>
  );
};

export default RecurringDonutChart;
