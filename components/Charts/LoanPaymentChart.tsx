import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'; 
import { languages } from '../../commonConstants/sharedConstants';
import { LoanPaymentChartsStyles } from './ChartComponentsStyles';

const LoanPaymentChart = ({ loans, symbol, selectedLanguage, conversionRate }) => {
  const [dataPoints, setDataPoints] = useState({ labels: [], values: [] });
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: '#35BA52',
    backgroundGradientTo: '#35BA52',
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#35BA52"
    },
    propsForBackgroundLines: {
      strokeWidth: 1, 
    },
    yAxisInterval: 1, 
    fromZero: true, 
  };

  const calculatePayments = () => {
    let paymentsSummary = {};
    let maxDate = new Date(0);

    loans.forEach(loan => {
      let date = new Date(loan.Date.seconds * 1000);
      const dueDate = new Date(loan.dueDate.seconds * 1000);
      maxDate = new Date(Math.max(maxDate, dueDate));

      while (date <= dueDate) {
        const monthKey = moment(date).format('YYYY/MM');
        paymentsSummary[monthKey] = (paymentsSummary[monthKey] || 0) + loan.value;
        date.setMonth(date.getMonth() + 1);
      }
    });

    let data = [];
    let currentDate = new Date();
    currentDate.setDate(0);
    while (currentDate <= maxDate) {
      const monthKey = moment(currentDate).format('YYYY/MM');
      data.push({
        date: monthKey,
        value: paymentsSummary[monthKey] || 0
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const sampleRate = Math.ceil(data.length / 10); 
    const sampledData = data.filter((_, index) => index % sampleRate === 0);

    if (sampledData.length > 0) {
      const labels = sampledData.map((point, index) => 
        (index % Math.ceil(sampledData.length / 5) === 0 ? point.date : '')
      );
      const values = sampledData.map(point => point.value);
      setDataPoints({ labels, values });
    }
  };

  useEffect(() => {
    calculatePayments();
  }, [loans]);

  return (
    <View style={LoanPaymentChartsStyles.container}>
    <View style={LoanPaymentChartsStyles.innerChartContainer}> 

      <Text style={LoanPaymentChartsStyles.chartTitle}>{languages[selectedLanguage].estimatedLoan}</Text>
      {dataPoints.values.length > 0 ? (
        <LineChart
          data={{
            labels: dataPoints.labels,
            datasets: [{ data: dataPoints.values }] 
          }}
          width={screenWidth - 45}
          height={250}
          yAxisLabel={symbol}
          yAxisSuffix=""
          chartConfig={chartConfig}
          bezier
          style={LoanPaymentChartsStyles.chart}
        />
      ) : (
        <Text style={LoanPaymentChartsStyles.noDataText}>{languages[selectedLanguage].noDataAvailable}</Text>
      )}
    </View>
    </View>

  );
};
  
export default LoanPaymentChart;
