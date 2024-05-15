import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { SettingsPageStyles } from './SettingsStyles';
import { languages } from '../../commonConstants/sharedConstants';


const SettingsPage = () => {
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const [showModal, setShowModal] = useState(false);
  const [userSettings, setUserSettings] = useState<any>();

  const navigation = useNavigation();

  
 const handleCurrencyClick = (currency: any, language: any) => {
  // @ts-ignore
  navigation.navigate('Currency', { defaultCurrency: currency, selectedLanguage: language});
};

  const handleLanguageClick = (language: any ) => {
  // @ts-ignore    
  navigation.navigate('Language', { defaultLanguage: language });
};

 const handleNotificationsClick = (language: any) => {
  // @ts-ignore    
  navigation.navigate('Notifications', { selectedLanguage: language });
};

 const handleBugReportClick = (language: any) => {
  // @ts-ignore   
  navigation.navigate('Report', { selectedLanguage: language });
};

 const handleConnectClick = (language: any) => {
  // @ts-ignore   
  navigation.navigate('Connect', { selectedLanguage: language });
};

 const handleFaqClick = (language: any) => {
  // @ts-ignore    
  navigation.navigate('FAQ', { selectedLanguage: language });
};

 
  const handleLogout = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    authCtx.logout();
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  const fetchUserSettings = async () => {
    try {
      const settingsQuery = query(collection(db, 'users'),  where('uid', '==', userId))
      const querySnapshot = await getDocs(settingsQuery);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0]?.data(); 
        if (userData) {
          setUserSettings(userData as any);
        } else {
        }
      } else {
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error.message);
    }
  };
  
  useEffect(() => {
    fetchUserSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserSettings();
    });
  
    return unsubscribe;
  }, [navigation]);


  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
    }
  }, [isFocused]);

  return (
    <ScrollView style={SettingsPageStyles.background}>
    <View style={SettingsPageStyles.container}>
      <View style={SettingsPageStyles.sectionContainer}>
        <Text style={SettingsPageStyles.sectionTitle}>{languages[selectedLanguage].general}</Text>
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={() => handleCurrencyClick(userSettings.currency, selectedLanguage)}>

          <Ionicons name="cash-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].currency}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={() => handleLanguageClick(userSettings.language)}>
          <Ionicons name="language-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].language}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={ () => handleNotificationsClick(selectedLanguage)}>
          <Ionicons name="notifications-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].notifications}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={SettingsPageStyles.sectionContainer}>
        <Text style={SettingsPageStyles.sectionTitle}>{languages[selectedLanguage].support}</Text >
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={() => handleBugReportClick(selectedLanguage)}>
          <Ionicons name="bug-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].bugReport}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={() => handleConnectClick(selectedLanguage)}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].connectWithUs}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={SettingsPageStyles.optionContainer} onPress={() => handleFaqClick(selectedLanguage)}>
          <Ionicons name="information-circle-outline" size={24} color="black" style={SettingsPageStyles.icon} />
          <Text style={SettingsPageStyles.optionText}>{languages[selectedLanguage].faq}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[ SettingsPageStyles.logoutButton]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" style={SettingsPageStyles.icon} />
        <Text style={SettingsPageStyles.logoutButtonText}>{languages[selectedLanguage].signOut}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCancelLogout}
      >
        <View style={SettingsPageStyles.modalContainer}>
          <View style={SettingsPageStyles.modalContent}>
            <Text style={SettingsPageStyles.modalText}>Are you sure you want to sign out?</Text>
            <View style={SettingsPageStyles.modalButtons}>
              <Button title="Yes" onPress={handleConfirmLogout} />
              <Button title="Cancel" onPress={handleCancelLogout} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>

  );
};

export default SettingsPage;
