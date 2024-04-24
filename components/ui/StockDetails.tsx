import React, { useState, useEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button } from "react-native";
import { getCompanyInfo, getStockPrice } from "../../util/stocks";
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { Alert } from 'react-native';
import CryptoChart from "./CryptoChart";  // Assuming it can be used or replaced with a similar StockChart
import StockChart from "./StockChart";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  logo: string;
  percent_change_24h: number;
}

const StockDetails = () => {

  const route = useRoute();
  const { symbol, name } = route.params;

  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountOwned, setAmountOwned] = useState('');

  const [stockDetails, setStockDetails] = useState({
    price: 0,
    percent_change_24h: 0,
    logo: '',
    description: '',
    loading: true,
  });

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        console.log("fetching with symbol: ", symbol)
        const infoResponse = await getCompanyInfo(symbol);
        const priceResponse = await getStockPrice(symbol);

        const info = infoResponse.results;
        const companyLogo = `${info.branding?.icon_url}?apiKey=20pxfp55CRF4QFeF0P1uQXdppypX7nk8`

        const logo = companyLogo;  // Ensure the correct path to logo
        const description = info.description;  // Ensure the correct path to description
        const price = priceResponse.ticker.day.c;   //priceResponse.ticker.day.c
        const percent_change_24h = priceResponse.ticker.todaysChangePerc;

        setStockDetails({
          logo,
          description,
          price,
          percent_change_24h,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch stock details:", error);
        setStockDetails(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStockData();
  }, [symbol]);

  const addWatchedListHandler = async () => {
    Alert.alert(
      "Confirm Addition",
      "Are you sure you want to add this stock to your watchlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
            try {
              await addDoc(collection(db, 'watchedStocks'), {
                name: stockDetails.name,
                symbol,
                uid: userId,
              });
              console.log('Added to watchlist');
            } catch (error) {
              console.error('Error adding to watchlist:', error.message);
            }
          }
        }
      ]
    );
  };

  const addOwnedStocksHandler = async () => {
    const amount = parseFloat(amountOwned);
    try {
      await addDoc(collection(db, 'stocks'), {
        symbol,
        amount,
        uid: userId,
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding owned stock:', error.message);
    }
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  if (stockDetails.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: stockDetails.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>

      <View style={styles.chartPlaceholder}>
        <StockChart symbol={symbol} />
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailsRow}>        
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${stockDetails.price.toFixed(2)}</Text>
        <Text style={styles.label}>Change (24h):</Text>
        <Text style={[styles.value, stockDetails.percent_change_24h < 0 ? styles.red : styles.green]}>
          {stockDetails.percent_change_24h.toFixed(2)}%
        </Text>
      </View>

      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Description:</Text>
        <TouchableOpacity onPress={toggleDescription} style={styles.description}>
          <Text numberOfLines={expanded ? undefined : 4}>{stockDetails.description}</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity onPress={addWatchedListHandler} style={[styles.button, styles.watchlistButton]}>
        <Text style={styles.buttonText}>Add to Watchlist</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleModal} style={[styles.button, styles.portfolioButton]}>
        <Text style={styles.buttonText}>Add to Portfolio</Text>
      </TouchableOpacity>

{/* Modal for adding to portfolio */}
<Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter your amount in USD</Text>
            <TextInput
              style={styles.input}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder="Amount in USD"
              keyboardType="numeric"
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity onPress={addOwnedStocksHandler} style={[styles.button, styles.modalButton]}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={[styles.button, styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    header: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 40, // To create a rounded image
    },
    headerText: {
      alignItems: "center",
      marginTop: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
    },
    symbol: {
      fontSize: 18,
      color: "#666",
    },
    details: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      // marginTop: 50,
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
    },
    value: {
      fontSize: 18,
    },
    descriptionContainer: {
      marginBottom: 20,
      padding: 10,
    },
    description: {
      backgroundColor: "#f2f2f2",
      borderRadius: 10,
      padding: 15,
      height: 80, // Smaller fixed height for collapsed description
      overflow: "hidden",
    },
    expandedDescription: {
      maxHeight: "auto",
    },
    readMoreButton: {
      alignItems: "center",
      marginTop: 10,
    },
    readMoreText: {
      color: "#007bff",
    },
    red: {
      color: "red",
    },
    green: {
      color: "green",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    chartPlaceholder: {
      backgroundColor: '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200, // Adjust height as needed
      borderRadius: 10,
      marginTop: 20,
    },
    chartPlaceholderText: {
      color: '#888',
      fontSize: 18,
    },
    detailsSection: {
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    button: {
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    watchlistButton: {
      backgroundColor: '#35BA52',
    },
    portfolioButton: {
      backgroundColor: '#35BA52',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 15,
    },
    input: {
      // ... (rest of your input styles)
    },
    modalButtonGroup: {
      flexDirection: 'row',
      marginTop: 20,
    },
    modalCancelButton: {
      backgroundColor: '#ccc',
    },
   
  });

  export default StockDetails;
