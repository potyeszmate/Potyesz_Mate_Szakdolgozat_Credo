import { useRoute } from '@react-navigation/native';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { db } from '../../../firebaseConfig';
import { AuthContext } from '../../../store/auth-context';
import { updateTheme } from '../SettingsHelpers';
import { ThemeStyles } from '../SettingsStyles';

const ThemeSettingsPage = () => {
    
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const route: any = useRoute();
  const defaultMode = route.params?.defaultMode ?? false;

  const [darkModeEnabled, setDarkModeEnabled] = useState(defaultMode);

  const handleCurrencySelect = () => {
    const newDarkMode = !darkModeEnabled;
    setDarkModeEnabled(newDarkMode);
    updateTheme(newDarkMode, userId);
  };

  return (
    <View style={ThemeStyles.container}>
      <View style={ThemeStyles.optionContainer}>
        <Text style={ThemeStyles.optionText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#1CB854" }}
          thumbColor={darkModeEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleCurrencySelect}
          value={darkModeEnabled}
        />
      </View>
    </View>
  );
};


export default ThemeSettingsPage;
