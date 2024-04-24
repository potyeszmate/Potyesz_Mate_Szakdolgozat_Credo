import React, { useContext, useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import { query, collection, where, getDocs,addDoc, deleteDoc,updateDoc,  doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from "../../store/auth-context";
import DonutChart from "../../components/ui/DonutChart";

const SpendingAnalytics = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterType, setFilterType] = useState('monthly'); // 'monthly', 'weekly', 'yearly'
    const [transactions, setTransactions] = useState<any[]>([]);

    const authCtx = useContext(AuthContext);
    const { userId } = authCtx as any;
    
    const fetchTransactions = async () => {
        try {
          const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
          const querySnapshot = await getDocs(transactionsQuery);
          const fetchedTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as any[];
    
          setTransactions(fetchedTransactions);
        } catch (error: any) {
          console.error('Error fetching transactions:', error.message);
        }
      };

    const navigateDate = (direction: any) => {
        const newDate = new Date(currentDate);
        switch (filterType) {
          case 'monthly':
            newDate.setMonth(currentDate.getMonth() + direction);
            break;
          case 'weekly':
            newDate.setDate(currentDate.getDate() + (7 * direction));
            break;
          case 'yearly':
            newDate.setFullYear(currentDate.getFullYear() + direction);
            break;
          default:
            break;
        }
        setCurrentDate(newDate);
    };

    const formatDateDisplay = () => {
        switch (filterType) {
          case 'monthly':
            return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          case 'weekly':
            const weekStart = new Date(currentDate);
            const weekEnd = new Date(currentDate);
            weekEnd.setDate(weekStart.getDate() + 6);
            return `${weekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
          case 'yearly':
            return currentDate.getFullYear().toString();
          default:
            return '';
        }
    };

    const handleFilterChange = (newFilterType: any) => {
        setFilterType(newFilterType);
        setFilterModalVisible(false);
    };

    useEffect(() => {
        fetchTransactions();
      }, [userId]);
    
    return (
        <View> 
        <View style={styles.filterBar}>
            <TouchableOpacity onPress={() => navigateDate(-1)}>
                <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                <Text style={styles.dateDisplay}>{formatDateDisplay()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateDate(1)}>
                <Feather name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <ScrollView >
            <DonutChart data={transactions}/>
        </ScrollView>

        <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}  // This allows pressing the hardware back button on Android to close the modal.
        >
        <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Choose Filtering</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleFilterChange('monthly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('weekly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('yearly')} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Yearly</Text>
        </TouchableOpacity>
        </View>
        </Modal>
    </View>
    );
};

const styles = StyleSheet.create({
    dateNavigation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      dateDisplay: {
        marginHorizontal: 10,
        fontSize: 18,
      },
      modalContent: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 20,
      },
      modalOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      modalOptionText: {
        fontSize: 18,
      },
      filterBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 5,  // For Android
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 16,
    
      },
      modalHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      closeButton: {
        padding: 10,  // Padding makes it easier to tap
      },
});

export default SpendingAnalytics;
