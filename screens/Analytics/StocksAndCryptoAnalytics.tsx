import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/auth-context';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecurringDonutChart from '../../components/ui/RecurringDonutChart';
import ImportanceBarChart from '../../components/ui/ImportanceBarChart';
import LoanPaymentChart from '../../components/ui/LoanPaymentChart';
import { getStockPrice } from '../../util/stocks';
import { getCryptoValues } from '../../util/crypto';
import PieChartComponent from '../../components/ui/PieChartStockAndCrypto';

const StocksAndCryptoAnalytics = () => {

    const [stocks, setStocks] = useState<any[]>([]);
    const [cryptocurrencies, setCryptocurrencies] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('stocks');
    const [isLoading, setIsLoading] = useState(true); // Add this to track loading state

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;

    // Field: amount (number), name (string) id (number)

    const fetchCryptocurrencies = async () => {
        try {
          const cryptocurrenciesQuery = query(collection(db, 'cryptocurrencies'), where('uid', '==', userId));
          const querySnapshot = await getDocs(cryptocurrenciesQuery);
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error('Error fetching cryptocurrencies:', error);
          return []; // Return empty array in case of error
        }
      };

    // Field: amount (number), name (string) symbol (string)
    const fetchStocks = async () => {
        try {
          const stocksQuery = query(collection(db, 'stocks'), where('uid', '==', userId));
          const querySnapshot = await getDocs(stocksQuery);
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error('Error fetching stocks:', error);
          return []; // Return empty array in case of error
        }
      };

      const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        return randomColor;
      };

    const enrichWithOwnedValueStock = async (items, getValueFunc) => {
        console.log("HALOOOOOOOOOOooo")
        return Promise.all(items.map(async (item) => {
          const response = await getValueFunc(item.symbol);
        //   const price = item.id ? response.quote.USD.price : response.ticker.min.c;
            console.log("enrichWithOwnedValueStock CALLED")
          console.log( "price: ", response.ticker.min.c)

          const ownedValue = item.amount * response.ticker.min.c;
          console.log(ownedValue)
          const color = generateRandomColor(); // Generate a random color

          return { ...item, ownedValue, color  };
        }));
      };

      const enrichWithOwnedValueCrypto = async (items, getValueFunc) => {
        return Promise.all(items.map(async (item) => {
          const response = await getValueFunc(item.id);
        //   const price = item.id ? response.quote.USD.price : response.ticker.min.c;
          console.log("TEST")
          console.log(item.amount)
          console.log( "price", response.data[item.id].quote.USD.price)

          const ownedValue = item.amount * response.data[item.id].quote.USD.price;

          console.log("ownedValue", ownedValue)
          const color = generateRandomColor(); // Generate a random color

          return { ...item, ownedValue, color };
        }));
      };
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const stocksData = await fetchStocks();
            const cryptocurrenciesData = await fetchCryptocurrencies();
            console.log("cryptocurrenciesData", cryptocurrenciesData)

            const enrichedStocks = await enrichWithOwnedValueStock(stocksData, getStockPrice);
            const enrichedCryptocurrencies = await enrichWithOwnedValueCrypto(cryptocurrenciesData, getCryptoValues);
      
            setStocks(enrichedStocks);
            setCryptocurrencies(enrichedCryptocurrencies);
          } catch (error) {
            console.error('Error fetching and enriching data:', error);
          }
          setIsLoading(false);
        };
      
        fetchData();
      }, [userId]);  // This ensures fetchData is called only when userId changes
      
      

      if (isLoading) {
        // Show loading indicator while fetching data
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
      
      return (
      <View>
        <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'stocks' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('stocks')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'stocks' && styles.activeTabButtonText,
            ]}
          >
            Stocks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'cryptocurrencies' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('cryptocurrencies')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'cryptocurrencies' && styles.activeTabButtonText,
            ]}
          >
            Cryptocurrencies
          </Text>
        </TouchableOpacity>
       </View>

        <ScrollView style={{ flexDirection: 'column' }}>
            {activeTab === 'stocks' && <PieChartComponent data={stocks} />} 
            {activeTab === 'cryptocurrencies' && <PieChartComponent data={cryptocurrencies} />}
        </ScrollView>
      </View>
      );
    };
      

    const styles = StyleSheet.create({
      tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: 16
        marginBottom: 5,
        paddingHorizontal: 24,
        paddingTop: 10,
        gap: 5,
        // marginBottom: 10
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabButtonText: {
        color: '#1A1A2C',
        fontSize: 14,
        // fontFamily: 'Inter', // Make sure you have the Inter font available
      },
      activeTabButton: {
        backgroundColor: '#35BA52',
      },
      activeTabButtonText: {
        color: '#FFFFFF',
      },
      tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        borderRadius: 99,
        borderColor: '#149E53',
        borderWidth: 0.6
        // backgroundColor: '#FAFAFA',
      },
    });

export default StocksAndCryptoAnalytics;
