import React from 'react';
import { View, Text, StyleSheet, Image  } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';



const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const YourBalance: React.FC<any> = ({ balance, income, expense, selectedLanguage, symbol, conversionRate, loading }) => {
  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  const ArrowDown = require('../../assets/arrow-down-circle.png');
  const ArrowUp = require('../../assets/arrow-up-circle.png');

  const [selectedMonth, setSelectedMonth] = React.useState('January');

  return (
    <View style={styles.cardContainer}>
      {/* Month Selector */}
      <View style={styles.monthSelectorContainer}>
        <View style={styles.monthSelectorCard}>
          <RNPickerSelect
            value={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
            items={months.map(month => ({ label: month.label, value: month.value }))}
            style={{ inputIOS: styles.monthSelector }}
          />
          <Ionicons name="caret-down" size={20} style={styles.monthSelectorIcon} />
          </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{languages[selectedLanguage].yourBalance}</Text>
        {loading ? (
          <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
        ) : (
          <Text style={styles.balanceAmount}>
            {symbol === 'HUF'
              ? Math.round(parseFloat(balance) * conversionRate)
              : (parseFloat(balance) * conversionRate).toFixed(2)}{' '}{symbol}
          </Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoBox, styles.incomeInfoBox, styles.leftBox]}>
          <Image source={ArrowUp} resizeMode="contain" />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>{languages[selectedLanguage].income}</Text>
            {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={styles.infoAmount}>
              {symbol === 'HUF'
                ? Math.round(parseFloat(income) * conversionRate)
                : (parseFloat(income) * conversionRate).toFixed(2)}{' '}{symbol}
            </Text>
          )}
          </View>
        </View>

        <View style={{ marginHorizontal: 0.00001 }} />

        <View style={[styles.infoBox, styles.expenseInfoBox, styles.rightBox]}>
          <Image source={ArrowDown} resizeMode="contain" />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>{languages[selectedLanguage].expense}</Text>
            {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <Text style={styles.infoAmount}>
              {symbol === 'HUF'
                ? Math.round(parseFloat(expense) * conversionRate)
                : (parseFloat(expense) * conversionRate).toFixed(2)}{' '}{symbol}
            </Text>
          )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF', // Example color
    fontStyle: 'italic',
  },  
  balanceContainer: {
    paddingBottom: 1,
  },
  balanceText: {
    color: '#7E8086',
    fontSize: 16,
    paddingBottom: 5,
  },
  balanceAmount: {
    fontSize: 29,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 10,
    flex: 1,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  infoAmount: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  leftBox: {
    marginRight: 2
  },
  rightBox: {
    marginLeft: 2
  },
  // Style for the Income infoBox
  incomeInfoBox: {
    backgroundColor: '#35BA52',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 10, // Add margin to create gap
  },
  // Style for the Expense infoBox
  expenseInfoBox: {
    backgroundColor: '#35BA52',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 10, // Add margin to create gap
  },
  monthSelectorContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  monthSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthSelector: {
    flex: 1,
    color: '#000000',
    paddingRight: 30, // To account for the icon
  },
  monthSelectorIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default YourBalance;
