import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const NotificationPage = () => {
  const [transactionsNotificationEnabled, setTransactionsNotificationEnabled] = useState(true);
  const [budgetsNotificationEnabled, setBudgetsNotificationEnabled] = useState(true);
  const [recurringTransactionsNotificationEnabled, setRecurringTransactionsNotificationEnabled] = useState(true);
  const [goalsNotificationEnabled, setGoalsNotificationEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Transactions</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={transactionsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setTransactionsNotificationEnabled(previousState => !previousState)}
          value={transactionsNotificationEnabled}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Budgets</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={budgetsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setBudgetsNotificationEnabled(previousState => !previousState)}
          value={budgetsNotificationEnabled}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Recurring Transactions</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={recurringTransactionsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setRecurringTransactionsNotificationEnabled(previousState => !previousState)}
          value={recurringTransactionsNotificationEnabled}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Goals</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={goalsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setGoalsNotificationEnabled(previousState => !previousState)}
          value={goalsNotificationEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});

export default NotificationPage;
