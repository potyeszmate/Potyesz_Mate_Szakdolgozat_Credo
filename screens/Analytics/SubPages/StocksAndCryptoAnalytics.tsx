import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../store/auth-context';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecurringDonutChart from '../../../components/Recurrings/RecurringDonutChart';
import ImportanceBarChart from '../../../components/Charts/ImportanceBarChart';
import LoanPaymentChart from '../../../components/Charts/LoanPaymentChart';
import { getStockPrice } from '../../../util/stocks';
import { getCryptoValues } from '../../../util/crypto';
import PieChartComponent from '../../../components/Charts/PieChartStockAndCrypto';

const StocksAndCryptoAnalytics = () => {

    const [stocks, setStocks] = useState<any[]>([]);
    const [cryptocurrencies, setCryptocurrencies] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('stocks');
    const [isLoading, setIsLoading] = useState(true);

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;

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
          return [];
        }
      };

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
          return []; 
        }
      };

      const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        return randomColor;
      };

    const enrichWithOwnedValueStock = async (items, getValueFunc) => {
        return Promise.all(items.map(async (item) => {
          const response = await getValueFunc(item.symbol);

          const ownedValue = item.amount * response.ticker.min.c;
          const color = generateRandomColor();

          return { ...item, ownedValue, color  };
        }));
      };

      const enrichWithOwnedValueCrypto = async (items, getValueFunc) => {
        return Promise.all(items.map(async (item) => {
          const response = await getValueFunc(item.id);

          const ownedValue = item.amount * response.data[item.id].quote.USD.price;

          const color = generateRandomColor(); 

          return { ...item, ownedValue, color };
        }));
      };
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const stocksData = await fetchStocks();
            const cryptocurrenciesData = await fetchCryptocurrencies();

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
      }, [userId]);
        
      if (isLoading) {
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
        marginBottom: 5,
        paddingHorizontal: 24,
        paddingTop: 10,
        gap: 5,
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabButtonText: {
        color: '#1A1A2C',
        fontSize: 14,
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
      },
    });

export default StocksAndCryptoAnalytics;
