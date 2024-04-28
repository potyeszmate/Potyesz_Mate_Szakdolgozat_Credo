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

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price: number;
  logo: string;
  percent_change_24h: number;
  description: string;
}

const CryptoDetails = () => {
  const route = useRoute();
  const { id, name, symbol, onGoBack } = route.params;
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountOwned, setAmountOwned] = useState('');
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [ownsCrypto, setOwnsCrypto] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const watchlistDocRef = useRef(null);
  const cryptoWatchlistDocRef = useRef(null);

  const [cryptoDetails, setCryptoDetails] = useState({
    price: 0,
    percent_change_24h: 0,
    logo: '',
    description: '',
    loading: true, //true
  });

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        console.log("id:", id)
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
        watchlistDocRef.current = querySnapshot.docs[0].ref; // Save the document reference for later use
      }
    };

    checkOwnership();
    checkWatchlist();

  }, [id, userId]);

  const addWatchedListHandler = async () => {
    Alert.alert(
      "Confirm Addition",
      "Are you sure you want to add this cryptocurrency to your watchlist?",
      [
        {
          text: "Cancel",
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
              cryptoWatchlistDocRef.current = docRef; // Save the document reference
              setIsInWatchlist(true); // Set state to true
              Alert.alert('Added to watchlist');
              route.params?.onGoBack?.(); // Call the passed function to refresh data
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
      Alert.alert("Confirm Removal", "Remove this cryptocurrency from your watchlist?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              const q = query(collection(db, 'watchedCryptoCurrencies'), where('id', '==', id), where('uid', '==', userId));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await deleteDoc(docRef);
                setIsInWatchlist(false); // Set state to false
                Alert.alert('Removed from watchlist');
                route.params?.onGoBack?.(); // Call the passed function to refresh data
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

  // const addOwnedCryptosHandler = async () => {
  //   const amount = amountOwned / cryptoDetails.price;
  //   try {
  //     await addDoc(collection(db, 'cryptocurrencies'), {
  //       id,
  //       name,
  //       amount,
  //       uid: userId,
  //     });
  //     setModalVisible(false);
  //     // Optionally update state or show feedback
  //   } catch (error) {
  //     console.error('Error adding owned crypto:', error.message);
  //   }
  // };

  const addOwnedCryptoHandler = async () => {
    const amount = parseFloat(amountOwned);
    const addedAmount = amount  / cryptoDetails.price 

    if (isNaN(addedAmount) || addedAmount <= 0) {
      Alert.alert("Please enter a valid amount");
      return;
    }
  
    try {
      // Query to check if the user already owns the stock
      const q = query(collection(db, 'cryptocurrencies'), where('id', '==', id), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // User does not own the stock, add it
        await addDoc(collection(db, 'stockDetails'), {
          id,
          addedAmount,  //amountOwned / cryptoDetails.price;
          name,
          uid: userId,
        });
      } else {
        // User already owns the stock, update the amount
        const stockDoc = querySnapshot.docs[0];
        await updateDoc(stockDoc.ref, {
          amount: increment(addedAmount), // This uses Firestore's increment to add the new amount to the existing amount
        });
      }
      route.params?.onGoBack?.(); // Call the passed fetchCryptos function
      setModalVisible(false);
      Alert.alert('Added crypto');

    } catch (error) {
      console.error('Error adding owned crypto:', error.message);
    }
  };

  const sellCryptoHandler = async () => {
    const inputAmount = parseFloat(amountOwned);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      Alert.alert("Please enter a valid amount to sell");
      return;
    }
  
    // Fetch the current stock value, which you might already have from your stockDetails state
    const stockValue = cryptoDetails.price;
  
    const amountToSell = inputAmount / stockValue;
  
    const q = query(collection(db, 'cryptocurrencies'), where('id', '==', id), where('uid', '==', userId));
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
                    amount: increment(-amountToSell), // Subtract the sell amount from the owned amount
                  });
                  // Close the sell modal after the operation
                  route.params?.onGoBack?.(); // Call the passed fetchCryptos function

                  setSellModalVisible(false);
                  Alert.alert("Sold from crypto");
                  // Clear the input field after the operation
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
    console.log('Toggling modal visibility');
    setModalVisible(prev => !prev);
  };
  
  const toggleSellModal = () => {
    setSellModalVisible(prev => !prev);
  };

  if (cryptoDetails.loading) {
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
        <Image source={{ uri: cryptoDetails.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.label}>Current Price</Text>
          <Text style={styles.price}>${cryptoDetails.price.toFixed(2)}</Text>
        </View>
        <View style={[styles.changeContainer, cryptoDetails.percent_change_24h < 0 ? styles.negativeChange : styles.positiveChange]}>
          <FontAwesome name={cryptoDetails.percent_change_24h < 0 ? "caret-down" : "caret-up"} size={20} color={"white"} />
          <Text style={styles.changeText}>24h: {cryptoDetails.percent_change_24h.toFixed(2)}%</Text>
        </View>
      </View>

      <CryptoChart symbol={symbol} />

      <TouchableOpacity onPress={toggleDescription} style={styles.descriptionContainer}>
        <Text style={styles.descriptionText} numberOfLines={expanded ? undefined : 3}>
          {cryptoDetails.description}
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
        {ownsCrypto && (
          <IconButton
            title="Sell Crypto"
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
              style={styles.modalInput}
              onChangeText={setAmountOwned}
              value={amountOwned}
              placeholder="Amount in USD"
              keyboardType="numeric"
              placeholderTextColor="#aaa" // Change placeholder text color for visibility
              clearButtonMode="while-editing" // iOS only - shows clear button while editing
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity onPress={addOwnedCryptoHandler} style={[styles.button, styles.modalButton]}>
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
              placeholderTextColor="#aaa" // Change placeholder text color for visibility
              clearButtonMode="while-editing" // iOS only - shows clear button while editing
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity onPress={sellCryptoHandler} style={[styles.button, styles.modalButton, styles.sellButton]}>
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
      borderRadius: 40, // To create a rounded image
    },
    headerText: {
      alignItems: "center",
      marginTop: 10,
    },
    sellButton: {
      backgroundColor: '#FF4136',
      marginTop: 10, // To provide spacing from the Add to Portfolio button
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
    removeButton: {
      backgroundColor: '#FF4136',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    chartPlaceholder: {
      // backgroundColor: '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200, // Adjust height as needed
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
      alignItems: 'center', // Center the icon and text vertically in the button
      justifyContent: 'center', // Center the icon and text horizontally in the button
      paddingVertical: 8, // Reduced padding for a smaller button
      paddingHorizontal: 16, // Reduced padding for a smaller button
      borderRadius: 20, // Adjusted for aesthetics
      marginBottom: 10, // Space between buttons
      width: '100%', // Adjust the width of the button
      alignSelf: 'center', // Ensure the button is centered in the container
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
      textAlign: 'center', // Center text
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
      width: '80%', // Adjust width as necessary
      maxWidth: 350, // Ensure the modal is not excessively wide on large devices
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
      width: '90%', // Set a fixed width for all buttons
      alignSelf: 'center', // Center buttons in the view
      elevation: 3,
    },

    input: {
      // ... (rest of your input styles)
    },
    modalButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'center', // Center the buttons horizontally
      width: '100%', // Take up full width of modal content area
    },
    modalButton: {
      flex: 1, // Each button will take up an equal amount of space
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginHorizontal: 5, // Add some horizontal space between buttons
      borderRadius: 25,
      backgroundColor: '#35BA52', // Default button color
      // ... other button styles ...
    },
    modalCancelButton: {
      backgroundColor: '#ccc',
    },
    modalInput: {
      width: '100%', // Full width of the modal
      borderWidth: 1,
      borderColor: '#ddd', // Light border for subtle distinction
      borderRadius: 10,
      padding: 15, // Comfortable padding
      fontSize: 16, // Readable text size
      color: '#000', // Text color for visibility
      backgroundColor: '#fff', // Background color for visibility
      marginBottom: 20, // Spacing below the input field
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
    // marginTop: 1, // Adjust as needed to fit just below the header
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
    color: '#333', // Or any color that fits the app theme
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
export default CryptoDetails;
