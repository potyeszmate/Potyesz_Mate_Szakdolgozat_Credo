import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import currencies from '../../util/currencies.json'; 
import { getCryptoInfo } from "../../util/crypto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from 'react-native-elements'; 
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";

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
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [ownedCryptos, setOwnedCryptos] = useState([]);
  const [watchlistedCryptos, setWatchlistedCryptos] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const searchBarRef = useRef(null);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;

  const fetchCryptoDetails = async (cryptoIds) => {
    const detailsWithLogo = await Promise.all(cryptoIds.map(async (id) => {
      const info = await getCryptoInfo(id);
      return info.data[id] || {}; // in case some info might be undefined
    }));

    return detailsWithLogo;
  };

  const fetchCryptos = async () => {
    setLoading(true);
    // Fetch watchlisted cryptos
    const watchedQuery = query(collection(db, 'watchedCryptoCurrencies'), where('uid', '==', userId));
    const watchedSnapshot = await getDocs(watchedQuery);
    const watchedCryptos = watchedSnapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));

    // Fetch owned cryptos
    const ownedQuery = query(collection(db, 'cryptocurrencies'), where('uid', '==', userId));
    const ownedSnapshot = await getDocs(ownedQuery);
    const ownedCryptos = ownedSnapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));

    // Get details for all unique cryptos
    const allCryptoIds = Array.from(new Set([...watchedCryptos.map(c => c.id), ...ownedCryptos.map(c => c.id)]));
    const cryptoDetails = await fetchCryptoDetails(allCryptoIds);

    // Combine data with details from currencies.json
    const combinedWatchedCryptos = watchedCryptos.map(c => {
      const details = cryptoDetails.find(d => d.id === c.id);
      const currency = currencies.data.find(cur => cur.id === c.id);
      return { ...c, ...details, ...currency.quote.USD };
    });

    const combinedOwnedCryptos = ownedCryptos.map(c => {
      const details = cryptoDetails.find(d => d.id === c.id);
      const currency = currencies.data.find(cur => cur.id === c.id);
      return { ...c, ...details, ...currency.quote.USD };
    });

    setWatchlistedCryptos(combinedWatchedCryptos);
    setOwnedCryptos(combinedOwnedCryptos);
    setLoading(false);
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  const handleCardPress = (id: any, name: any, symbol: any) => {
    // @ts-ignore
    navigation.navigate("CryptoDetails", { id: id, name: name, symbol: symbol});
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    if (searchText.length >= 3) {
      const filteredResults = currencies.data.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setScrollEnabled(false);  // Disable scrolling on main ScrollView
    } else {
      setSearchResults([]);
      setScrollEnabled(true);   // Enable scrolling on main ScrollView
    }
  };

  const CryptoCard = ({ crypto, isOwned }) => {
    const changeColor = crypto.percent_change_24h < 0 ? styles.red : styles.green;
    const calculatedValue = isOwned ? (crypto.price * crypto.amount).toFixed(2) : crypto.price.toFixed(2);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress(crypto.id, crypto.name, crypto.symbol )}>
        <Image source={{ uri: crypto.logo }} style={styles.logo} />
        <View style={styles.cryptoInfo}>
          <Text style={styles.name}>{crypto.name}</Text>
          <Text style={styles.symbol}>{crypto.symbol}</Text>
        </View>
        <View style={styles.cryptoValue}>
          <Text style={styles.price}>${calculatedValue}</Text>
          <Text style={[styles.percentChange, changeColor]}>
            {crypto.percent_change_24h.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getFilteredCryptos = () => {
    if (search === '') return cryptos;
    return cryptos.filter((crypto) => crypto.name.toLowerCase().includes(search.toLowerCase()));
  };

  const renderSearchResults = () => (
    <ScrollView 
      style={[styles.overlayContainer, { top: searchBarHeight }]}
      nestedScrollEnabled={true}  // Ensure nested scrolling is enabled
    >
      {searchResults.map((crypto: any) => (
        <TouchableOpacity
          key={crypto.id}
          style={styles.card}
          onPress={() => handleCardPress(crypto.id, crypto.name, crypto.symbol)}
        >
          <View> 
            <Text style={styles.name}>{crypto.name}</Text>
            <Text style={styles.symbol}>{crypto.symbol}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );


  // const renderCryptoCard = (crypto, index) => (
  //   <TouchableOpacity key={index} style={styles.card} onPress={() => handleCardPress(crypto)}>
  //     <Image source={{ uri: crypto.logo }} style={styles.logo} />
  //     <Text style={styles.name}>{crypto.name}</Text>
  //     <Text style={styles.symbol}>{crypto.symbol}</Text>
  //     <Text style={styles.price}>${crypto.price.toFixed(2)}</Text>
  //     <Text style={crypto.percent_change_24h < 0 ? styles.red : styles.green}>
  //       {crypto.percent_change_24h.toFixed(2)}%
  //     </Text>
  //   </TouchableOpacity>
  // );

  return (
    <ScrollView style={styles.container}>
      <SearchBar
        ref={searchBarRef}
        placeholder="Search Cryptocurrencies..."
        onChangeText={updateSearch}
        value={search}
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setSearchBarHeight(height);
        }}
      />

      {/* {searchResults.map((crypto, index) => renderCryptoCard(crypto, index))} */}
      {search.length >= 3 && renderSearchResults()}

      <Text style={styles.title}>Watchlisted Cryptocurrencies</Text>
      {/* {watchlistedCryptos.map((crypto, index) => renderCryptoCard(crypto, index))} */}
      {watchlistedCryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} isOwned={false} />
      ))}

      <Text style={styles.title}>Owned Cryptocurrencies</Text>
      {/* {ownedCryptos.map((crypto, index) => renderCryptoCard(crypto, index))} */}
      {ownedCryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} isOwned={true} />
      ))}

      {loading && <ActivityIndicator size="large" />}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#333'
    },
    small: {
      fontSize: 14,
      color: '#666'
    },
    overlayContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 1,
      height: 200,
      // top: searchBarHeight,
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
    resultsScrollView: {
      maxHeight: 200, // You can set the maxHeight to limit the scrolling area height
    },
    red: {
      color: 'red',
    },
    searchContainer: {
      padding: 10,
      backgroundColor: '#EFEFEF', // Adjust color for better visibility
      borderRadius: 10,
      marginVertical: 10
    },
    searchInput: {
      backgroundColor: 'white'
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    symbol: {
      fontSize: 14,
      color: 'gray',
    },
    cryptoInfo: {
      flex: 1,
      marginLeft: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    symbol: {
      fontSize: 14,
      color: '#888',
    },
    cryptoValue: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    percentChange: {
      fontSize: 14,
    },
    red: {
      color: 'red',
    },
    green: {
      color: 'green',
    },
    title: {
      fontSize: 22,
      marginTop: 20,
    },
  });
  
export default CryptoCurrenciesScreen;
