// PieChartComponent.js
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const PieChartStockAndCrypto = ({ data }) => {
  const chartWidth = Dimensions.get('window').width - 50; // Adjusted for padding
  const totalValue = data.reduce((sum, item) => sum + item.ownedValue, 0);
  const totalOwnedValue = data.reduce((sum, item) => sum + item.ownedValue, 0);

  const chartData = data.map(item => ({
    name: item.name,
    value: parseFloat(item.ownedValue.toFixed(2)), // Parse the string as a float
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
  
  console.log("data: ", data)

  if(data.length <= 0) {
    return(
      <View style={styles.card}>
        <Text>No data</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.portfolioText}>Portfolio</Text>
        <Text style={styles.totalValueText}>{totalOwnedValue.toFixed(2)} $</Text>
        <Text style={styles.countText}>{data[0].symbol ? `Stocks: ${data.length}` : `Cryptocurrencies: ${data.length}`}</Text>
      </View>

      <PieChart
        data={chartData}
        width={chartWidth - 85}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        accessor={'value'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[chartWidth / 4, 0]}
        absolute
        hasLegend={false} 

      />
      {/* <View style={styles.legend}>
        {data.map((item, index) => (
          <ProgressBar
            key={index}
            label={item.name}
            amount={item.ownedValue.toFixed(2)}
            percentage={(item.ownedValue / totalValue) * 100}
            color={item.color}
          />
        ))}
      </View> */}
      {data.map((item, index) => (
        <View key={index} style={styles.legend}>
          {/* <Text style={styles.label}>{item.name}</Text>
          <Text style={styles.amount}>{`* ${item.ownedValue.toFixed(2)}`}</Text> */}
          <ProgressBar
            key={index}
            label={item.name}
            amount={item.ownedValue.toFixed(2)}
            percentage={(item.ownedValue / totalOwnedValue) * 100}
            color={item.color}
          />
        </View>
      ))}
    </View>
  );
};

const ProgressBar = ({ label, amount, percentage, color }) => (
  <View style={styles.progressItem}>
    <View style={styles.labelAndValueRow}>
      <Text style={styles.label}>{`${label}`}</Text>
      <Text style={styles.dot}>{` · `}</Text>

      <Text style={styles.value}>{`${amount} $`}</Text>
    </View>
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.percentageText}>{`${percentage.toFixed(2)}%`}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  portfolioText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  totalValueText: {
    fontSize: 22,
    // fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  countText: {
    fontSize: 16,
    color: '#666',
  },
  stockName: {
    fontSize: 16,
    color: '#000',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 120
  },
  dot: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginTop: 16,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelAndValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 4,
  },
  // progressBarBackground: {
  //   height: 20,
  //   flexDirection: 'row',
  //   backgroundColor: '#e0e0e0',
  //   borderRadius: 10,
  //   overflow: 'hidden',
  //   marginTop: 8,
  // },
  progressBarBackground: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    height: 10,
    flex: 1, // Flex is used to expand the background to fill the space
    // marginRight: 10, // Margin right for spacing between bar and percentage
    width: '100%'
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressItem: {
    // marginBottom: 5,
    marginRight:40
  },
  // progressBarFill: {
  //   height: '100%',
  // },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  labelAndValueContainer: {
    flexDirection: 'column', // Stack name and value on top of each other
    justifyContent: 'flex-start',
    flex: 1, // Take up full width minus space for percentage
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '70%', // Adjust the width here to give space for the percentage
  },
  label: {
    fontSize: 14,
    color: '#000',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  progressBarOverall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    height: 10,
    width: '100%', // Progress bar takes the full width of its container
  },
  // progressBarBackground: {
  //   height: 10,
  //   borderRadius: 10,
  //   backgroundColor: '#e0e0e0',
  //   flex: 5, // Give more space to progress bar than text
  //   marginHorizontal: 5, // Space between label/value and progress bar
  // },
  // percentageText: {
  //   color: '#A9A9A9', // Grey color
  //   fontSize: 14,
  //   paddingLeft: 10, // Space out the text a little from the bar
  // },
  progressBarFill: {
    borderRadius: 10,
    height: '100%',
  },
  percentageText: {
    fontSize: 14,
    color: '#A9A9A9',
    textAlign: 'right',
    paddingLeft: 10,
    marginRight: -40

  },
});


export default PieChartStockAndCrypto;
