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
import { languages } from "../../commonConstants/sharedConstants";
import { StockDetailsStyles } from "./StockComponentStyles";

const StockDetails = () => {

  const route = useRoute();
  const { name, currencySymbol, symbol, selectedLanguage, conversionRate, onGoBack } = route.params;
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountOwned, setAmountOwned] = useState('');
  const [ownsStock, setOwnsStock] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const watchlistDocRef = useRef(null); 
  const [stockDetails, setStockDetails] = useState({
    price: '0',
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
        const infoResponse = await getCompanyInfo(currencySymbol);
        const priceResponse = await getStockPrice(currencySymbol);

        const info = infoResponse.results;
        const companyLogo = `${info.branding?.icon_url}?apiKey=${apiKeys.StocksApiKey}`

        const logo = companyLogo;  
        const description = info.description;  
        const price = priceResponse.ticker.prevDay.c;  
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
      `${languages[selectedLanguage].confirmAddition}`,
      `${languages[selectedLanguage].addStockWatchlistQuestion}`,
      [
        {
          text: `${languages[selectedLanguage].cancel}`,
          style: "cancel"
        },
        { 
          text: "OK", onPress: async () => {
              try {
                const docRef = await addDoc(collection(db, 'watchedStocks'), {
                  name: name,
                  symbol: currencySymbol,
                  uid: userId,
                });
                watchlistDocRef.current = docRef; 
                Alert.alert(`${languages[selectedLanguage].addedToWatchlist}`);
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
      Alert.alert(`${languages[selectedLanguage].enterValidAmount}`);
      return;
    }
  
    try {
      const q = query(collection(db, 'stocks'), where('symbol', '==', currencySymbol), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'stocks'), {
          symbol: currencySymbol,
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
      Alert.alert(`${languages[selectedLanguage].addedStock}`);

    } catch (error) {
      console.error('Error adding owned stock:', error.message);
    }
  };

  const sellStockHandler = async () => {
    const inputAmount = parseFloat(amountOwned);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      Alert.alert(`${languages[selectedLanguage].enterValidAmount}`);
      return;
    }
  
    const stockValue = stockDetails.price;
  
    const amountToSell = inputAmount / stockValue;
  
    const q = query(collection(db, 'stocks'), where('symbol', '==', currencySymbol), where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const stockDoc = querySnapshot.docs[0];
      const ownedAmount = stockDoc.data().amount;
  
      if (amountToSell > ownedAmount) {
        Alert.alert(`${languages[selectedLanguage].cantSellMore}`);
        return;
      }
  
      Alert.alert(
        `${languages[selectedLanguage].confirmSale}`,
        `Are you sure you want to sell $${inputAmount} worth of this stock?`,
        [
          {
            text: `${languages[selectedLanguage].cancel}`,
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
                  Alert.alert(`${languages[selectedLanguage].soldFromStock}`);
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
      Alert.alert(`${languages[selectedLanguage].confirmRemoval}`, `${languages[selectedLanguage].removeStockWatchlistQuestion}`, [
        { text: `${languages[selectedLanguage].cancel}`, style: "cancel" },
        {
          text: `${languages[selectedLanguage].remove}`,
          onPress: async () => {
            try {
              const q = query(collection(db, 'watchedStocks'), where('symbol', '==', currencySymbol), where('uid', '==', userId));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await deleteDoc(docRef);
                setIsInWatchlist(false);
                Alert.alert(`${languages[selectedLanguage].removedFromWatchlist}`);
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
      const q = query(collection(db, 'stocks'), where('symbol', '==', currencySymbol), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      setOwnsStock(!querySnapshot.empty);
    };

    const checkWatchlist = async () => {
      const q = query(collection(db, 'watchedStocks'), where('symbol', '==', currencySymbol), where('uid', '==', userId));
      const querySnapshot: any = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsInWatchlist(true);
        watchlistDocRef.current = querySnapshot.docs[0].ref; 
      }
    };

    checkWatchlist();
    checkOwnership();
  }, [currencySymbol, userId]);

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  if (stockDetails.loading) {
    return (
      <View style={StockDetailsStyles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const IconButton = ({ title, onPress, iconName, iconColor, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[StockDetailsStyles.iconButton, { backgroundColor }]}>
      <FontAwesome name={iconName} size={20} color={iconColor} style={StockDetailsStyles.buttonIcon} />
      <Text style={[StockDetailsStyles.buttonText, { color: iconColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={StockDetailsStyles.container}>
      <View style={StockDetailsStyles.header}>
        <Image source={{ uri: stockDetails.logo }} style={StockDetailsStyles.logo} />
        <View style={StockDetailsStyles.headerText}>
          <Text style={StockDetailsStyles.name}>{name}</Text>
          <Text style={StockDetailsStyles.symbol}>{currencySymbol}</Text>
        </View>
      </View>

      <View style={StockDetailsStyles.statsContainer}>
        <View style={StockDetailsStyles.priceContainer}>
          <Text style={StockDetailsStyles.label}>{languages[selectedLanguage].currentPrice}</Text>
          <Text style={StockDetailsStyles.price}>
            {(parseFloat(stockDetails.price) * conversionRate).toFixed(2)} {symbol}
            </Text>
        </View>
        <View style={[StockDetailsStyles.changeContainer, stockDetails.percent_change_24h < 0 ? StockDetailsStyles.negativeChange : StockDetailsStyles.positiveChange]}>
          <FontAwesome name={stockDetails.percent_change_24h < 0 ? "caret-down" : "caret-up"} size={20} color={"white"} />
          <Text style={StockDetailsStyles.changeText}>24h: {stockDetails.percent_change_24h.toFixed(2)}%</Text>
        </View>
      </View>

      <View style={StockDetailsStyles.chartPlaceholder}>
        <StockChart symbol={currencySymbol} selectedLanguage={selectedLanguage}/>
      </View>


      <TouchableOpacity onPress={toggleDescription} style={StockDetailsStyles.descriptionContainer}>
        <Text style={StockDetailsStyles.descriptionText} numberOfLines={expanded ? undefined : 3}>
          {stockDetails.description}
        </Text>
        <FontAwesome name={expanded ? "angle-up" : "angle-down"} size={20} color={"#007bff"} />
      </TouchableOpacity>


      <View style={StockDetailsStyles.buttonContainer}>
        <IconButton
          title={languages[selectedLanguage].addToPortfolio}
          onPress={toggleModal}
          iconName="plus-circle"
          iconColor="#fff"
          backgroundColor="#35BA52"
        />
        {ownsStock && (
          <IconButton
            title={languages[selectedLanguage].sellStock}
            onPress={toggleSellModal}
            iconName="minus-circle"
            iconColor="#fff"
            backgroundColor="#FF4136"
          />
        )}
        <IconButton
          title={isInWatchlist ? `${languages[selectedLanguage].removeFromWatchlist}` : `${languages[selectedLanguage].addToWatchlist}`}
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
      <View style={StockDetailsStyles.modalOverlay}>
        <View style={StockDetailsStyles.modalView}>
          <Text style={StockDetailsStyles.modalTitle}>{languages[selectedLanguage].enterInUSD}</Text>
          <TextInput
            style={StockDetailsStyles.modalInput}
            onChangeText={setAmountOwned}
            value={amountOwned}
            placeholder={languages[selectedLanguage].amountInUSD}
            keyboardType="numeric"
            placeholderTextColor="#aaa" 
            clearButtonMode="while-editing" 
          />
          <View style={StockDetailsStyles.modalButtonGroup}>
            <TouchableOpacity onPress={addOwnedStocksHandler} style={[StockDetailsStyles.button, StockDetailsStyles.modalButton]}>
              <Text style={StockDetailsStyles.buttonText}>{languages[selectedLanguage].add}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={[StockDetailsStyles.button, StockDetailsStyles.modalButton, StockDetailsStyles.modalCancelButton]}>
              <Text style={StockDetailsStyles.buttonText}>{languages[selectedLanguage].cancel}</Text>
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
        <View style={StockDetailsStyles.modalOverlay}>
          <View style={StockDetailsStyles.modalView}>
            <Text style={StockDetailsStyles.modalTitle}>{languages[selectedLanguage].enterToSell}</Text>
            <TextInput
              style={StockDetailsStyles.modalInput}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder={languages[selectedLanguage].amountInUSD}
              keyboardType="numeric"
              placeholderTextColor="#aaa" 
             clearButtonMode="while-editing" 
            />
            <View style={StockDetailsStyles.modalButtonGroup}>
              <TouchableOpacity onPress={sellStockHandler} style={[StockDetailsStyles.button, StockDetailsStyles.modalButton, StockDetailsStyles.sellButton]}>
                <Text style={StockDetailsStyles.buttonText}>{languages[selectedLanguage].sell}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSellModal} style={[StockDetailsStyles.button, StockDetailsStyles.modalButton, StockDetailsStyles.modalCancelButton]}>
                <Text style={StockDetailsStyles.buttonText}>{languages[selectedLanguage].cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
  export default StockDetails;
