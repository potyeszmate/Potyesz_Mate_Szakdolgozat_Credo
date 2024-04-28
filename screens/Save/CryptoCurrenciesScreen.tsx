import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import currencies from '../../db/currencies.json';
import { getCryptoInfo } from "../../util/crypto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from 'react-native-elements'; 
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { Ionicons } from '@expo/vector-icons';

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
  const [isWatchlistedExpanded, setIsWatchlistedExpanded] = useState(true);
  const [isOwnedExpanded, setIsOwnedExpanded] = useState(true);
  const [totalOwnedValue, setTotalOwnedValue] = useState(0);

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

  useEffect(() => {
    const totalValue = ownedCryptos.reduce((acc, crypto) => {
      const value = (crypto.price * crypto.amount);
      return acc + value;
    }, 0);
  
    setTotalOwnedValue(totalValue.toFixed(2)); // Keep two decimal points
  }, [ownedCryptos]);

  const handleCardPress = (id: any, name: any, symbol: any) => {
    // @ts-ignore
    navigation.navigate("Crypto Details", { id: id, name: name, symbol: symbol, onGoBack: fetchCryptos});
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
    const isNegative = crypto.percent_change_24h < 0;
    const iconDirection = isNegative ? 'caret-down-outline' : 'caret-up-outline';
    const changeColor = isNegative ? 'red' : 'green';
    const calculatedValue = isOwned ? (crypto.price * crypto.amount).toFixed(2) : crypto.price.toFixed(2);
  
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress(crypto.id, crypto.name, crypto.symbol)}>
        <View style={styles.cryptoInfo}>
          <Image source={{ uri: crypto.logo }} style={styles.logo} />
          <View>
            <Text style={styles.name}>{crypto.name}</Text>
            <Text style={styles.symbol}>{crypto.symbol}</Text>
          </View>
        </View>
        <View style={styles.cryptoValue}>
          <Text style={styles.price}>${calculatedValue}</Text>
          <View style={styles.changeContainer}>
            <Ionicons name={iconDirection} size={14} color={changeColor} />
            <Text style={[styles.percentChange, { color: changeColor }]}>
              {crypto.percent_change_24h.toFixed(2)}%
            </Text>
          </View>
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
      style={[styles.overlayContainer, { top: searchBarHeight + 20 }]}
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

  const toggleWatchlisted = () => {
    setIsWatchlistedExpanded(!isWatchlistedExpanded);
  };
  
  const toggleOwned = () => {
    setIsOwnedExpanded(!isOwnedExpanded);
  };
  


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
        round // already makes it rounded
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
        clearIcon
        searchIcon={{ size: 24 }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setSearchBarHeight(height);
        }}
      />


      {/* {searchResults.map((crypto, index) => renderCryptoCard(crypto, index))} */}
      {search.length >= 3 && renderSearchResults()}

    

      <View style={styles.cryptoContainer}>
        <View style={styles.containerHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="briefcase-outline" size={24} color="#333" style={styles.sectionIcon} />
          <Text style={styles.containerTitle}>Portfolio</Text>
          { !loading && (
            <>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.totalValueText}>${totalOwnedValue}</Text>
            </>
          )}
        </View>
          <TouchableOpacity onPress={toggleOwned}>
            <Ionicons
              name={isOwnedExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
        {isOwnedExpanded && ownedCryptos.map((crypto, index) => (
          <View key={crypto.id}> 
            <CryptoCard crypto={crypto} isOwned={true} />
            {index < ownedCryptos.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>


    <View style={styles.cryptoContainer}>
      <View style={styles.containerHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="eye-outline" size={24} color="#333" style={styles.sectionIcon} />
        <Text style={styles.containerTitle}>Watchlist</Text>
        </View>

        <TouchableOpacity onPress={toggleWatchlisted}>
          <Ionicons
            name={isWatchlistedExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>
      {isWatchlistedExpanded && watchlistedCryptos.map((crypto, index) => (
        <View> 
        <CryptoCard key={crypto.id} crypto={crypto} isOwned={false} />
        {index < watchlistedCryptos.length - 1 && <View style={styles.separator} />} 
        </View>

      ))}
    </View>

      {loading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      // padding: 20,
      marginLeft: 10,
      marginRight: 10
    },
    card: {
      // backgroundColor: '#fff',
      borderRadius: 8,
      padding: 15,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between', // space items between the sides of the card
    },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#333'
    },
    dotSeparator: {
      fontSize: 24,
      marginHorizontal: 8,
      color: '#333',
    },
    totalValueText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    small: {
      fontSize: 14,
      color: '#666'
    },
    containerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff', // Ensure this matches the cryptoContainer's background
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    separator: {
      height: 1,
      backgroundColor: '#E2E2E2', // Color for the separator
      width: '91%', // Separator should span the full width
      alignSelf: 'center',
    },
    containerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    sectionIcon: {
      marginRight: 14,
      marginBottom: 1
    },
    overlayContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,0.92)',
      zIndex: 2,
      height: 200,
      marginTop: 10
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
      borderRadius: 20,
      marginRight:10

    },
    bold: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    changeContainer: {
      flexDirection: 'row', // Make icon and text appear in a row
      alignItems: 'center', // Center items vertically
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
      color: '#888',
    },
    cryptoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // name: {
    //   fontSize: 16,
    //   fontWeight: 'bold',
    // },
    // symbol: {
    //   fontSize: 14,
    //   color: '#888',
    // },
    iconStyle: {
      marginLeft: 5,
    },
    cryptoValue: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4, // Spacing between price and percentage change
    },
    percentChange: {
      fontSize: 14,
    },
    // red: {
    //   color: 'red',
    // },
    // green: {
    //   color: 'green',
    // },
    title: {
      fontSize: 22,
      marginTop: 20,
    },
    cryptoContainer: {
      backgroundColor: '#fff', // The color should match the cards
      borderRadius: 8,
      marginVertical: 10,
      // paddingHorizontal: 10,
      width: '95%', // Set width to 95% to make it wider
      alignSelf: 'center', // Center the container
    },
    searchBarContainer: {
      backgroundColor: 'transparent', // Use the same background color as your app's theme
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: 10,
    },
    searchBarInputContainer: {
      backgroundColor: 'white',
      borderRadius: 20, // Slightly less round than the full height to give some shape
      height: 45, // Or any height that works with your design
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    searchBarInput: {
      color: 'black', // text color
      backgroundColor: 'white', // background color of the input area
      borderRadius: 15, // round the corners of the input
    },
  });
  
export default CryptoCurrenciesScreen;
