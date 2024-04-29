import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const RecurringDonutChart = ({ data, total, recurringType }) => {
  const colorMapping = {
    Twitter: "#1DA1F2",
    Youtube: "#FF0000",
    Instagram: "#C13584",
    LinkedIn: "#0077B5",
    Wordpress: "#21759B",
    Pinterest: "#BD081C",
    Figma: "#F24E1E",
    Behance: "#1769FF",
    Apple: "#A2AAAD",
    GooglePlay: "#3CCC28",
    Google: "#4285F4",
    AppStore: "#0D96F6",
    Github: "#181717",
    Xbox: "#107C10",
    Discord: "#7289DA",
    Stripe: "#635BFF",
    Spotify: "#1DB954",
  
    'Credit card': "#DAA520",
    'Mortgage': "#A52A2A",
    'Bank loan': "#5F9EA0",
    'Personal loan': "#DEB887",
    'Student loan': "#8A2BE2",
    'Car loan': "#DC143C",
  
    Electricity: "#FF7F50",
    Water: "#4682B4",
    Gas: "#2E8B57",
    Phone: "#D2691E",
    Internet: "#6495ED",
    Hospitality: "#9932CC",
  };
  
  
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }

  const screenWidth = Dimensions.get('window').width;

  const chartData = data.map(item => ({
    name: item.name,
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

  const calculatePercentage = (value) => (value / total * 100).toFixed(2) + '%';

  return (
    <View style={styles.chartContainer}>
      <View style={styles.innerChartContainer}>
        <Text style={styles.title}>{recurringType}</Text>
        <Text style={styles.totalValue}>
            Total: ${total.toFixed(2)}
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

const styles = StyleSheet.create({
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  innerChartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 1,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: 'white'
  },
  cardStyle: {
    borderRadius: 8,
    padding: 20,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalValue: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  percentagesList: {
    marginTop: 20,
  },
  itemPercentage: {
    fontSize: 16,
    color: '#7F7F7F',
    textAlign: 'center', 
  },
});

export default RecurringDonutChart;
