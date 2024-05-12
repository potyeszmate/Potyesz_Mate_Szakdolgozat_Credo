import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { getCompanyInfo, getStockPrice } from "../../../util/stocks";
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { AuthContext } from "../../../store/auth-context";
import stocks from '../../../db/stocks.json';
import { Ionicons } from '@expo/vector-icons';
import apiKeys from './../../../apiKeys.json';

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SavingsParams, Stock } from "../SavingsTypes";
import { CryptoStyles } from "../SavingsStyles";
import { languages } from "../../../commonConstants/sharedConstants";

const StockScreen = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [ownedStocks, setOwnedStocks] = useState<Stock[]>([]);
  const [watchlistedStocks, setWatchlistedStocks] = useState<Stock[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const searchBarRef = useRef(null);
  const [isOwnedExpanded, setIsOwnedExpanded] = useState(true);
  const [isWatchlistedExpanded, setIsWatchlistedExpanded] = useState(true);
  
  const route = useRoute<RouteProp<{ params: SavingsParams }>>();

  const { symbol, selectedLanguage, conversionRate, currency } = route.params || {}
  
  const toggleOwned = () => setIsOwnedExpanded(!isOwnedExpanded);
  const toggleWatchlisted = () => setIsWatchlistedExpanded(!isWatchlistedExpanded);
  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;

  const fetchStockDetails = async (stockSymbols: any) => {
    const detailsWithLogo = await Promise.all(stockSymbols.map(async (symbol: any) => {
      const infoResponse = await getCompanyInfo(symbol);
      const priceInfo = await getStockPrice(symbol);


      const info = infoResponse.results;
      const companyLogo = `${info.branding?.icon_url}?apiKey=${apiKeys.StocksApiKey}`;

      return { 
        symbol, 
        logo: companyLogo, 
        price: priceInfo.ticker.prevDay.c, 
        todaysChangePerc: priceInfo.ticker.todaysChangePerc,
      };
    }));

    return detailsWithLogo;
  };

  const fetchStocks = async () => {
    setLoading(true);
  
    const watchedQuery = query(collection(db, 'watchedStocks'), where('uid', '==', userId));
    const watchedSnapshot = await getDocs(watchedQuery);
    const watchedStockSymbols = watchedSnapshot.docs.map(doc => doc.data().symbol);
  
    const ownedQuery = query(collection(db, 'stocks'), where('uid', '==', userId));
    const ownedSnapshot = await getDocs(ownedQuery);
    const ownedStockData = ownedSnapshot.docs.map(doc => ({
      symbol: doc.data().symbol,
      amount: doc.data().amount
    }));
  
    const ownedStockSymbols = ownedStockData.map(stock => stock.symbol);
  
    const allStockSymbols = Array.from(new Set([...watchedStockSymbols, ...ownedStockSymbols]));
    const stockDetails = await fetchStockDetails(allStockSymbols);
  
    const combinedWatchlistedStocks = watchedStockSymbols.map(symbol => {
      const details = stockDetails.find(stock => stock.symbol === symbol);
      const stockInfo = stocks.find(stock => stock.symbol === symbol);
      return { ...stockInfo, ...details };
    });
  
    const combinedOwnedStocks = ownedStockData.map(stockData => {
      const details = stockDetails.find(detail => detail.symbol === stockData.symbol);
      const stockInfo = stocks.find(stock => stock.symbol === stockData.symbol);
      return {
        ...stockInfo, 
        ...details,   
        amount: stockData.amount 
      };
    });
  
    setWatchlistedStocks(combinedWatchlistedStocks);
    setOwnedStocks(combinedOwnedStocks);
    setLoading(false);
  };
  
  // const handleCardPress = (name: any, symbol: any) => {
  //   // @ts-ignore
  //   navigation.navigate("Stock Details", {name: name, symbol: symbol, onGoBack: fetchStocks});
  // };

  
  const handleCardPress = (name: string, currencySymbol: string) => {
    console.log(selectedLanguage)
    // @ts-ignore
    navigation.navigate("Stock Details", { name: name, currencySymbol: currencySymbol, symbol: symbol, selectedLanguage: selectedLanguage, conversionRate: conversionRate, onGoBack: fetchStocks});
  };

  const updateSearch = (searchText: any) => {
    setSearch(searchText);
    if (searchText.length >= 3) {
      const filteredResults: any = stocks.filter((stock) =>
        stock.name && stock.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setScrollEnabled(false); 
    } else {
      setSearchResults([]);
      setScrollEnabled(true); 
    }
  };

  const StockCard = ({ stock, isOwned }) => {
    const isNegative = stock.todaysChangePerc < 0;
    const iconDirection = isNegative ? 'caret-down-outline' : 'caret-up-outline';
    const changeColor = isNegative ? 'red' : 'green';
    const calculatedValue = isOwned ? (stock.price * stock.amount).toFixed(2) : stock.price.toFixed(2);
    
    return (
      <TouchableOpacity style={CryptoStyles.card} onPress={() => handleCardPress(stock.name, stock.symbol)}>
        <View style={CryptoStyles.cryptoInfo}>
         <Image source={{ uri: stock.logo }} style={CryptoStyles.logo} />
          <View>
           <Text style={CryptoStyles.name}>{stock.name}</Text>
           <Text style={CryptoStyles.symbol}>{stock.symbol}</Text>
          </View>
        </View>
        <View style={CryptoStyles.cryptoValue}>
          <Text style={CryptoStyles.price}>
            {(parseFloat(calculatedValue) * conversionRate ).toFixed(2)} {symbol}
            </Text>
          <View style={CryptoStyles.changeContainer}>
            <Ionicons name={iconDirection} size={14} color={changeColor} />
            <Text style={[CryptoStyles.percentChange, { color: changeColor }]}>
              {stock.todaysChangePerc.toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const totalOwnedValue = ownedStocks.reduce((acc, stock) => acc + (stock.price * stock.amount), 0).toFixed(2);


  const renderSearchResults = () => (
    <ScrollView 
      style={[CryptoStyles.overlayContainer, { top: searchBarHeight + 8 }]}
      nestedScrollEnabled={true}
    >
      {searchResults.map((stock: any) => (
        <TouchableOpacity
          key={stock.symbol}
          style={CryptoStyles.card}
          onPress={() => handleCardPress( stock.name, stock.symbol)}
        >
          <View>
            <Text style={CryptoStyles.name}>{stock.name}</Text>
            <Text style={CryptoStyles.symbol}>{stock.symbol}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  useEffect(() => {
    fetchStocks();
  }, []);


  return (
    <ScrollView style={CryptoStyles.container} scrollEnabled={scrollEnabled}>
      <SearchBar
        ref={searchBarRef}
        placeholder={languages[selectedLanguage].searchStocks}
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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
         
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
        {isOwnedExpanded && ownedStocks.map((stock, index) => (
          <View key={stock.id}> 
            <StockCard key={stock.symbol} stock={stock} isOwned={true} />
            {index < ownedStocks.length - 1 && <View style={CryptoStyles.separator} />}
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
        {isWatchlistedExpanded && watchlistedStocks.map((stock, index) => (
          <View> 
          <StockCard key={stock.symbol} stock={stock} isOwned={false} />
          {index < ownedStocks.length - 1 && <View style={CryptoStyles.separator} />} 
          </View>

        ))}
      </View>

        </>
      )}
    </ScrollView>
  );
};

export default StockScreen;