import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import currencies from '../../util/currencies.json'; 
import { getCryptoInfo } from "../../util/crypto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price: number
  logo: string;
  percent_change_24h: number;
  description: string;
}

const CryptoCurrenciesScreen = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  const navigation = useNavigation();

  const handleCardPress = (crypto: any) => {
    // @ts-ignore
    navigation.navigate("CryptoDetails", { currency: crypto });
  };
  
  useEffect(() => {
    // Store the original currencies data
    const originalCurrenciesData = currencies.data.slice(0, 10);
  
    const fetchData = async () => {
      // Get the IDs of current cryptocurrencies
      const currentIds = originalCurrenciesData.map(crypto => crypto.id);
      console.log("currentIds: ", currentIds)
  
      try {
        // Check if data is already fetched from local storage
        const cachedData = await AsyncStorage.getItem('cryptosData');
  
        if (cachedData) {
          const cachedCryptos: Crypto[] = JSON.parse(cachedData);
          setCryptos(cachedCryptos);
            
          // Get the IDs of cached cryptocurrencies
          const cachedIds = cachedCryptos.map(crypto => crypto.id);
          console.log("cachedIds: ", cachedIds)
  
          // Compare IDs to check if there are new cryptocurrencies
          const newIds = currentIds.filter(id => !cachedIds.includes(id));
          console.log("newIds",newIds)
  
          const removedIds = cachedIds.filter(id => !currentIds.includes(id));
          console.log("removedIds", removedIds);
  
          if (newIds.length > 0 || removedIds.length > 0) {
            // Fetch data for new cryptocurrencies
            const logosResponse = await getCryptoInfo(currentIds); // Use currentIds here
            const cryptosWithLogos = originalCurrenciesData.map((crypto: any) => ({
                
              id: crypto.id,
              name: crypto.name,
              symbol: crypto.symbol,
              price: crypto.quote.USD.price, // Access price from the USD object within quote
              percent_change_24h: crypto.quote.USD.percent_change_24h,
              logo: logosResponse.data[crypto.id].logo, // Use crypto id to get the logo from logosResponse,
              description: logosResponse.data[crypto.id].description,

            }));

            console.log("percantage: ", cryptosWithLogos[0] && cryptosWithLogos[0].percent_change_24h)
  
            // Merge new cryptocurrencies with cached ones
            const updatedCryptos = cryptosWithLogos;
  
            // Cache updated data in local storage
            await AsyncStorage.setItem('cryptosData', JSON.stringify(updatedCryptos));
  
            // Update state
            setCryptos(updatedCryptos);
          }
          
          return; // Exit early if data is already cached
        }

        console.log("TEST!!!!!!!!!!!!!!!!!!")
        // Fetch data from API if not cached
        const ids = originalCurrenciesData.map((crypto) => crypto.id);
        const logosResponse = await getCryptoInfo(ids);
        
        // Map logos to cryptocurrencies
        const cryptosWithLogos = originalCurrenciesData.map((crypto) => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: crypto.quote.USD.price,
          percent_change_24h: crypto.quote.USD.percent_change_24h,
          logo: logosResponse.data[crypto.id].logo,
          description: logosResponse.data[crypto.id].description,
        }));
  
        console.log("percantage: ", cryptosWithLogos[0] && cryptosWithLogos[0].percent_change_24h)

        // Cache data in local storage
        await AsyncStorage.setItem('cryptosData', JSON.stringify(cryptosWithLogos));
  
        // Set state
        setCryptos(cryptosWithLogos);
      } catch (error) {
        console.error(error);
        // Handle errors
      }
    };
  
    // Fetch data only on first page visit
    (async () => {
      // const fetchStatus = await AsyncStorage.getItem('cryptosData');
      await fetchData();
    })();
  }, []);
  
  
  
  return (
    <ScrollView style={styles.container}>
      {cryptos.map(crypto => (
        <TouchableOpacity key={crypto.id} style={styles.card} onPress={() => handleCardPress(crypto)}>
          <View style={styles.left}>
            <Image source={{ uri: crypto.logo }} style={styles.logo} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.bold}>{crypto.name}</Text>
              <Text>{crypto.symbol}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={styles.bold}>${crypto.price.toFixed(0)}</Text>
            <View style={styles.changeContainer}>
              {crypto.percent_change_24h < 0 ? (
                <FontAwesome name="caret-down" size={30} color="red" style={{ paddingRight: 5 }} />
              ) : (
                <FontAwesome name="caret-up" size={30} color="green" style={{ paddingRight: 5 }} />
              )}
              <Text style={crypto.percent_change_24h < 0 ? styles.red : styles.green}>
                {Math.abs(crypto.percent_change_24h).toFixed(2)}%
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderRadius: 15,
      marginBottom: 15,
      alignItems: 'center',
      paddingLeft: 17,
      paddingRight: 17,
      paddingBottom: 10,
      paddingTop: 10,
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    right: {
      flex: 1,
      alignItems: 'flex-end',
    },
    logo: {
      width: 40,
      height: 40,
    },
    bold: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    green: {
      color: 'green',
    },
    red: {
      color: 'red',
    },
  });
  
export default CryptoCurrenciesScreen;
