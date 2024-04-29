import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertCurrencyToCurrency } from '../../../util/conversion';
import Radio from '../../../components/CommonComponents/Radio';

const CurrencyPage = () => {
  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const getCurrencySymbol = (currencyCode: any) => {
    
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'HUF':
        return 'HUF';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return ''; 
    }
  };

  const updateUserCurrency = async (newCurrency: string) => {
    try {
        const settingsQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const querySnapshot = await getDocs(settingsQuery);

        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await updateDoc(doc.ref, { currency: newCurrency });

                const newSymbol = getCurrencySymbol(newCurrency)  
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

  
  
  const route: any = useRoute();

  const defaultCurrency = route.params?.defaultCurrency ?? 'USD';

  const currencies = [
    { fullName: 'United States Dollar (USD)', shortName: 'USD' },
    { fullName: 'Euro (EUR)', shortName: 'EUR' },
    { fullName: 'Hungarian Forint (HUF)', shortName: 'HUF' },
    { fullName: 'Australian Dollar (AUD)', shortName: 'AUD' },
    { fullName: 'Canadian Dollar (CAD)', shortName: 'CAD' },
    { fullName: 'British Pound (GBP)', shortName: 'GBP' }
  ]; 

  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency.shortName);
    updateUserCurrency(currency.shortName);
  };

  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a currency:</Text>
      {currencies.map((currency) => (
        <TouchableOpacity
          key={currency.shortName}
          style={styles.currencyOption}
          onPress={() => handleCurrencySelect(currency)}
        >
          <Text style={styles.currencyText}>{currency.fullName}</Text>
          <Radio selected={currency.shortName === selectedCurrency} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  currencyText: {
    flex: 1,
    fontSize: 16,
  },
});

export default CurrencyPage;
