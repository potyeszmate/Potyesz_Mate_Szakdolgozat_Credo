import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import Radio from '../../../components/CommonComponents/Radio';
import { LanguageStyles } from '../SettingsStyles';
import { languages } from '../../../commonConstants/sharedConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguagePage = () => {

      
  const route: any = useRoute();
  
  const language = ['English', 'German', 'Hungarian'];

  const defaultLanguage = route.params?.defaultLanguage ?? 'English';

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;
  
  const updateUserLanguage = async (newLanguage: string, userId: string) => {

    try {
      const querySnapshot = await getDocs(collection(db, 'users'));

      await AsyncStorage.setItem('selectedLanguage', newLanguage);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        if (userData.uid === userId) {
          updateDoc(doc.ref, { language: newLanguage });
        }
      });
    } catch (error) {
      console.error('Error updating user defaultCurrency:', error);
    }
  };


  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    updateUserLanguage(language, userId);
  };

  useEffect(() => {
    setSelectedLanguage(defaultLanguage)
  }, []);

  return (
    <View style={LanguageStyles.container}>
      <Text style={LanguageStyles.header}>{languages[selectedLanguage].selectLanguage}:</Text>
      {language.map((language) => (
        <TouchableOpacity
          key={language}
          style={LanguageStyles.languageOption}
          onPress={() => handleLanguageSelect(language)}
        >
          <Text style={LanguageStyles.languageText}>{language}</Text>
          <Radio selected={language === selectedLanguage} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguagePage;
