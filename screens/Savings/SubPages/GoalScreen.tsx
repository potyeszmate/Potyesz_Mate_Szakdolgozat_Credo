import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { db } from '../../../firebaseConfig';
import { query, collection, where, getDocs, addDoc, deleteDoc, updateDoc, doc, DocumentData, setDoc } from 'firebase/firestore'; 
import GoalCard from '../../../components/Goals/GoalCard';
import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import GoalInput from '../../../components/Goals/GoalInput';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goalStyles } from '../SavingsStyles';
import { languages } from '../../../commonConstants/sharedConstants';

const GoalScreen = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState<number>(0); 
  const bottomSheetRef = useRef<any>(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null); 
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;
  const snapPoints = useMemo(() => ['333%', '66%', '85%'], []);
  let challengeName = "Financial Goal Setting";
  let pointsAward = 300;

  const updatePoints = async (userId, pointsToAdd) => {
    const pointsQuery = query(collection(db, 'points'), where('uid', '==', userId));
    const pointsSnapshot = await getDocs(pointsQuery);

    if (!pointsSnapshot.empty) {
        const pointsDoc = pointsSnapshot.docs[0];
        const currentPoints = pointsDoc.data().score;
        const newPoints = currentPoints + pointsToAdd;
        await updateDoc(pointsDoc.ref, { score: newPoints });
        console.log("Points updated: ", newPoints);
    } else {
        const pointsRef = doc(collection(db, 'points'));
        await setDoc(pointsRef, { uid: userId, score: pointsToAdd });
        console.log("Points document created and initialized.");
    }
};

  const checkAndCompleteFinancialGoalSettingsChallenge = async () => {

    const joinedChallengesQuery = query(
        collection(db, 'joinedChallenges'),
        where('uid', '==', userId),
        where('name', '==', challengeName),
        where('isActive', '==', true)
    );
    const challengeSnapshot = await getDocs(joinedChallengesQuery);

    if (challengeSnapshot.empty) {
        return;
    }

    const challengeDoc: any = challengeSnapshot.docs[0];
    const challenge = challengeDoc.data();
    const challengeEndDate = new Date(challenge.joinedDate.toDate().getTime() + challenge.durationInWeek * 7 * 24 * 60 * 60 * 1000);

    if (new Date() < challengeEndDate) {
        await updateDoc(challengeDoc.ref, { isActive: false });
        updatePoints(userId, pointsAward);

        Alert.alert(
            "🎉 Challenge Complete 🎉",
            `Congratulations! You've established and completed three financial goals and earned ${pointsAward} points!`,
            [{ text: "OK", onPress: () => console.log("Financial Goal Setting Challenge Completion Acknowledged") }],
            { cancelable: false }
        );
    } else {
        console.log("Challenge criteria not met or challenge expired.");
    }
  };

  const fetchGoals = async () => {
    console.log("!!!! FETCHING GOAL !!!!!") 
    try {
      const goalsQuery = query(collection(db, 'goals'), where('uid', '==', userId));
      const querySnapshot = await getDocs(goalsQuery);

      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const completedGoals = fetchedGoals.filter(goal => goal.Total_Ammount === goal.Current_Ammount);
      console.log(`Total completed goals: ${completedGoals.length}`);
      console.log("Total completed goals:",completedGoals);

      if (completedGoals.length >= 3) {
          console.log(completedGoals.length)
          await checkAndCompleteFinancialGoalSettingsChallenge(completedGoals.length);
      }

      const totalAmount = fetchedGoals.reduce((sum, goal: any) => sum + goal.Current_Ammount, 0);
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
        Current_Ammount: 0,
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
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

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
      fetchGoals();
    }
  }, [isFocused]);

  return (
    <View style={goalStyles.container}>
      {!loading &&
        <View style={goalStyles.totalSavedContainer}>
          <Text style={goalStyles.totalSavedText}>{languages[selectedLanguage].totalSaved}</Text>
          <Text style={goalStyles.totalSavedAmount}>${totalSaved}</Text>
        </View>
      }

      {!loading &&
        <ScrollView style={goalStyles.goalContainer}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal}
              onDelete={() => showDeleteModal(goal)} onEdit={() => showEditModal(goal)} selectedLanguage={selectedLanguage}
            />
          ))}
        </ScrollView>
      }

      {!loading &&
        <View style={goalStyles.addButtonContainer}>
          <TouchableOpacity style={goalStyles.addButton} onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={24} color="#fff" style={goalStyles.addIcon} />
            <Text style={goalStyles.addButtonText}>{languages[selectedLanguage].addGoal}</Text>
          </TouchableOpacity>
        </View>
      }

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={goalStyles.deleteModalContainer}>
          <View style={goalStyles.deleteModalContent}>
            <Text style={goalStyles.deleteModalText}>{languages[selectedLanguage].deleteGoalModalText}</Text>
            <View style={goalStyles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={goalStyles.deleteModalButton}>
                <Text style={goalStyles.deleteModalButtonText}>{languages[selectedLanguage].no}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGoalHandler()} style={[goalStyles.deleteModalButton, goalStyles.deleteModalButtonYes]}>
                <Text style={goalStyles.deleteModalButtonText}>{languages[selectedLanguage].yes}</Text>
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
          style={goalStyles.modalBackground}
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
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, goalStyles.bottomSheetBackground]} />
            )}
          >
            <View style={goalStyles.contentContainer}>
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
          style={goalStyles.modalBackground}
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
              setModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, goalStyles.bottomSheetBackground]} />
            )}
          >
            <View style={goalStyles.contentContainer}>
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


export default GoalScreen;
