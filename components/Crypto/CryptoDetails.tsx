import { useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button } from "react-native";
import { getCryptoInfo, getCryptoValues } from "../../util/crypto";
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { AuthContext } from "../../store/auth-context";
import { Alert } from 'react-native';
import CryptoChart from "./CryptoChart";
import { FontAwesome } from '@expo/vector-icons';
import { languages } from "../../commonConstants/sharedConstants";
import { CryptoDetailsStyles } from "./CryptoComponentStyles";

const CryptoDetails = () => {

  const route = useRoute();
  const { id, name, currencySymbol, symbol, selectedLanguage, conversionRate, onGoBack } = route.params;
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountOwned, setAmountOwned] = useState('');
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [ownsCrypto, setOwnsCrypto] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const watchlistDocRef = useRef(null);
  const cryptoWatchlistDocRef = useRef(null);
  const [cryptoDetails, setCryptoDetails] = useState({
    price: '0',
    percent_change_24h: 0,
    logo: '',
    description: '',
    loading: true, 
  });

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  
  const addWatchedListHandler = async () => {
    Alert.alert(
      `${languages[selectedLanguage].confirmAddition}`,
      `${languages[selectedLanguage].addWatchlistQuestion}`,
      [
        {
          text: `${languages[selectedLanguage].cancel}`,
          style: "cancel"
        },
        { 
          text: "OK", onPress: async () => {
            try {
              const docRef = await addDoc(collection(db, 'watchedCryptoCurrencies'), {
                name: name,
                id: id,
                uid: userId,
              });
              cryptoWatchlistDocRef.current = docRef; 
              setIsInWatchlist(true); 
              Alert.alert(`${languages[selectedLanguage].addedToWatchlist}`);
              route.params?.onGoBack?.(); 
            } catch (error) {
              console.error('Error adding to watchlist:', error.message);
            }
          }
        }
      ]
    );
  };
  
  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      Alert.alert(`${languages[selectedLanguage].confirmRemoval}`, `${languages[selectedLanguage].removeWatchlistQuestion}`, [
        { text: `${languages[selectedLanguage].cancel}`, style: "cancel" },
        {
          text: `${languages[selectedLanguage].remove}`,
          onPress: async () => {
            try {
              const q = query(collection(db, 'watchedCryptoCurrencies'), where('id', '==', id), where('uid', '==', userId));
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

  const addOwnedCryptoHandler = async () => {
    const amount = parseFloat(amountOwned);
    const addedAmount = amount  / cryptoDetails.price 

    if (isNaN(addedAmount) || addedAmount <= 0) {
      Alert.alert(`${languages[selectedLanguage].enterValidAmount}`);
      return;
    }
  
    try {
      const q = query(collection(db, 'cryptocurrencies'), where('id', '==', id), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'cryptocurrencies'), {
          id,
          amount: addedAmount,  
          name,
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
      Alert.alert(`${languages[selectedLanguage].addedCrypto}`);

    } catch (error) {
      console.error('Error adding owned crypto:', error.message);
    }
  };

  const sellCryptoHandler = async () => {
    const inputAmount = parseFloat(amountOwned);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      Alert.alert(`${languages[selectedLanguage].enterValidAmount}`);
      return;
    }
  
    const stockValue = cryptoDetails.price;
  
    const amountToSell = inputAmount / stockValue;
  
    const q = query(collection(db, 'cryptocurrencies'), where('id', '==', id), where('uid', '==', userId));
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
                  Alert.alert(`${languages[selectedLanguage].soldFromCrypto}`);
                  setAmountOwned('');
                } catch (error) {
                  console.error('Error selling stock:', error.message);
                }
              }
          }
        ]
      );
    } else {
      Alert.alert("You do not own this crypto");
    }
  };
  
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };
  
  const toggleSellModal = () => {
    setSellModalVisible(prev => !prev);
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const infoResponse = await getCryptoInfo(id);
        const valuesResponse = await getCryptoValues(id);
        
        const logo = infoResponse.data[id].logo;
        const description = infoResponse.data[id].description;
        const price = valuesResponse.data[id].quote.USD.price;
        const percent_change_24h = valuesResponse.data[id].quote.USD.percent_change_24h;

        setCryptoDetails({
          logo,
          description,
          price,
          percent_change_24h,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch crypto details:", error);
        setCryptoDetails((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCryptoData();
  }, [id]);

  useEffect(() => {
    const checkOwnership = async () => {
      const q = query(collection(db, 'cryptocurrencies'), where('id', '==', id), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      setOwnsCrypto(!querySnapshot.empty);
    };

    const checkWatchlist = async () => {
      const q = query(collection(db, 'watchedCryptoCurrencies'), where('id', '==', id), where('uid', '==', userId));
      const querySnapshot: any = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsInWatchlist(true);
        watchlistDocRef.current = querySnapshot.docs[0].ref;
      }
    };

    checkOwnership();
    checkWatchlist();

  }, [id, userId]);


  if (cryptoDetails.loading) {
    return (
      <View style={CryptoDetailsStyles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const IconButton = ({ title, onPress, iconName, iconColor, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[CryptoDetailsStyles.iconButton, { backgroundColor }]}>
      <FontAwesome name={iconName} size={20} color={iconColor} style={CryptoDetailsStyles.buttonIcon} />
      <Text style={[CryptoDetailsStyles.buttonText, { color: iconColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={CryptoDetailsStyles.container}>
      

      <View style={CryptoDetailsStyles.header}>
        <Image source={{ uri: cryptoDetails.logo }} style={CryptoDetailsStyles.logo} />
        <View style={CryptoDetailsStyles.headerText}>
          <Text style={CryptoDetailsStyles.name}>{name}</Text>
          <Text style={CryptoDetailsStyles.symbol}>{currencySymbol}</Text>
        </View>
      </View>

      <View style={CryptoDetailsStyles.statsContainer}>
        <View style={CryptoDetailsStyles.priceContainer}>
          <Text style={CryptoDetailsStyles.label}>{languages[selectedLanguage].currentPrice}</Text>
          <Text style={CryptoDetailsStyles.price}>
            {/* ${cryptoDetails.price.toFixed(2)} */}
            {(parseFloat(cryptoDetails.price) * conversionRate).toFixed(2)} {symbol}
            </Text>
        </View>
        <View style={[CryptoDetailsStyles.changeContainer, cryptoDetails.percent_change_24h < 0 ? CryptoDetailsStyles.negativeChange : CryptoDetailsStyles.positiveChange]}>
          <FontAwesome name={cryptoDetails.percent_change_24h < 0 ? "caret-down" : "caret-up"} size={20} color={"white"} />
          <Text style={CryptoDetailsStyles.changeText}>24h: {cryptoDetails.percent_change_24h.toFixed(2)}%</Text>
        </View>
      </View>

      <CryptoChart symbol={currencySymbol} selectedLanguage={selectedLanguage}/>

      <TouchableOpacity onPress={toggleDescription} style={CryptoDetailsStyles.descriptionContainer}>
        <Text style={CryptoDetailsStyles.descriptionText} numberOfLines={expanded ? undefined : 3}>
          {cryptoDetails.description}
        </Text>
        <FontAwesome name={expanded ? "angle-up" : "angle-down"} size={20} color={"#007bff"} />
      </TouchableOpacity>

      <View style={CryptoDetailsStyles.buttonContainer}>
        <IconButton
          title={languages[selectedLanguage].addToPortfolio}
          onPress={toggleModal}
          iconName="plus-circle"
          iconColor="#fff"
          backgroundColor="#35BA52"
        />
        {ownsCrypto && (
          <IconButton
            title={languages[selectedLanguage].sellCrypto}
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

      {/* Modal for adding to portfolio */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={CryptoDetailsStyles.modalOverlay}>
          <View style={CryptoDetailsStyles.modalView}>
            <Text style={CryptoDetailsStyles.modalTitle}>{languages[selectedLanguage].enterInUSD}</Text>
            <TextInput
              style={CryptoDetailsStyles.modalInput}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder={languages[selectedLanguage].amountInUSD}
              keyboardType="numeric"
              placeholderTextColor="#aaa" 
              clearButtonMode="while-editing"
            />
            <View style={CryptoDetailsStyles.modalButtonGroup}>
              <TouchableOpacity onPress={addOwnedCryptoHandler} style={[CryptoDetailsStyles.button, CryptoDetailsStyles.modalButton]}>
                <Text style={CryptoDetailsStyles.buttonText}>{languages[selectedLanguage].add}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={[CryptoDetailsStyles.button, CryptoDetailsStyles.modalButton, CryptoDetailsStyles.modalCancelButton]}>
                <Text style={CryptoDetailsStyles.buttonText}>{languages[selectedLanguage].cancel}</Text>
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
        <View style={CryptoDetailsStyles.modalOverlay}>
          <View style={CryptoDetailsStyles.modalView}>
            <Text style={CryptoDetailsStyles.modalTitle}>{languages[selectedLanguage].enterToSell}</Text>
            <TextInput
              style={CryptoDetailsStyles.modalInput}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder={languages[selectedLanguage].amountInUSD}
              keyboardType="numeric"
              placeholderTextColor="#aaa" 
              clearButtonMode="while-editing" 
            />
            <View style={CryptoDetailsStyles.modalButtonGroup}>
              <TouchableOpacity onPress={sellCryptoHandler} style={[CryptoDetailsStyles.button, CryptoDetailsStyles.modalButton, CryptoDetailsStyles.sellButton]}>
                <Text style={CryptoDetailsStyles.buttonText}>{languages[selectedLanguage].sell}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSellModal} style={[CryptoDetailsStyles.button, CryptoDetailsStyles.modalButton, CryptoDetailsStyles.modalCancelButton]}>
                <Text style={CryptoDetailsStyles.buttonText}>{languages[selectedLanguage].cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CryptoDetails;
