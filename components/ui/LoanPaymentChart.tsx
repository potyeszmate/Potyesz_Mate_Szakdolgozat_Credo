import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment'; // Ensure moment is installed

const LoanPaymentChart = ({ loans }) => {
  const [dataPoints, setDataPoints] = useState({ labels: [], values: [] });
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: '#35BA52',
    backgroundGradientTo: '#35BA52',
    decimalPlaces: 0, // no decimal places
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#35BA52"
    },
    propsForBackgroundLines: {
      strokeWidth: 1, // Set to 0 to hide grid lines
    },
    // Setting the base value of the y-axis to 0
    yAxisInterval: 1, // Optional: Interval of the y-axis
    fromZero: true, // Ensures that y-axis starts at 0
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

    // Reduce the number of data points
    const sampleRate = Math.ceil(data.length / 10); // Adjust this to reduce more or less
    const sampledData = data.filter((_, index) => index % sampleRate === 0);

    if (sampledData.length > 0) {
      // Update label display logic as before if needed
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
    <View style={styles.container}>
    <View style={styles.innerChartContainer}>

      <Text style={styles.chartTitle}>Estimated Monthly Loan Payments</Text>
      {dataPoints.values.length > 0 ? (
        <LineChart
          data={{
            labels: dataPoints.labels,
            datasets: [{ data: dataPoints.values }]
          }}
          width={screenWidth - 45}
          height={250}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available for display.</Text>
      )}
    </View>
    </View>

  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1, // Take up all available space
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
      marginTop: 20, // Adds top margin
    //   paddingHorizontal: 15, // Side padding makes chart centered within the screen width minus this padding
    },
    chart: {
      marginVertical: 10,
      borderRadius: 20, // Border radius for the chart
      borderWidth: 1, // Optional: if you want to see the border
      borderColor: 'transparent', // Border color set to transparent to keep the background visible
    },
    chartTitle: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 10, // Margin at the bottom of the title
      marginTop: 16
    },
    noDataText: {
      marginTop: 20, // Margin at the top if no data is available
    },
    innerChartContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 1,
        elevation: 3, // This adds a subtle shadow on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#35BA52'
      },
  });
  
export default LoanPaymentChart;
