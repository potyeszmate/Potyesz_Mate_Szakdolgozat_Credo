import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { languages } from '../../commonConstants/sharedConstants';
import { PieChartStockAndCryptoStyles } from './ChartComponentsStyles';

const PieChartStockAndCrypto = ({ data, symbol, selectedLanguage, conversionRate}) => {
  const chartWidth = Dimensions.get('window').width - 50; 
  const totalValue = data.reduce((sum, item) => sum + item.ownedValue, 0);
  const totalOwnedValue = data.reduce((sum, item) => sum + item.ownedValue, 0);

  const chartData = data.map(item => ({
    name: item.name,
    value: parseFloat(item.ownedValue.toFixed(2)), 
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
  
  if(data.length <= 0) {
    return(
      <View style={PieChartStockAndCryptoStyles.card}>
        <Text>{languages[selectedLanguage].noDataAvailable}</Text>
      </View>
    )
  }

  return (
    <View style={PieChartStockAndCryptoStyles.card}>
      <View style={PieChartStockAndCryptoStyles.cardHeader}>
        <Text style={PieChartStockAndCryptoStyles.portfolioText}>{languages[selectedLanguage].portfolio}</Text>
        <Text style={PieChartStockAndCryptoStyles.totalValueText}>{(parseFloat(totalOwnedValue) * conversionRate).toFixed(2)} {symbol}</Text>
        <Text style={PieChartStockAndCryptoStyles.countText}>{data[0].symbol ? `${languages[selectedLanguage].stocks}: ${data.length}` : `${languages[selectedLanguage].cryptos}: ${data.length}`}</Text>
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

      {data.map((item, index) => (
        <View key={index} style={PieChartStockAndCryptoStyles.legend}>
          
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
  <View style={PieChartStockAndCryptoStyles.progressItem}>
    <View style={PieChartStockAndCryptoStyles.labelAndValueRow}>
      <Text style={PieChartStockAndCryptoStyles.label}>{`${label}`}</Text>
      <Text style={PieChartStockAndCryptoStyles.dot}>{` · `}</Text>

      <Text style={PieChartStockAndCryptoStyles.value}>{`${amount} $`}</Text>
    </View>
    <View style={PieChartStockAndCryptoStyles.progressContainer}>
      <View style={PieChartStockAndCryptoStyles.progressBarBackground}>
        <View style={[PieChartStockAndCryptoStyles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={PieChartStockAndCryptoStyles.percentageText}>{`${percentage.toFixed(2)}%`}</Text>
    </View>
  </View>
);

export default PieChartStockAndCrypto;
