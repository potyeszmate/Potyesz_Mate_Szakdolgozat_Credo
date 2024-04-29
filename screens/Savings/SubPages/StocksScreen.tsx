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

import { useNavigation } from "@react-navigation/native";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  logo: string;
  todaysChangePerc: number;
}

const StockScreen = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [watchlistedStocks, setWatchlistedStocks] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const searchBarRef = useRef(null);
  const [isOwnedExpanded, setIsOwnedExpanded] = useState(true);
  const [isWatchlistedExpanded, setIsWatchlistedExpanded] = useState(true);
  
  const toggleOwned = () => setIsOwnedExpanded(!isOwnedExpanded);
  const toggleWatchlisted = () => setIsWatchlistedExpanded(!isWatchlistedExpanded);
  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;

  const fetchStockDetails = async (stockSymbols: any) => {
    const detailsWithLogo = await Promise.all(stockSymbols.map(async (symbol) => {
      const infoResponse = await getCompanyInfo(symbol);
      const priceInfo = await getStockPrice(symbol);


      const info = infoResponse.results;
      const companyLogo = `${info.branding?.icon_url}?apiKey=${apiKeys.StocksApiKey}`;

      return { 
        symbol, 
        logo: companyLogo, 
        price: priceInfo.ticker.min.c, 
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
  
  const handleCardPress = (name: any, symbol: any) => {
    // @ts-ignore
    navigation.navigate("Stock Details", {name: name, symbol: symbol, onGoBack: fetchStocks});
  };

  const updateSearch = (searchText: any) => {
    setSearch(searchText);
    if (searchText.length >= 3) {
      const filteredResults = stocks.filter((stock) =>
        stock.name && stock.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setScrollEnabled(false); 
      console.log("searchResults: ", searchResults) 
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
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress(stock.name, stock.symbol)}>
        <View style={styles.cryptoInfo}>
         <Image source={{ uri: stock.logo }} style={styles.logo} />
          <View>
           <Text style={styles.name}>{stock.name}</Text>
           <Text style={styles.symbol}>{stock.symbol}</Text>
          </View>
        </View>
        <View style={styles.cryptoValue}>
          <Text style={styles.price}>${calculatedValue}</Text>
          <View style={styles.changeContainer}>
            <Ionicons name={iconDirection} size={14} color={changeColor} />
            <Text style={[styles.percentChange, { color: changeColor }]}>
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
      style={[styles.overlayContainer, { top: searchBarHeight + 8 }]}
      nestedScrollEnabled={true}
    >
      {searchResults.map((stock: any) => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.card}
          onPress={() => handleCardPress( stock.name, stock.symbol)}
        >
          <View style={styles.stockInfo}>
            <Text style={styles.name}>{stock.name}</Text>
            <Text style={styles.symbol}>{stock.symbol}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  useEffect(() => {
    fetchStocks();
  }, []);


  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <SearchBar
        ref={searchBarRef}
        placeholder="Search Stocks..."
        onChangeText={updateSearch}
        value={search}
        round
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


      {search.length >= 3 && renderSearchResults()}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
         
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
        {isOwnedExpanded && ownedStocks.map((stock, index) => (
          <View key={stock.id}> 
            <StockCard key={stock.symbol} stock={stock} isOwned={true} />
            {index < ownedStocks.length - 1 && <View style={styles.separator} />}
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
        {isWatchlistedExpanded && watchlistedStocks.map((stock, index) => (
          <View> 
          <StockCard key={stock.symbol} stock={stock} isOwned={false} />
          {index < ownedStocks.length - 1 && <View style={styles.separator} />} 
          </View>

        ))}
      </View>

        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 10
  },
  card: {
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between', 
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E2E2', 
    width: '91%', 
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
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  green: {
    color: 'green',
  },
  resultsScrollView: {
    maxHeight: 200, 
  },
  red: {
    color: 'red',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#EFEFEF', 
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

  iconStyle: {
    marginLeft: 5,
  },
  cryptoValue: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4, 
  },
  percentChange: {
    fontSize: 14,
  },

  title: {
    fontSize: 22,
    marginTop: 20,
  },
  cryptoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    width: '95%', 
    alignSelf: 'center', 
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
    borderRadius: 20, 
    height: 45, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchBarInput: {
    color: 'black', 
    backgroundColor: 'white', 
    borderRadius: 15,
  },
});

export default StockScreen;