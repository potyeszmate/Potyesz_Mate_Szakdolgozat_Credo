import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStockChartData } from '../../util/stocks';

import moment from 'moment';
import { getCryptoChartData } from '../../util/crypto';

const TimeframeButtons = ({ activeInterval, onSelectInterval }) => {
  return (
    <View style={styles.timeframeButtonContainer}>
      {['1 DAY', '1 WEEK', '1 MONTH', '1 YEAR'].map((interval) => (
        <TouchableOpacity
          key={interval}
          style={[
            styles.timeframeButton,
            activeInterval === interval ? styles.activeTimeframe : null,
          ]}
          onPress={() => onSelectInterval(interval)}
        >
          <Text
            style={[
              styles.timeframeButtonText,
              activeInterval === interval ? styles.activeText : null,
            ]}
          >
            {interval}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const StockChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('1 YEAR');

  useEffect(() => {
    const fetchData = async () => {
      // Date range for the last 12 months
      const endDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
      const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

      try {
        const data = await getCryptoChartData(symbol, startDate, endDate, '1month');
        // Reverse the array to get ascending dates
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
    decimalPlaces: 2, // specify the number of decimal places
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
      marginHorizontal: 16, // Adjust for more space on the sides
      marginLeft: -4
    },
    propsForDots: {
      r: '0', // Hide the dots by setting radius to 0
    },
    propsForLabels: {
        // this will adjust y-axis label position
        dx: 1,
      },
  };

  return (
    
    <View>

      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32} // Adjust for more space on the sides
        height={220}
        yAxisLabel="$"
        yAxisInterval={1} // Display one label from each dataset
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
        //   borderRadius: 16,
          ...chartConfig.style, // Spread in custom styles from the config
        }}
        formatYLabel={(y) => Number(y) > 10 ? `${parseFloat(y).toFixed(0)}` : `${parseFloat(y).toFixed(3)}`} // Format y-axis labels to show currency
      />

    <TimeframeButtons
      activeInterval={selectedInterval}
      onSelectInterval={(interval) => setSelectedInterval(interval)}
    />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // other container styles
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#35BA52',
  },
  inactiveButton: {
    backgroundColor: '#ddd',
  },
  timeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  timeframeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    // backgroundColor: 'white', // Set the background color to match the page
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#ddd', // Non-active button background
  },
  activeTimeframe: {
    backgroundColor: '#35BA52', // Active button background
  },
  timeframeButtonText: {
    color: '#000', // Non-active text color
  },
  activeText: {
    color: 'white', // Active text color
  },
  // other styles
});
export default StockChart;
