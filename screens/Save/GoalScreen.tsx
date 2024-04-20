import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, updateDoc, doc, DocumentData } from 'firebase/firestore'; // Import DocumentData
import GoalCard from '../../components/ui/GoalCard';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import GoalInput from '../../components/ui/GoalInput';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};


const GoalScreen = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState<number>(0); // Define totalSaved as number
  const bottomSheetRef = useRef<any>(null); // Set ref type to any
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null); // Define selectedGoal as any | null
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const fetchGoals = async () => {
    try {
      const goalsQuery = query(collection(db, 'goals'), where('uid', '==', userId));
      const querySnapshot = await getDocs(goalsQuery);

      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalAmount = fetchedGoals.reduce((sum, goal: any) => sum + goal.Current_Ammount, 0); // Correct typo in property name
      setTotalSaved(totalAmount);

      setGoals(fetchedGoals);
    } catch (error: any) {
      console.error('Error fetching goals:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addGoalHandler = async (newGoal: any) => {
    try {
      await addDoc(collection(db, 'goals'), {
        ...newGoal,
        uid: userId,
        Current_Ammount: 0, // Correct typo in property name
      });

      fetchGoals();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error adding goal:', error.message);
    }
  };

  const deleteGoalHandler = async () => {
    try {
      if (!selectedGoal) {
        console.error("THERE IS NO SELECTED GOAL")
        return;
      }

      const docRef = doc(db, 'goals', selectedGoal.id);
      await deleteDoc(docRef);

      fetchGoals();
      hideDeleteModal()
      setDeleteModalVisible(false);
    } catch (error: any) {
      console.error('Error deleting goal:', error.message);
    }
  };

  const editGoalsHandler = async (editedGoal: any) => {
    try {
      const { id, ...editedData } = editedGoal;

      const docRef = doc(db, 'goals', id);

      await updateDoc(docRef, editedData);

      fetchGoals();
      hideEditModal()
      setEditModalVisible(false);
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

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const snapPoints = useMemo(() => ['333%', '66%', '85%'], []);

  const showDeleteModal = (goal: any) => {
    setSelectedGoal(goal);
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedGoal(null);
  };

  const showEditModal = (goal: any) => {
    setSelectedGoal(goal);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setSelectedGoal(null);
  };

  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
      console.log("In useEffect")
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {!loading &&
        <View style={styles.totalSavedContainer}>
          <Text style={styles.totalSavedText}>{languages[selectedLanguage].totalSaved}</Text>
          <Text style={styles.totalSavedAmount}>${totalSaved}</Text>
        </View>
      }

      {!loading &&
        <ScrollView style={styles.goalContainer}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal}
              onDelete={() => showDeleteModal(goal)} onEdit={() => showEditModal(goal)} selectedLanguage={selectedLanguage}
            />
          ))}
        </ScrollView>
      }

      {!loading &&
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
            <Text style={styles.addButtonText}>{languages[selectedLanguage].addGoal}</Text>
          </TouchableOpacity>
        </View>
      }

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>{languages[selectedLanguage].delete}</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>{languages[selectedLanguage].no}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGoalHandler()} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                <Text style={styles.deleteModalButtonText}>{languages[selectedLanguage].yes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            setEditModalVisible(false);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('Edit BottomSheet closed');
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <GoalInput
                onAddGoal={editGoalsHandler} initialGoal={selectedGoal} selectedLanguage={selectedLanguage}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('BottomSheet closed');
              setModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <GoalInput
                onAddGoal={addGoalHandler} selectedLanguage={selectedLanguage}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  goalContainer: {
    flex: 1,
  },
  totalSavedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  totalSavedText: {
    fontSize: 18,
    color: '#1A1A2C',
  },
  totalSavedAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2C',
  },
  addButtonContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#35BA52',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
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
});

export default GoalScreen;
