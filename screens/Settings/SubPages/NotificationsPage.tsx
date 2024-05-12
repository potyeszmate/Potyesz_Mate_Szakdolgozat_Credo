import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { NotificationStyles } from '../SettingsStyles';
import { languages } from '../../../commonConstants/sharedConstants';
import { useRoute } from '@react-navigation/native';

const NotificationPage = () => {
  const [transactionsNotificationEnabled, setTransactionsNotificationEnabled] = useState(true);
  const [budgetsNotificationEnabled, setBudgetsNotificationEnabled] = useState(true);
  const [recurringTransactionsNotificationEnabled, setRecurringTransactionsNotificationEnabled] = useState(true);
  const [goalsNotificationEnabled, setGoalsNotificationEnabled] = useState(true);
  const route: any = useRoute();
  const selectedLanguage = route.params?.selectedLanguage ?? 'English';
  
  return (
    <View style={NotificationStyles.container}>
      <Text style={NotificationStyles.header}>{languages[selectedLanguage].notifications}</Text>
      <View style={NotificationStyles.optionContainer}>
        <Text style={NotificationStyles.optionText}>{languages[selectedLanguage].transactions}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={transactionsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setTransactionsNotificationEnabled(previousState => !previousState)}
          value={transactionsNotificationEnabled}
        />
      </View>
      <View style={NotificationStyles.optionContainer}>
        <Text style={NotificationStyles.optionText}>{languages[selectedLanguage].budgets}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={budgetsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setBudgetsNotificationEnabled(previousState => !previousState)}
          value={budgetsNotificationEnabled}
        />
      </View>
      <View style={NotificationStyles.optionContainer}>
        <Text style={NotificationStyles.optionText}>{languages[selectedLanguage].recurrings}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={recurringTransactionsNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setRecurringTransactionsNotificationEnabled(previousState => !previousState)}
          value={recurringTransactionsNotificationEnabled}
        />
      </View>
      <View style={NotificationStyles.optionContainer}>
        <Text style={NotificationStyles.optionText}>{languages[selectedLanguage].goals}</Text>
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


export default NotificationPage;
