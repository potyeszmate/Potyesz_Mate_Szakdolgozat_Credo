import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5'; 

const ImportanceBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; 
  const importanceCounts = { mandatory: 0, necessary: 0, neutral: 0, negligible: 0 };

  data.forEach(item => {
    importanceCounts[item.Importance] += 1;
  });

  const chartData = {
    labels: Object.keys(importanceCounts),
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.cardStyle}>
        <Text style={styles.chartTitle}>Subscription Importance</Text>
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
          <View style={styles.warningContainer}>
            <Icon name="exclamation-triangle" size={20} color="#FFA500" />
            <Text style={styles.warningText}>
              Most of your subscriptions are categorized as negligible. Consider reviewing them.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 20,
  },
  cardStyle: {
    borderRadius: 20,
    padding: 10, 
    margin: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  warningContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 12
  },
  warningText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFA500',
  },
});

export default ImportanceBarChart;
