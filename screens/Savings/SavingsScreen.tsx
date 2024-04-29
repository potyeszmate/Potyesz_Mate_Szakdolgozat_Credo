import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Budget from '../../components/Budget/Budget';

import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import { db } from '../../firebaseConfig';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

// TODO: Add to languages, move to styles and constants, move methods to helper, etc.
const SavingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profile, setProfile] = useState(null as any);

  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;  

  const handleGoalsClick = () => {
    // @ts-ignore
    navigation.navigate('Goals');

  };

  const handleCryptoCurrenciesClick = () => {
    if (profile && profile.isPremiumUser) {
      // @ts-ignore
      navigation.navigate('Cryptocurrencies');
    } else {
      // @ts-ignore
      navigation.navigate('Payment');
    }
  };
  
  const handleStocksClick = () => {
    if (profile && profile.isPremiumUser) {
      // @ts-ignore
      navigation.navigate('Stocks');
    } else {
      // @ts-ignore
      navigation.navigate('Payment');
    }
  };
  
  async function getUserSettings(uid: any) {
    setIsProfileLoading(true)
    const settingsRef = collection(db, 'users');
    const q = query(settingsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userSettings = querySnapshot?.docs[0]?.data();
        setIsProfileLoading(false)
        return userSettings;
    }
    setIsProfileLoading(false)

}

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
    const language = await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    const checkDataAndUpdate = async () => {
        if (isFocused) {

      const isprofileChanged = await AsyncStorage.getItem('profileChanged');

      if (isprofileChanged == "true") {
        setIsProfileLoading(true)

        await AsyncStorage.setItem('profileChanged', 'false');
        const newProfile = await getUserSettings(userId);
        await setProfile(newProfile);
        setIsProfileLoading(false)

      }
      fetchLanguage();
    }
  };
  
  checkDataAndUpdate(); 
  }, [isFocused]);

  useEffect(() => {
    const fetchProfile = async () => {
      const settings = await getUserSettings(userId);
      setProfile(settings)
    };
    fetchProfile(); 
  }, [userId]);

  if (isProfileLoading || !profile) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.rootContainer}>

      <View style={styles.space}></View>

      <TouchableOpacity style={styles.recurringCard} onPress={handleGoalsClick}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../../assets/Recurrings/saving.png')} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Goals</Text>
            <Text style={styles.subtitleText}>Your goals</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recurringCard} onPress={handleCryptoCurrenciesClick}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../../assets/Recurrings/cryptocurrency.png')} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
          <Text style={styles.titleText}>Cryptocurrencies</Text>
            <Text style={styles.subtitleText}>Bitcoin, Ethereum, etc</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recurringCard} onPress={handleStocksClick}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../../assets/Recurrings/chart.png')} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Stocks</Text>
            <Text style={styles.subtitleText}>Apple, NVIDIA, Tesla, etc</Text>
          </View>
          <Image source={require('../../assets/angle-right.png')} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  space: {
    marginBottom: 10,
  },
  recurringCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    borderColor: '#F3F4F7',
    borderWidth: 1
    
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 4
  },
  iconContainer: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 14,
  },
  icon: {
    width: 40,
    height: 40,
  },
  
  subtitleText: {
    color: 'grey',
  },
  navigationArrow: {
    fontSize: 24,
    color: 'black',
  },
});

export default SavingsScreen;
