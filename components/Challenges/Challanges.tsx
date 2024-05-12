import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { query, collection, getDocs, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ChallengesItem from './ChallengesItem';
import { AuthContext } from '../../store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';
import { ChallengesStyles } from './ChallengesComponentStyles';

const Challanges = () => {
  const [activeTab, setActiveTab] = useState<any>('active');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const authCtx = useContext(AuthContext);
  const { userId } = authCtx as any;

  const fetchJoinedChallenges = async () => {
    try {
      const joinedChallengesQuery = query(collection(db, 'joinedChallenges'),  where('uid', '==', userId));
      const querySnapshot = await getDocs(joinedChallengesQuery);

      const fetchedJoinedChallenges = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJoinedChallenges(fetchedJoinedChallenges);
    } catch (error: any) {
      console.error('Error fetching challenges:', error.message);
    }
  };

  const fetchChallenges = async () => {
    try {
      const challengesQuery = query(collection(db, 'challanges'));
      const querySnapshot = await getDocs(challengesQuery);

      const fetchedChallenges = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChallenges(fetchedChallenges);
    } catch (error: any) {
      console.error('Error fetching challenges:', error.message);
    }
  };

  const addJoinedChallenges = async (newJoinedChallende: any) => {
    try {
      await addDoc(collection(db, 'joinedChallenges'), {
        ...newJoinedChallende,
        uid: userId,
        isActive: true
      });

      fetchJoinedChallenges();
    } catch (error: any) {
      console.error('Error adding joinedChallenge:', error.message);
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
    const language = await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchChallenges();
    fetchJoinedChallenges();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
    }
  }, [isFocused]);
  
  return (
    <ScrollView
      style={ChallengesStyles.rootContainer}
      contentContainerStyle={ChallengesStyles.scrollContentContainer}
    >
      <View style={ChallengesStyles.headerContainer}>
        <TouchableOpacity
          style={[
            ChallengesStyles.tabButton,
            activeTab === 'active' && ChallengesStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              ChallengesStyles.tabButtonText,
              activeTab === 'active' && ChallengesStyles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].active}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ChallengesStyles.tabButton,
            activeTab === 'recommended' && ChallengesStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text
            style={[
              ChallengesStyles.tabButtonText,
              activeTab === 'recommended' && ChallengesStyles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].recommended}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ChallengesStyles.tabButton,
            activeTab === 'completed' && ChallengesStyles.activeTabButton,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              ChallengesStyles.tabButtonText,
              activeTab === 'completed' && ChallengesStyles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].completed}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'recommended' && (
        <View style={ChallengesStyles.challengesContainer}>
          {challenges
            .filter(challenge => !joinedChallenges.some(activeChallenge => activeChallenge.id === challenge.id))
            .map((challenge, index) => (
              <View key={challenge.id} style={[ChallengesStyles.challengeItemContainer, index !== challenges.length - 1 && ChallengesStyles.challengeItemSpacing]}>
                <ChallengesItem challenge={challenge} showActive={false} onJoin={() => addJoinedChallenges(challenge)} selectedLanguage={selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

      {activeTab === 'active' && (
        <View style={ChallengesStyles.challengesContainer}>
          {joinedChallenges
            .filter(challenge => challenge.isActive)
            .map((joinedChallenges, index) => (
              <View key={joinedChallenges.id} style={[ChallengesStyles.challengeItemContainer, index !== joinedChallenges.length - 1 && ChallengesStyles.challengeItemSpacing]}>
                <ChallengesItem challenge={joinedChallenges} showActive={true} selectedLanguage= {selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

      {activeTab === 'completed' && (
        <View style={ChallengesStyles.challengesContainer}>
          {joinedChallenges
            .filter(challenge => !challenge.isActive)
            .map((completedChallenge, index) => (
              <View key={completedChallenge.id} style={[ChallengesStyles.challengeItemContainer, index !== joinedChallenges.length - 1 && ChallengesStyles.challengeItemSpacing]}>
                <ChallengesItem challenge={completedChallenge} showCompleted={true} selectedLanguage= {selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

    </ScrollView>
  );
};

export default Challanges;
