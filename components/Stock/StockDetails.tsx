import React, { useState, useEffect, useContext, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button } from "react-native";
import { getCompanyInfo, getStockPrice } from "../../util/stocks";
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { Alert } from 'react-native';
import StockChart from "./StockChart";
import { FontAwesome } from '@expo/vector-icons';
import apiKeys from './../../apiKeys.json';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  logo: string;
  percent_change_24h: number;
}

const StockDetails = () => {

  const route = useRoute();
  const { name, symbol, onGoBack} = route.params;

  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountOwned, setAmountOwned] = useState('');
  const [ownsStock, setOwnsStock] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const watchlistDocRef = useRef(null);
  
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
        const infoResponse = await getCompanyInfo(symbol);
        const priceResponse = await getStockPrice(symbol);

        const info = infoResponse.results;
        const companyLogo = `${info.branding?.icon_url}?apiKey=${apiKeys.StocksApiKey}`

        const logo = companyLogo;  
        const description = info.description;  
        const price = priceResponse.ticker.min.c;  
        const percent_change_24h = priceResponse.ticker.todaysChangePerc;
        console.log("stock price: ", price )

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
        { 
          text: "OK", onPress: async () => {
              try {
                const docRef = await addDoc(collection(db, 'watchedStocks'), {
                  name: name,
                  symbol,
                  uid: userId,
                });
                watchlistDocRef.current = docRef; 
                Alert.alert('Added to watchlist');
                setIsInWatchlist(true);  
                route.params?.onGoBack?.(); 
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
    const addedAmount = amount  / stockDetails.price 
    if (isNaN(addedAmount) || addedAmount <= 0) {
      Alert.alert("Please enter a valid amount");
      return;
    }
  
    try {
      const q = query(collection(db, 'stocks'), where('symbol', '==', symbol), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'stocks'), {
          symbol,
          amount: addedAmount,
          name: name,
          uid: userId,
        });
      } else {
        const stockDoc = querySnapshot.docs[0];
        await updateDoc(stockDoc.ref, {
          amount: increment(addedAmount),
        });
      }
      route.params?.onGoBack?.();
      setModalVisible(false);
      Alert.alert('Added stock');

    } catch (error) {
      console.error('Error adding owned stock:', error.message);
    }
  };

  const sellStockHandler = async () => {
    const inputAmount = parseFloat(amountOwned);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      Alert.alert("Please enter a valid amount to sell");
      return;
    }
  
    const stockValue = stockDetails.price;
  
    const amountToSell = inputAmount / stockValue;
  
    const q = query(collection(db, 'stocks'), where('symbol', '==', symbol), where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const stockDoc = querySnapshot.docs[0];
      const ownedAmount = stockDoc.data().amount;
  
      if (amountToSell > ownedAmount) {
        Alert.alert("You cannot sell more than you own");
        return;
      }
  
      Alert.alert(
        "Confirm Sale",
        `Are you sure you want to sell $${inputAmount} worth of this stock?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "OK", onPress: async () => {
                try {
                  await updateDoc(stockDoc.ref, {
                    amount: increment(-amountToSell), 
                  });
                  route.params?.onGoBack?.();
                  setSellModalVisible(false);
                  Alert.alert("Sold from stock");
                  setAmountOwned('');
                } catch (error) {
                  console.error('Error selling stock:', error.message);
                }
              }
          }
        ]
      );
    } else {
      Alert.alert("You do not own this stock");
    }
  };
  
  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      Alert.alert("Confirm Removal", "Remove this stock from your watchlist?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              const q = query(collection(db, 'watchedStocks'), where('symbol', '==', symbol), where('uid', '==', userId));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await deleteDoc(docRef);
                setIsInWatchlist(false);
                Alert.alert('Removed from watchlist');
                route.params?.onGoBack?.();
              }
            } catch (error) {
              console.error('Error removing from watchlist:', error.message);
            }
          },
        },
      ]);
    } else {
      addWatchedListHandler();
    }
  };
  

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const toggleSellModal = () => {
    setSellModalVisible(prev => !prev);
  };

  useEffect(() => {
    const checkOwnership = async () => {
      const q = query(collection(db, 'stocks'), where('symbol', '==', symbol), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      setOwnsStock(!querySnapshot.empty);
    };

    const checkWatchlist = async () => {
      const q = query(collection(db, 'watchedStocks'), where('symbol', '==', symbol), where('uid', '==', userId));
      const querySnapshot: any = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsInWatchlist(true);
        watchlistDocRef.current = querySnapshot.docs[0].ref; 
      }
    };

    checkWatchlist();
    checkOwnership();
  }, [symbol, userId]);

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

  const IconButton = ({ title, onPress, iconName, iconColor, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, { backgroundColor }]}>
      <FontAwesome name={iconName} size={20} color={iconColor} style={styles.buttonIcon} />
      <Text style={[styles.buttonText, { color: iconColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: stockDetails.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.label}>Current Price</Text>
          <Text style={styles.price}>${stockDetails.price.toFixed(2)}</Text>
        </View>
        <View style={[styles.changeContainer, stockDetails.percent_change_24h < 0 ? styles.negativeChange : styles.positiveChange]}>
          <FontAwesome name={stockDetails.percent_change_24h < 0 ? "caret-down" : "caret-up"} size={20} color={"white"} />
          <Text style={styles.changeText}>24h: {stockDetails.percent_change_24h.toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.chartPlaceholder}>
        <StockChart symbol={symbol} />
      </View>


      <TouchableOpacity onPress={toggleDescription} style={styles.descriptionContainer}>
        <Text style={styles.descriptionText} numberOfLines={expanded ? undefined : 3}>
          {stockDetails.description}
        </Text>
        <FontAwesome name={expanded ? "angle-up" : "angle-down"} size={20} color={"#007bff"} />
      </TouchableOpacity>


      <View style={styles.buttonContainer}>
        <IconButton
          title="Add to Portfolio"
          onPress={toggleModal}
          iconName="plus-circle"
          iconColor="#fff"
          backgroundColor="#35BA52"
        />
        {ownsStock && (
          <IconButton
            title="Sell Stock"
            onPress={toggleSellModal}
            iconName="minus-circle"
            iconColor="#fff"
            backgroundColor="#FF4136"
          />
        )}
        <IconButton
          title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          onPress={handleWatchlistToggle}
          iconName={isInWatchlist ? "star" : "star-o"}
          iconColor="#fff"
          backgroundColor={isInWatchlist ? '#FF4136' : '#35BA52'}
        />
      </View>

    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter your amount in USD</Text>
          <TextInput
            style={styles.modalInput}
            onChangeText={setAmountOwned}
            value={amountOwned}
            placeholder="Amount in USD"
            keyboardType="numeric"
            placeholderTextColor="#aaa" 
            clearButtonMode="while-editing" 
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
  
    <Modal
        animationType="fade"
        transparent={true}
        visible={sellModalVisible}
        onRequestClose={toggleSellModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter the amount in USD to sell</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder="Amount in USD"
              keyboardType="numeric"
              placeholderTextColor="#aaa" 
             clearButtonMode="while-editing" 
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity onPress={sellStockHandler} style={[styles.button, styles.modalButton, styles.sellButton]}>
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSellModal} style={[styles.button, styles.modalButton, styles.modalCancelButton]}>
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
      borderRadius: 40, 
    },
    headerText: {
      alignItems: "center",
      marginTop: 10,
    },
    sellButton: {
      backgroundColor: '#FF4136',
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
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#666',
      marginBottom: 5,
    },
    value: {
      fontSize: 18,
    },
    descriptionContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
    },
    description: {
      backgroundColor: "#f2f2f2",
      borderRadius: 10,
      padding: 15,
      height: 80, 
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
    removeButton: {
      backgroundColor: '#FF4136',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    chartPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200, 
      borderRadius: 10,
      marginTop: 50,
      marginBottom: 40
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
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingVertical: 8, 
      paddingHorizontal: 16, 
      borderRadius: 20, 
      marginBottom: 10, 
      width: '100%', 
      alignSelf: 'center', 
      shadowOpacity: 0.1,
      elevation: 3,
    },
    buttonIcon: {
      marginRight: 10,
    },
    watchlistButton: {
      backgroundColor: '#35BA52',
    },
    portfolioButton: {
      backgroundColor: '#35BA52',
    },
    buttonText: {
      flex: 1,
      textAlign: 'center',
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
      width: '80%', 
      maxWidth: 350, 
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 15,
    },
    iconButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 25,
      marginVertical: 5,
      width: '90%', 
      alignSelf: 'center', 
      elevation: 3,
    },

    input: {
    },
    modalButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'center', 
      width: '100%', 
    },
    modalButton: {
      flex: 1, 
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginHorizontal: 5, 
      borderRadius: 25,
      backgroundColor: '#35BA52', 
    },
    modalCancelButton: {
      backgroundColor: '#ccc',
    },
    modalInput: {
      width: '100%', 
      borderWidth: 1,
      borderColor: '#ddd', 
      borderRadius: 10,
      padding: 15, 
      fontSize: 16, 
      color: '#000', 
      backgroundColor: '#fff', 
      marginBottom: 20, 
      paddingVertical: 15,

    },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', 
  },
    changeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
    positiveChange: {
      backgroundColor: '#21BA45',
    },
    negativeChange: {
      backgroundColor: '#FF4136',
    },
    changeText: {
      marginLeft: 5,
      color: 'white',
      fontSize: 16,
    },

    descriptionText: {
      fontSize: 16,
      color: '#666',
    },
   
  });

  export default StockDetails;
