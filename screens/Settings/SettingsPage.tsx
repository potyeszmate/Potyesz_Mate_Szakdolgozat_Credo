import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons library
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const SettingsPage = () => {
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  const [showModal, setShowModal] = useState(false);
  const [userSettings, setUserSettings] = useState<any[]>([]);

  const navigation = useNavigation();

  const handleCurrencyClick = () => {
    // @ts-ignore
    navigation.navigate('Currency', { defaultCurrency: userSettings.currency });
  };

  const handleLanguageClick = () => {
    // @ts-ignore    
    navigation.navigate('Language', { defaultLanguage: userSettings.language });
  };

  const handleNotificationsClick = () => {
    // @ts-ignore    
    navigation.navigate('Notifications');
  };

  // const handleThemeClick = () => {
  //   // @ts-ignore    
  //   navigation.navigate('ThemePage', { defaultMode: userSettings.darkMode });
  // };
  
  const handleBugReportClick = () => {
    // @ts-ignore   
    navigation.navigate('Report');
  };

  const handleConnectClick = () => {
    // @ts-ignore   
    navigation.navigate('Connect');
  };

  const handleFaqClick = () => {
    // @ts-ignore    
    navigation.navigate('FAQ');
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
          console.log('Fetched settings:', userData);
        } else {
          console.log('No user data found.');
        }
      } else {
        console.log('No documents found.');
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
        console.log(selectedLanguage)
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
      console.log("In useEffect")
    }
  }, [isFocused]);

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{languages[selectedLanguage].general}</Text>
        <TouchableOpacity style={styles.optionContainer} onPress={handleCurrencyClick}>
          <Ionicons name="cash-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].currency}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleLanguageClick}>
          <Ionicons name="language-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].language}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleNotificationsClick}>
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].notifications}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{languages[selectedLanguage].appearance}</Text>
        <TouchableOpacity style={styles.optionContainer} onPress={handleThemeClick}>
          <Ionicons name="color-palette-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].theme}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View> */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{languages[selectedLanguage].support}</Text >
        <TouchableOpacity style={styles.optionContainer} onPress={handleBugReportClick}>
          <Ionicons name="bug-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].bugReport}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleConnectClick}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].connectWithUs}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleFaqClick}>
          <Ionicons name="information-circle-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{languages[selectedLanguage].faq}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[ styles.logoutButton]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.logoutButtonText}>{languages[selectedLanguage].signOut}</Text>
      </TouchableOpacity>




      {/* Logout confirmation modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtons}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  // logoutOption: {
  //   marginTop: 20,
  //   paddingBottom: 20,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#b23b3b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default SettingsPage;
