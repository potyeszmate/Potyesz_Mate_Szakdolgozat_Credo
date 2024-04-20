// Import necessary modules and functions
import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompanyInfo, getStockPrice } from "../../util/stocks";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

// Define the Stock interface
interface Stock {
  name: string;
  symbol: string;
  price: number;
  logo: string;
  todaysChangePerc: number;

}

const StockScreen = () => {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Array of stock symbols to fetch data for
        const symbols = ["MSFT", "GOOGL", "AMZN", "TSLA"];
  
        // Retrieve cached stock data from AsyncStorage
        const cachedStockDataString = await AsyncStorage.getItem('stockData');
        const cachedStockData: Stock[] = cachedStockDataString ? JSON.parse(cachedStockDataString) : [];
  
        // Check if the symbols array has changed
        const symbolsChanged = JSON.stringify(symbols) !== JSON.stringify(cachedStockData.map(stock => stock.symbol));
  
        if (!symbolsChanged) {
          // Symbols array hasn't changed, use cached data
          setStockData(cachedStockData);
          setLoading(false);
          return;
        }
  
        // Fetch data for each symbol that hasn't been fetched before
        const newSymbols = symbols.filter(symbol => !cachedStockData.map(stock => stock.symbol).includes(symbol));
        const removedSymbols = cachedStockData.filter(stock => !symbols.includes(stock.symbol));
  
        // Fetch data for new symbols
        const newData = await Promise.all(newSymbols.map(async symbol => {
          // Fetch price data
          const priceResponse = await getStockPrice(symbol);
        //   const price = priceResponse.results[0]?.c;
          const price = priceResponse.ticker.day.c;
          const todaysChangePerc = priceResponse.ticker.todaysChangePerc;

  
          // Fetch info data
          const infoResponse = await getCompanyInfo(symbol);
          const info = infoResponse.results;
  
          // Construct the logo URL with the API key
          const companyLogo = `${info.branding?.icon_url}?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8`;
  
          return {
            symbol,
            name: info.name,
            logo: companyLogo,
            price: price || "N/A", // Use price if available, otherwise "N/A"
            todaysChangePerc: todaysChangePerc || 0, // Use todaysChangePerc if available, otherwise 0

          };
        }));
  
        // Update stockData state with fetched data
        const updatedStockData = [...cachedStockData.filter(stock => !removedSymbols.includes(stock)), ...newData];
        setStockData(updatedStockData);
        setLoading(false);
  
        // Cache the updated stock data
        await AsyncStorage.setItem('stockData', JSON.stringify(updatedStockData));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        // Handle error
      }
    };
  
    // Fetch data
    fetchData();
  }, []);
  

  return (
    <ScrollView style={styles.container}>
      {stockData.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        stockData.map((stock, index) => (
        <View key={index} style={styles.card}>
            <View style={styles.left}>
              <Image source={{ uri: stock.logo }} style={styles.logo} />
              <View>
                <Text style={styles.name}>{stock.name}</Text>
                <Text style={styles.ticker}>{stock.symbol}</Text>
              </View>
            </View>
            <View style={styles.right}>
            <Text style={styles.value}>${isNaN(stock.price) ? "N/A" : stock.price.toFixed(2)}</Text>
            <View style={styles.changeContainer}>
              {stock.todaysChangePerc < 0 ? (
                <FontAwesome name="caret-down" size={30} color="red" style={{ paddingRight: 5 }} />
              ) : (
                <FontAwesome name="caret-up" size={30} color="green" style={{ paddingRight: 5 }} />
              )}
              <Text style={stock.todaysChangePerc < 0 ? styles.red : styles.green}>
                {Math.abs(stock.todaysChangePerc).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        ))
      )}
    </ScrollView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    alignItems: 'center', // Align center instead of flex-end
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 80,
    paddingBottom: 5
  },
  ticker: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
});

export default StockScreen;
