import { Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { languages } from "../../commonConstants/sharedConstants";
import { CashFlowSummaryStyles } from "./AnalyticsComponentStyles";


  const ProgressBar = ({ label, amount, percentage, color, conversionRate, symbol}) => (
    <View style={CashFlowSummaryStyles.progressContainer}>
      <View style={CashFlowSummaryStyles.labelContainer}>
        <Text style={CashFlowSummaryStyles.label}>{label}</Text>
        <Text style={CashFlowSummaryStyles.amount}>
        {(parseFloat(amount) * conversionRate).toFixed(2)} {symbol}
        </Text>
      </View>
      <View style={CashFlowSummaryStyles.progressBarBackground}>
        <View style={[CashFlowSummaryStyles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  const CashFlowSummary = ({ totalIncome, totalExpenses, netCashFlow, symbol, selectedLanguage, conversionRate  }) => {
    const total = totalIncome + totalExpenses;
    const incomePercentage = (totalIncome / total) * 100;
    const expensesPercentage = (totalExpenses / total) * 100;
  
    return (
      <View style={CashFlowSummaryStyles.card}>
        
        <Text style={CashFlowSummaryStyles.title}>{languages[selectedLanguage].cashflow}</Text>
        <Text style={CashFlowSummaryStyles.subtitle}>{languages[selectedLanguage].cashflowDesc}</Text>
        <View style={CashFlowSummaryStyles.netCashFlowContainer}>
          <Text style={CashFlowSummaryStyles.netCashFlow}>
          {(parseFloat(netCashFlow) * conversionRate).toFixed(2)} {symbol}
          </Text>
          {netCashFlow < 0 && (
            <MaterialIcons name="warning" size={24} color="red" style={CashFlowSummaryStyles.warningIcon} />
          )}
        </View>
        <ProgressBar label={languages[selectedLanguage].Income} amount={totalIncome} percentage={incomePercentage} color="#4CAF50" conversionRate={conversionRate} symbol={symbol}/>
        <ProgressBar label={languages[selectedLanguage].Expense} amount={totalExpenses} percentage={expensesPercentage} color="#F44336" conversionRate={conversionRate} symbol={symbol}/>
      </View>
    );
  };
  
  export default CashFlowSummary;
