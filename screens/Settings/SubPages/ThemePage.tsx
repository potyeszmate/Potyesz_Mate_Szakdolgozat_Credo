import { useRoute } from '@react-navigation/native';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { db } from '../../../firebaseConfig';
import { AuthContext } from '../../../store/auth-context';

const ThemeSettingsPage = () => {
    
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const route: any = useRoute();
  const defaultMode = route.params?.defaultMode ?? false;

  const [darkModeEnabled, setDarkModeEnabled] = useState(defaultMode);

  const updateTheme = async (newTheme: boolean) => {
  
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
  
        if (userData.uid === userId) {
          updateDoc(doc.ref, { darkMode: newTheme });
        }
      });
    } catch (error) {
      console.error('Error updating user darkMode:', error);
    }
  };
  

  const handleCurrencySelect = () => {
    const newDarkMode = !darkModeEnabled;
    setDarkModeEnabled(newDarkMode);
    updateTheme(newDarkMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Dark Mode</Text>
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

export default ThemeSettingsPage;
