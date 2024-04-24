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
import { getCompanyInfo, getStockPrice } from "../../util/stocks";
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import stocks from '../../db/stocks.json';

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

  const authCtx: any = useContext(AuthContext);
  const userId = authCtx.userId;

  // Similar to fetchCryptoDetails
  const fetchStockDetails = async (stockSymbols: any) => {
    const detailsWithLogo = await Promise.all(stockSymbols.map(async (symbol) => {
      const infoResponse = await getCompanyInfo(symbol);
      const priceInfo = await getStockPrice(symbol);

      const info = infoResponse.results;
      // const logoUrl = info.branding?.icon_url || '';
      const companyLogo = `${info.branding?.icon_url}?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8`;

      return { 
        symbol, 
        logo: companyLogo, 
        price: priceInfo.ticker.day.c, 
        todaysChangePerc: priceInfo.ticker.todaysChangePerc,
      };
    }));

    return detailsWithLogo;
  };

  // const fetchStocks = async () => {
  //   setLoading(true);
  //   // Fetch watchlisted stocks
  //   const watchedQuery = query(collection(db, 'watchedStocks'), where('uid', '==', userId));
  //   const watchedSnapshot = await getDocs(watchedQuery);
  //   const watchedStockSymbols = watchedSnapshot.docs.map(doc => doc.data().symbol);

  //   // Fetch owned stocks
  //   const ownedQuery = query(collection(db, 'stocks'), where('uid', '==', userId));
  //   const ownedSnapshot = await getDocs(ownedQuery);
  //   const ownedStockSymbols = ownedSnapshot.docs.map(doc => doc.data().symbol);

  //   // Get details for all unique stocks
  //   const allStockSymbols = Array.from(new Set([...watchedStockSymbols, ...ownedStockSymbols]));
  //   const stockDetails = await fetchStockDetails(allStockSymbols);

  //   // Combine data with details from stocks.json
  //   const combinedWatchlistedStocks = watchedStockSymbols.map(symbol => {
  //     const details = stockDetails.find(stock => stock.symbol === symbol);
  //     const stockInfo = stocks.find(stock => stock.symbol === symbol);
  //     return { ...stockInfo, ...details };
  //   });

  //   const combinedOwnedStocks = ownedStockSymbols.map(symbol => {
  //     const details = stockDetails.find(stock => stock.symbol === symbol);
  //     const stockInfo = stocks.find(stock => stock.symbol === symbol);
  //     return { ...stockInfo, ...details };
  //   });

  //   setWatchlistedStocks(combinedWatchlistedStocks);
  //   setOwnedStocks(combinedOwnedStocks);
  //   setLoading(false);
  // };

  const fetchStocks = async () => {
    setLoading(true);
  
    // Fetch watchlisted stocks
    const watchedQuery = query(collection(db, 'watchedStocks'), where('uid', '==', userId));
    const watchedSnapshot = await getDocs(watchedQuery);
    const watchedStockSymbols = watchedSnapshot.docs.map(doc => doc.data().symbol);
  
    // Fetch owned stocks
    const ownedQuery = query(collection(db, 'stocks'), where('uid', '==', userId));
    const ownedSnapshot = await getDocs(ownedQuery);
    const ownedStockData = ownedSnapshot.docs.map(doc => ({
      symbol: doc.data().symbol,
      amount: doc.data().amount
    }));
  
    // Extract only symbols from ownedStockData for detail fetching
    const ownedStockSymbols = ownedStockData.map(stock => stock.symbol);
  
    // Get details for all unique stocks
    const allStockSymbols = Array.from(new Set([...watchedStockSymbols, ...ownedStockSymbols]));
    const stockDetails = await fetchStockDetails(allStockSymbols);
  
    // Combine data with details from stocks.json
    const combinedWatchlistedStocks = watchedStockSymbols.map(symbol => {
      const details = stockDetails.find(stock => stock.symbol === symbol);
      const stockInfo = stocks.find(stock => stock.symbol === symbol);
      return { ...stockInfo, ...details };
    });
  
    const combinedOwnedStocks = ownedStockData.map(stockData => {
      const details = stockDetails.find(detail => detail.symbol === stockData.symbol);
      const stockInfo = stocks.find(stock => stock.symbol === stockData.symbol);
      return {
        ...stockInfo, // Info from stocks.json
        ...details,   // Info from fetchStockDetails
        amount: stockData.amount // Including the fetched amount
      };
    });
  
    setWatchlistedStocks(combinedWatchlistedStocks);
    setOwnedStocks(combinedOwnedStocks);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchStocks();
  }, []);

  const handleCardPress = (name: any, symbol: any) => {
    console.log("symbol before nav: ", symbol)
    // @ts-ignore
    navigation.navigate("StockDetails", {name: name, symbol: symbol});
  };

  const updateSearch = (searchText: any) => {
    setSearch(searchText);
    if (searchText.length >= 3) {
      const filteredResults = stocks.filter((stock) =>
        stock.name && stock.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setScrollEnabled(false);  // Disable scrolling on main ScrollView
    } else {
      setSearchResults([]);
      setScrollEnabled(true);   // Enable scrolling on main ScrollView
    }
  };

  const StockCard = ({ stock, isOwned }) => {
    const changeColor = stock.todaysChangePerc < 0 ? styles.red : styles.green;
    const calculatedValue = isOwned ? (stock.price * stock.amount).toFixed(2) : stock.price.toFixed(2);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress( stock.name, stock.symbol)}>
        <Image source={{ uri: stock.logo }} style={styles.logo} />
        <View style={styles.stockInfo}>
          <Text style={styles.name}>{stock.name}</Text>
          <Text style={styles.symbol}>{stock.symbol}</Text>
        </View>
        <View style={styles.stockValue}>
          <Text style={styles.price}>${calculatedValue}</Text>
          <Text style={[styles.percentChange, changeColor]}>
            {stock.todaysChangePerc.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => (
    <ScrollView 
      style={[styles.overlayContainer, { top: searchBarHeight }]}
      nestedScrollEnabled={true}
    >
      {searchResults.map((stock: any) => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.card}
          onPress={() => handleCardPress(stock.symbol, stock.name)}
        >
          {/* <Image source={{ uri: stock.logo }} style={styles.logo} /> */}
          <View style={styles.stockInfo}>
            <Text style={styles.name}>{stock.name}</Text>
            <Text style={styles.symbol}>{stock.symbol}</Text>
          </View>
          {/* <Text style={styles.price}>${stock.price.toFixed(2)}</Text> */}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <SearchBar
        ref={searchBarRef}
        placeholder="Search Stocks..."
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

      {search.length >= 3 && renderSearchResults()}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>Watchlisted Stocks</Text>
          {watchlistedStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} isOwned={false} />
          ))}

          <Text style={styles.title}>Owned Stocks</Text>
          {ownedStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} isOwned={true} />
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlayContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'white',
    width: '100%',
    marginTop: 10
    // top: searchBarHeight,

  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInput: {
    backgroundColor: '#e9e9e9',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  stockInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
  },
  percentChange: {
    fontSize: 16,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },
  // Add additional styles as needed
});

export default StockScreen;