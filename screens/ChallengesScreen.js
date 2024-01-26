import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,ScrollView, Pressable } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { db } from '../firebaseConfig';
import { query, collection, where, getDocs, addDoc,deleteDoc,updateDoc, doc } from 'firebase/firestore';
import GoalCard from '../components/ui/GoalCard';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import GoalInput from '../components/ui/GoalInput';

const ChallengesScreen = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0); // State to store the total saved amount
  const bottomSheetRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  const fetchGoals = async () => {
    try {
      const goalsQuery = query(collection(db, 'goals'), where('uid', '==', userId));
      const querySnapshot = await getDocs(goalsQuery);

      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate the total saved amount
      const totalAmount = fetchedGoals.reduce((sum, goal) => sum + goal.Current_Ammount, 0);
      setTotalSaved(totalAmount);

      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addGoalHandler = async (newGoal) => {
    try {
      await addDoc(collection(db, 'goals'), {
        ...newGoal,
        uid: userId,
        // Date: new Date(),
        Current_Ammount: 0
      });
      
      fetchGoals();
      setModalVisible(false); 
    } catch (error) {
      console.error('Error adding goal:', error.message);
    }
  };



  const deleteGoalHandler = async () => {
    try {
      if (!selectedGoal) {
        console.err("THERE IS NO SELECTED GOAL")
        return;
      }

      const docRef = doc(db, 'goals', selectedGoal.id);
      await deleteDoc(docRef);

      // Fetch goals after deletion
      fetchGoals();
      hideDeleteModal()
      setDeleteModalVisible(false); // Close the delete modal
    } catch (error) {
      console.error('Error deleting goal:', error.message);
    }
  };

  const editGoalsHandler = async (editedGoal) => {
    try {
      const { id, ...editedData } = editedGoal;
  
      const docRef = doc(db, 'goals', id);
  
      await updateDoc(docRef, editedData);
  
      fetchGoals();
      hideEditModal()
      // Close the edit modal
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error editing transaction:', error.message);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  // if (loading) {
  //   // You can render a loading indicator here
  //   return <Text>Loading...</Text>;
  // }

  const snapPoints = useMemo(() => ['333%', '66%', '85%'], []);

  const showDeleteModal = (goal) => {
    setSelectedGoal(goal);
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedGoal(null);
  };

  const showEditModal = (goal) => {
    setSelectedGoal(goal);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setSelectedGoal(null);
  };

  // const hideDeleteModal = () => {
  //   setDeleteModalVisible(false);
  //   setSelectedGoal(null);
  // };

  // const handleEditIconClick = (goal) => {
  //   console.log("Clicked on edit icon",goal.id )
  //   setSelectedGoal(goal);
  //   setEditModalVisible(true);  
  // };



  return (
    <View style={styles.container}>
    {!loading &&
      <View style={styles.totalSavedContainer}>
          <Text style={styles.totalSavedText}>Total Saved:</Text>
          <Text style={styles.totalSavedAmount}>${totalSaved}</Text>
        </View>
    }

    {!loading &&

      <ScrollView style={styles.goalContainer}>
        {/* Total saved amount section */}
        

        {/* Goals list */}
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal}
          onDelete={() => showDeleteModal(goal)} onEdit={() => showEditModal(goal)}
          />
        ))}
      </ScrollView>
    }

    {!loading &&

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="#fff" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add a goal</Text>
        </TouchableOpacity>
      </View>
    }


      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this recurring transaction?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                <Text style={styles.deleteModalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGoalHandler()} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                <Text style={styles.deleteModalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Editing Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            // Close both the modal and BottomSheet when clicking outside
            // setModalVisible(false);
            // bottomSheetRef.current?.close();
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
                onAddGoal={editGoalsHandler} initialGoal={selectedGoal}
              />
            </View>
          </BottomSheet>
        </Pressable>
      </Modal>

      {/* Modal for adding recurring payment */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            // Close both the modal and BottomSheet when clicking outside
            // setModalVisible(false);
            // bottomSheetRef.current?.close();
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
                onAddGoal={addGoalHandler}
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
    backgroundColor: '#1A1A2C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row', // Added to align icon and text horizontally
    justifyContent: 'center',
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default ChallengesScreen;
