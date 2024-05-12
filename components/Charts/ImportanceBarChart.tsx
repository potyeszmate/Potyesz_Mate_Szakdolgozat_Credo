import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import { languages } from '../../commonConstants/sharedConstants';
import { ImportanceBarChartStyles } from './ChartComponentsStyles';

const ImportanceBarChart = ({ data, symbol, selectedLanguage, conversionRate }) => {
  
  if (!data || data.length === 0) {
    return <Text style={ImportanceBarChartStyles.noDataText}></Text>;
  }

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; 
  const importanceCounts = { mandatory: 0, necessary: 0, neutral: 0, negligible: 0 };

  data.forEach(item => {
    importanceCounts[item.Importance] += 1;
  });

  const chartData = {
    labels: Object.keys(importanceCounts).map(key => languages[selectedLanguage][key]),
    datasets: [{
      data: Object.values(importanceCounts),
      colors: [ 
        (opacity = 1) => 'green',
        (opacity = 1) => 'blue',
        (opacity = 1) => 'orange',
        (opacity = 1) => 'red'
      ],
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 0.6) => `rgba(53, 186, 82, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,    
    borderRadius: 1,
    fillShadowGradientOpacity: 0.2, 
    barPercentage: 0.9,
    useShadowColorFromDataset: false 
  };

  const mostNegligible = importanceCounts.negligible > Math.max(importanceCounts.mandatory, importanceCounts.necessary, importanceCounts.neutral);

  return (
    <ScrollView contentContainerStyle={ImportanceBarChartStyles.scrollViewContent}>
      <View style={ImportanceBarChartStyles.cardStyle}>
        <Text style={ImportanceBarChartStyles.chartTitle}>{languages[selectedLanguage].subsciptionImportance}</Text>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={230}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          style={{
            marginVertical: 8,
            marginHorizontal: -10,
          }}
        />
        {mostNegligible && (
          <View style={ImportanceBarChartStyles.warningContainer}>
            <Icon name="exclamation-triangle" size={20} color="#FFA500" />
            <Text style={ImportanceBarChartStyles.warningText}>
            {languages[selectedLanguage].negligibleDesc}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ImportanceBarChart;
