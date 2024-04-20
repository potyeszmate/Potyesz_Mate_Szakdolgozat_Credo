import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Radio from './Radio';
import { AuthContext } from '../../store/auth-context';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguagePage = () => {

      
  const route: any = useRoute();
  
  const languages = ['English', 'German', 'Hungarian'];

  const defaultLanguage = route.params?.defaultLanguage ?? 'English';

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);


  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;
  
  const updateUserLanguage = async (newLanguage: string) => {
    console.log('Called updateUserLanguage.');

    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      console.log('In try.');

      await AsyncStorage.setItem('selectedLanguage', newLanguage);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        if (userData.uid === userId) {
          updateDoc(doc.ref, { language: newLanguage });
          console.log('User language updated successfully.');
        }
      });
    } catch (error) {
      console.error('Error updating user defaultCurrency:', error);
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    updateUserLanguage(language);
  };

  useEffect(() => {
    setSelectedLanguage(defaultLanguage)
    console.log("defaultLanguage: ", defaultLanguage);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a language:</Text>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={styles.languageOption}
          onPress={() => handleLanguageSelect(language)}
        >
          <Text style={styles.languageText}>{language}</Text>
          <Radio selected={language === selectedLanguage} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
  },
});

export default LanguagePage;
