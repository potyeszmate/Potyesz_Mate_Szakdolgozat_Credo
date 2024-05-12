import React, { useState, useEffect, useRef, useContext } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import currencies from '../../../db/currencies.json';
import { getCryptoInfo } from "../../../util/crypto";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SearchBar } from 'react-native-elements'; 
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from "../../../store/auth-context";
import { Ionicons } from '@expo/vector-icons';
import { CryptoStyles } from "../SavingsStyles";
import { Crypto, SavingsParams } from "../SavingsTypes";
import { languages } from "../../../commonConstants/sharedConstants";


const CryptoCurrenciesScreen = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [ownedCryptos, setOwnedCryptos] = useState<Crypto[]>([]);
  const [watchlistedCryptos, setWatchlistedCryptos] = useState<Crypto[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const searchBarRef = useRef(null);
  const [isWatchlistedExpanded, setIsWatchlistedExpanded] = useState(true);
  const [isOwnedExpanded, setIsOwnedExpanded] = useState(true);
  const [totalOwnedValue, setTotalOwnedValue] = useState('0.00');
  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;

  const route = useRoute<RouteProp<{ params: SavingsParams }>>();

  const { symbol, selectedLanguage, conversionRate, currency } = route.params || {}
  
  const fetchCryptoDetails = async (cryptoIds: any) => {
    const detailsWithLogo = await Promise.all(cryptoIds.map(async (id) => {
      const info = await getCryptoInfo(id);
      return info.data[id] || {};
    }));

    return detailsWithLogo;
  };

  const fetchCryptos = async () => {
    setLoading(true);
    const watchedQuery = query(collection(db, 'watchedCryptoCurrencies'), where('uid', '==', userId));
    const watchedSnapshot = await getDocs(watchedQuery);
    const watchedCryptos = watchedSnapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));

    const ownedQuery = query(collection(db, 'cryptocurrencies'), where('uid', '==', userId));
    const ownedSnapshot = await getDocs(ownedQuery);
    const ownedCryptos = ownedSnapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));

    const allCryptoIds = Array.from(new Set([...watchedCryptos.map(c => c.id), ...ownedCryptos.map(c => c.id)]));
    const cryptoDetails = await fetchCryptoDetails(allCryptoIds);

    const combinedWatchedCryptos = watchedCryptos.map(c => {
      const details = cryptoDetails.find(d => d.id === c.id);
      const currency = currencies.data.find(cur => cur.id === c.id);
      return { ...c, ...details, ...currency?.quote.USD };
    });

    const combinedOwnedCryptos = ownedCryptos.map(c => {
      const details = cryptoDetails.find(d => d.id === c.id);
      const currency = currencies.data.find(cur => cur.id === c.id);
      return { ...c, ...details, ...currency?.quote.USD };
    });

    setWatchlistedCryptos(combinedWatchedCryptos);
    setOwnedCryptos(combinedOwnedCryptos);
    setLoading(false);
  };

  const handleCardPress = (id: any, name: string, currencySymbol: string) => {
    console.log(selectedLanguage)
    // @ts-ignore
    navigation.navigate("Crypto Details", { id: id, name: name, currencySymbol: currencySymbol, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, onGoBack: fetchCryptos});
  };

  const updateSearch = (searchText: string) => {
    setSearch(searchText);
    if (searchText.length >= 3) {
      const filteredResults: any = currencies.data.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setScrollEnabled(false);  
    } else {
      setSearchResults([]);
      setScrollEnabled(true); 
    }
  };

  const toggleWatchlisted = () => {
    setIsWatchlistedExpanded(!isWatchlistedExpanded);
  };
  
  const toggleOwned = () => {
    setIsOwnedExpanded(!isOwnedExpanded);
  };
  
  useEffect(() => {
    fetchCryptos();
  }, []);

  useEffect(() => {
    const totalValue = ownedCryptos.reduce((acc, crypto) => {
      const value = (crypto.price * crypto.amount);
      return acc + value;
    }, 0);
  
    setTotalOwnedValue(totalValue.toFixed(2)); 
  }, [ownedCryptos]);

  const CryptoCard = ({ crypto, isOwned }) => {
    const isNegative = crypto.percent_change_24h < 0;
    const iconDirection = isNegative ? 'caret-down-outline' : 'caret-up-outline';
    const changeColor = isNegative ? 'red' : 'green';
    const calculatedValue = isOwned ? (crypto.price * crypto.amount).toFixed(2) : crypto.price.toFixed(2);
  
    return (
      <TouchableOpacity style={CryptoStyles.card} onPress={() => handleCardPress(crypto.id, crypto.name, crypto.symbol,)}>
        <View style={CryptoStyles.cryptoInfo}>
          <Image source={{ uri: crypto.logo }} style={CryptoStyles.logo} />
          <View>
            <Text style={CryptoStyles.name}>{crypto.name}</Text>
            <Text style={CryptoStyles.symbol}>{crypto.symbol}</Text>
          </View>
        </View>
        <View style={CryptoStyles.cryptoValue}>
          <Text style={CryptoStyles.price}>
            {(parseFloat(calculatedValue) * conversionRate ).toFixed(2)} {symbol}
            </Text>
          <View style={CryptoStyles.changeContainer}>
            <Ionicons name={iconDirection} size={14} color={changeColor} />
            <Text style={[CryptoStyles.percentChange, { color: changeColor }]}>
              {crypto.percent_change_24h.toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => (
    <ScrollView 
      style={[CryptoStyles.overlayContainer, { top: searchBarHeight + 20 }]}
      nestedScrollEnabled={true} 
    >
      {searchResults.map((crypto: any) => (
        <TouchableOpacity
          key={crypto.id}
          style={CryptoStyles.card}
          onPress={() => handleCardPress(crypto.id, crypto.name, crypto.symbol)}
        >
          <View> 
            <Text style={CryptoStyles.name}>{crypto.name}</Text>
            <Text style={CryptoStyles.symbol}>{crypto.symbol}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={CryptoStyles.container}>
      <SearchBar
        ref={searchBarRef}
        placeholder= {languages[selectedLanguage].searchCryptos}
        onChangeText={updateSearch}
        value={search}
        round 
        containerStyle={CryptoStyles.searchBarContainer}
        inputContainerStyle={CryptoStyles.searchBarInputContainer}
        inputStyle={CryptoStyles.searchBarInput}
        clearIcon
        searchIcon={{ size: 24 }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setSearchBarHeight(height);
        }}
      />

      {search.length >= 3 && renderSearchResults()}

      <View style={CryptoStyles.cryptoContainer}>
        <View style={CryptoStyles.containerHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="briefcase-outline" size={24} color="#333" style={CryptoStyles.sectionIcon} />
          <Text style={CryptoStyles.containerTitle}>{languages[selectedLanguage].portfolio}</Text>
          { !loading && (
            <>
              <Text style={CryptoStyles.dotSeparator}>•</Text>
              <Text style={CryptoStyles.totalValueText}>
              {(parseFloat(totalOwnedValue) * conversionRate ).toFixed(2)} {symbol}
              </Text>
              {/* `${(parseFloat(totalOwnedValue) * conversionRate).toFixed(2)} ${symbol}` */}
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
            {index < ownedCryptos.length - 1 && <View style={CryptoStyles.separator} />}
          </View>
        ))}
      </View>


    <View style={CryptoStyles.cryptoContainer}>
      <View style={CryptoStyles.containerHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="eye-outline" size={24} color="#333" style={CryptoStyles.sectionIcon} />
        <Text style={CryptoStyles.containerTitle}>{languages[selectedLanguage].watchlist}</Text>
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
        {index < watchlistedCryptos.length - 1 && <View style={CryptoStyles.separator} />} 
        </View>

      ))}
    </View>

      {loading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
};
  
export default CryptoCurrenciesScreen;
