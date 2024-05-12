import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertCurrencyToCurrency } from '../../../util/conversion';
import Radio from '../../../components/CommonComponents/Radio';
import { getCurrencySymbol, languages } from '../../../commonConstants/sharedConstants';
import { currencies } from '../SettingsConstants';
import { CurrencyStyles } from '../SettingsStyles';

const CurrencyPage = () => {
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const route: any = useRoute();

  const defaultCurrency = route.params?.defaultCurrency ?? 'USD';
  const selectedLanguage = route.params?.selectedLanguage ?? 'English';

  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  const updateUserCurrency = async (newCurrency: string) => {
    try {
        const settingsQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const querySnapshot = await getDocs(settingsQuery);

        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await updateDoc(doc.ref, { currency: newCurrency });

                const newSymbol = getCurrencySymbol(newCurrency)  
                // OpenExhangeRate API call from USD to the choosen currency
                const result = await convertCurrencyToCurrency('USD', newCurrency);
                await AsyncStorage.setItem('conversionRate', result.toString());
                await AsyncStorage.setItem('symbol', newSymbol);
            }
        } else {
            console.error('No user document found.');
        }
    } catch (error) {
        console.error('Error updating user currency:', error);
    }
};

  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency.shortName);
    updateUserCurrency(currency.shortName);
  };

  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, []);

  return (
    <View style={CurrencyStyles.container}>
      <Text style={CurrencyStyles.header}>{languages[selectedLanguage].selectCurrency}:</Text>
      {currencies.map((currency) => (
        <TouchableOpacity
          key={currency.shortName}
          style={CurrencyStyles.currencyOption}
          onPress={() => handleCurrencySelect(currency)}
        >
          <Text style={CurrencyStyles.currencyText}>{currency.fullName}</Text>
          <Radio selected={currency.shortName === selectedCurrency} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CurrencyPage;
