/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import RecurringTransactionInput from '../../components/ui/RecurringTransactionInput';
import { convertCurrencyToCurrency } from '../../util/conversion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import Icon from 'react-native-vector-icons/MaterialIcons';  // You can choose any set like FontAwesome, Ionicons, etc.


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const iconMapping: { [key: string]: any } = {
  Twitter: require('../../assets/Recurrings/twitter.png'),
  Youtube: require('../../assets/Recurrings/FrameYoutube.png'),
  Instagram: require('../../assets/Recurrings/FrameInstagram.png'),
  LinkedIn: require('../../assets/Recurrings/linkedin.png'),
  Wordpress: require('../../assets/Recurrings/wordpress.png'),
  Pinterest: require('../../assets/Recurrings/pinterest.png'),
  Figma: require('../../assets/Recurrings/figma.png'),
  Behance: require('../../assets/Recurrings/behance.png'),
  Apple: require('../../assets/Recurrings/FrameApple.png'),
  GooglePlay: require('../../assets/Recurrings/google-play.png'),
  Google: require('../../assets/Recurrings/google.png'),
  AppStore: require('../../assets/Recurrings/app-store.png'),
  Github: require('../../assets/Recurrings/github.png'),
  Xbox: require('../../assets/Recurrings/xbox.png'),
  Discord: require('../../assets/Recurrings/discord.png'),
  Stripe: require('../../assets/Recurrings/stripe.png'),
  Spotify: require('../../assets/Recurrings/spotify.png'),
};

const RecurringPayments = () => {
  const navigation = useNavigation();
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  const bottomSheetRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState<any>(null);
  const [selectedRecurringTransactionId, setSelectedRecurringTransactionId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<any>({});
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [prevCurrency, setPrevCurrency] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<any>('');
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const fetchRecurringTransactions = async () => {
    console.log("userId in recurring: ", userId)
    try {
      setLoading(true);

      const recurringTransactionsQuery = query(
        collection(db, 'recurring_payments'),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(recurringTransactionsQuery);
      const fetchedRecurringTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecurringTransactions(fetchedRecurringTransactions);
      setLoading(false);

    } catch (error: any) {
      console.error('Error fetching recurring transactions:', error.message);
      setLoading(false);

    }
  };

  const fetchUserSettings = async () => {
    console.log("userId in recurring: ", userId)

    try {
      const settingsQuery = query(collection(db, 'users'),  where('uid', '==', userId))
      const querySnapshot = await getDocs(settingsQuery);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0]?.data(); 

        if (userData) {
          setUserSettings(userData);

          // console.log('Fetched settings:', userData);
        } else {
          console.log('No user data found.');
        }
      } else {
        console.log('No documents found.');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error.message);
    }
  };

  const getCurrencySymbol = (currencyCode: any) => {
    console.log("CHANGING CURRENCY SYMBOL")
    
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'HUF':
        return 'HUF';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'GBP':
        return '£';
      default:
        return ''; 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user settings have already been fetched
        if (!userSettings.currency) {
          // Fetch user settings
          await fetchUserSettings();
        }
        
        // Check if the currency value is valid and has changed
        if (userSettings.currency && userSettings.currency !== prevCurrency) {
          // Get the saved symbol from AsyncStorage
          const savedSymbol = await AsyncStorage.getItem('symbol');
          
          // Check if the current symbol is the same as the saved symbol
          const symbolHaveNotChanged = savedSymbol === getCurrencySymbol(userSettings.currency);
    
          if (symbolHaveNotChanged) {
            // Use saved conversion rate
            const savedConversionRate: any = await AsyncStorage.getItem('conversionRate');
            setConversionRate(parseFloat(savedConversionRate));
            // Set currency symbol
            setSymbol(savedSymbol);
          } else {
            // Fetch conversion rate from API
            const result = await convertCurrencyToCurrency('USD', userSettings.currency);
            setConversionRate(result);
        
            // Save conversion rate and symbol
            await AsyncStorage.setItem('conversionRate', result.toString());
            const newSymbol = getCurrencySymbol(userSettings.currency);
            setSymbol(newSymbol);
            await AsyncStorage.setItem('symbol', newSymbol);
          }
          
          // Update the previous currency value
          setPrevCurrency(userSettings.currency);
        }
      } catch (error) {
        console.error('Error fetching user settings or converting currency:', error);
        
      }
    };
    
  
    fetchData();
  }, [userSettings.currency, prevCurrency]); // Add userSettings.currency and prevCurrency to the dependency array
  
  const snapPoints = useMemo(() => ['33%', '66%', '85%'], []);

  const addTransactionHandler = async (newRecurringTransaction: any) => {
    try {
      setModalVisible(false);

      await addDoc(collection(db, 'recurring_payments'), {
        ...newRecurringTransaction,
        uid: userId,
      });
      fetchRecurringTransactions();
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
    }
  };

  const handleDeleteIconClick = (recurringTransactionId: string) => {
    setSelectedRecurringTransactionId(recurringTransactionId);
    setDeleteModalVisible(true);
  };

  const handleEditIconClick = (selectedRecurringTransaction: any) => {
    setSelectedRecurringTransaction(selectedRecurringTransaction);
    setEditModalVisible(true);
  };

  const deleteRecurringTransactionHandler = async (recurringTransactionId: string) => {
    try {
      const docRef = doc(db, 'recurring_payments', recurringTransactionId);
      await deleteDoc(docRef);
      fetchRecurringTransactions();
      setEditModalVisible(false);
      console.log("Deleted and set the modal to false.")
    } catch (error: any) {
      console.error('Error deleting recurring transaction:', error.message);
      console.log("Not deleted and set the modal to false.")

    }

  };

  const editRecurringTransactionHandler = async (editedRecurringTransaction: any) => {
    try {
      setEditModalVisible(false);
      const { id, ...editedData } = editedRecurringTransaction;
      const docRef = doc(db, 'recurring_payments', id);
      await updateDoc(docRef, editedData);
      fetchRecurringTransactions();
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };

  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        console.log(selectedLanguage)
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const totalSubscriptions = recurringTransactions.length;
  const totalValue = recurringTransactions.reduce((acc, curr) => acc + parseInt(curr.value), 0);

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  useEffect(() => {
    fetchRecurringTransactions();
    fetchUserSettings();
    fetchLanguage();
  }, []);

  
  return (
    <View style={styles.container}>
      <View style={styles.space}></View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{languages[selectedLanguage].total}</Text>
            {loading ? (
              <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
            ) : (
              <Text style={styles.totalSubscriptions}>
                {`${totalSubscriptions} ${
                  totalSubscriptions !== 1
                    ? languages[selectedLanguage].subscriptions
                    : languages[selectedLanguage].subscription
                }`}
              </Text>
            )}
          </View>
          {loading ? (
            <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
          ) : (
            <View style={styles.totalRow}>
              {/* {symbol} {(parseFloat(totalValue) * conversionRate).toFixed(2) */}
              {conversionRate !== null ? (
                <Text style={styles.totalValue}>
                  {' '}
                  {userSettings.currency === 'HUF'
                    ? Math.round(parseFloat(totalValue) * conversionRate)
                    : (parseFloat(totalValue) * conversionRate).toFixed(2)}{' '}
                  {symbol}
                </Text>
              ) : (
                <Text style={styles.loadingText}>{languages[selectedLanguage].loading}</Text>
              )}
            </View>
          )}
        </View>
        <View style={styles.listContainer}>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            data={recurringTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.transactionItem} onPress={() => handleEditIconClick(item)}>
                <View style={styles.transactionIcon}>
                  <Image source={iconMapping[item.name]} style={styles.iconImage} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{item.name}</Text>
                  <View style={styles.categoryDateContainer}>
                    <Text style={[styles.transactionCategory, { color: '#888' }]}>
                      {languages[selectedLanguage][item.category]}
                    </Text>
                    <View style={styles.separator} />
                    <Text style={styles.transactionDate}>
                      {item.Date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionAmount}>
                  {conversionRate !== null ? (
                    <Text style={styles.transactionAmountValue}>
                      {' '}
                      {userSettings.currency === 'HUF'
                        ? Math.round(parseFloat(item.value) * conversionRate)
                        : (parseFloat(item.value) * conversionRate).toFixed(2)}{' '}
                      {symbol}
                    </Text>
                  ) : (
                    <Text style={styles.loadingText}>Loading...</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>


        {/* Delete Modal */}
        {/* <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalText}>{languages[selectedLanguage].deleteModalText}</Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                  <Text style={styles.deleteModalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecurringTransactionHandler(selectedRecurringTransactionId!)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                  <Text style={styles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            Keyboard.dismiss();
            setEditModalVisible(false);
          }}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => {
              Keyboard.dismiss(); // This will not dismiss the modal now; only the keyboard
            }}>
            <BottomSheet
              ref={bottomSheetRef}
              index={2}
              snapPoints={snapPoints}
              enablePanDownToClose
              onClose={() => {
                Keyboard.dismiss();
                setEditModalVisible(false);
              }}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}>
              <View style={styles.contentContainer}>
                {/* <Icon
                  name="close"
                  size={24}
                  style={styles.closeIcon}
                  onPress={() => setEditModalVisible(false)}
                /> */}
                <RecurringTransactionInput
                  initialRecurringTransaction={selectedRecurringTransaction}
                  onAddRecurringTransaction={editRecurringTransactionHandler}
                  conversionRate={conversionRate}
                  currency={userSettings.currency}
                  selectedLanguage={selectedLanguage}
                  onDeleteRecurringTransaction={deleteRecurringTransactionHandler}
                  onClose={() => setEditModalVisible(false)}
                />
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>


        {/* Add Modal */}
        <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          Keyboard.dismiss();
          setModalVisible(false);
        }}>
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            Keyboard.dismiss(); // This will not dismiss the modal now; only the keyboard
          }}>
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              Keyboard.dismiss();
              setModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}>
            <View style={styles.contentContainer}>
              {/* <Icon
                name="close"
                size={24}
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
              /> */}
              <RecurringTransactionInput
                onAddRecurringTransaction={addTransactionHandler}
                conversionRate={conversionRate}
                currency={userSettings.currency}
                selectedLanguage={selectedLanguage}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>


      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>{languages[selectedLanguage].addSubscription}</Text>
      </TouchableOpacity>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  listContainer: {
    flex: 1,
    maxHeight: '65%', // Adjust as needed
    marginBottom: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20, // Adjust as needed
    left: 21, // Align with the left edge of the screen
    right: 21, // Align with the right edge of the screen
    backgroundColor: '#35BA52',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 1, // Ensure the button appears above other content
  },
  addIcon: {
    marginRight: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#888', // Example color
    fontStyle: 'italic',
  },  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  space: {
    marginBottom: 20, // Adjust this value to change the amount of space
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
    marginLeft: 16,
    marginRight: 16,
  },
  transactionIcon: {
    marginRight: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,  // Adjust as needed
    right: 10, // Adjust as needed
    color: 'black', // Choose a color that matches your theme
    zIndex: 10, // Ensure it's above other elements
  },
  transactionInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  transactionName: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionDate: {
    color: '#888',
  },
  deleteIconContainer: {
    marginLeft: 8,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 20, // Rounded corners on the top-left
    borderTopRightRadius: 20, // Rounded corners on the top-right
    overflow: 'hidden', // Ensures children don't overflow rounded corners
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for the modal background
    justifyContent: 'flex-end', // Aligns the BottomSheet to the bottom
  },
  categoryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#7E8086',
    marginHorizontal: 8,
  },  
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  deleteModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  deleteModalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteModalButton: {
    marginLeft: 16,
    padding: 8,
  },
  deleteModalButtonYes: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
  },
  deleteModalButtonText: {
    fontSize: 16,
    color: '#1A1A2C',
  },
  editIconContainer: {
    marginLeft: 8,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 5,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
    // marginLeft: 5,
    // marginRight: 5
  },
  totalCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F7',
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7E8086',
  },
  totalSubscriptions: {
    fontSize: 16,
    color: '#7E8086',
  },
  totalValue: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    // position: 'absolute',
    alignSelf: 'center',
    marginTop: 200, // Adjust as needed
  },
});


export default RecurringPayments;
