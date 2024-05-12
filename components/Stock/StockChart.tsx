import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStockChartData } from '../../util/stocks';
import moment from 'moment';
import { languages } from '../../commonConstants/sharedConstants';
import { StockChartStyles } from './StockComponentStyles';

const TimeframeButtons = ({ activeInterval, onSelectInterval, selectedLanguage }) => {
  return (
    <View style={StockChartStyles.timeframeButtonContainer}>
      {['1 DAY', '1 WEEK', '1 MONTH', '1 YEAR'].map((interval) => (
        <TouchableOpacity
          key={interval}
          style={[
            StockChartStyles.timeframeButton,
            activeInterval === interval ? StockChartStyles.activeTimeframe : null,
          ]}
          onPress={() => onSelectInterval(interval)}
        >
          <Text
            style={[
              StockChartStyles.timeframeButtonText,
              activeInterval === interval ? StockChartStyles.activeText : null,
            ]}
          >
          {languages[selectedLanguage][interval]}         
           </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const StockChart = ({ symbol, selectedLanguage }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('1 YEAR');

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date().toISOString().split('T')[0]; 
      const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

      try {
        const data = await getStockChartData(symbol, startDate, endDate, '1month');
        const valuesReversed = data.values.slice().reverse();
        const formattedData = {
          labels: valuesReversed.map((value, index) =>
            index % 2 === 0 ? moment(value.datetime).format('MM/YY') : ''
          ),
          datasets: [
            {
              data: valuesReversed.map(value => parseFloat(value.close)),
            },
          ],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [symbol]);

  if (!chartData) {
    return <Text>Loading chart...</Text>;
  }

  const chartConfig = {
    backgroundColor: '#35BA52',
    backgroundGradientFrom: '#35BA52',
    backgroundGradientTo: '#35BA52',
    decimalPlaces: 2, 
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
      marginHorizontal: 16, 
    },
    propsForDots: {
      r: '0', 
    },
    propsForLabels: {
        dx: 1,
      },
  };

  return (
    
    <View>

      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32} 
        height={220}
        yAxisLabel="$"
        yAxisInterval={1} 
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          ...chartConfig.style, 
        }}
        formatYLabel={(y) => Number(y) > 10 ? `${parseFloat(y).toFixed(0)}` : `${parseFloat(y).toFixed(3)}`} 
      />

    <TimeframeButtons
      activeInterval={selectedInterval}
      onSelectInterval={(interval) => setSelectedInterval(interval)}
      selectedLanguage= {selectedLanguage}

    />
    </View>
  );
};

export default StockChart;
