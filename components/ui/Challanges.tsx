import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { query, collection, getDocs, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ChallengesItem from './ChallengesItem';
import { AuthContext } from '../../store/auth-context';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const Challanges = () => {
  const [activeTab, setActiveTab] = useState<any>('active');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language


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
      console.log('Fetched challenges:', fetchedJoinedChallenges);
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
      console.log('Fetched challenges:', fetchedChallenges);
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

  useEffect(() => {
    fetchChallenges();
    fetchJoinedChallenges();
  }, []);

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
    if (isFocused) {
      fetchLanguage();
      console.log("In useEffect")
    }
  }, [isFocused]);
  
  return (
    <ScrollView
      style={styles.rootContainer}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'active' && styles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].active}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'recommended' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'recommended' && styles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].recommended}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'completed' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'completed' && styles.activeTabButtonText,
            ]}
          >
            {languages[selectedLanguage].completed}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'recommended' && (
        <View style={styles.challengesContainer}>
          {challenges
            .filter(challenge => !joinedChallenges.some(activeChallenge => activeChallenge.id === challenge.id))
            .map((challenge, index) => (
              <View key={challenge.id} style={[styles.challengeItemContainer, index !== challenges.length - 1 && styles.challengeItemSpacing]}>
                <ChallengesItem challenge={challenge} showActive={false} onJoin={() => addJoinedChallenges(challenge)} selectedLanguage= {selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

      {activeTab === 'active' && (
        <View style={styles.challengesContainer}>
          {joinedChallenges
            .filter(challenge => challenge.isActive)
            .map((joinedChallenges, index) => (
              <View key={joinedChallenges.id} style={[styles.challengeItemContainer, index !== joinedChallenges.length - 1 && styles.challengeItemSpacing]}>
                <ChallengesItem challenge={joinedChallenges} showActive={true} selectedLanguage= {selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

      {activeTab === 'completed' && (
        <View style={styles.challengesContainer}>
          {joinedChallenges
            .filter(challenge => !challenge.isActive)
            .map((completedChallenge, index) => (
              <View key={completedChallenge.id} style={[styles.challengeItemContainer, index !== joinedChallenges.length - 1 && styles.challengeItemSpacing]}>
                <ChallengesItem challenge={completedChallenge} showCompleted={true} selectedLanguage= {selectedLanguage}/>
              </View>
            ))}
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: 30
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
    fontFamily: 'Inter', // Make sure you have the Inter font available
  },
  activeTabButton: {
    backgroundColor: '#1A1A2C',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 18,
  },
  text: {
    marginBottom: 8,
  },
  listContainer: {
    width: '100%',
  },
  challengesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  challengeItemContainer: {
    marginBottom: 12, // Add marginBottom to create a gap between challenge cards
  },
  challengeItemSpacing: {
    marginBottom: 0, // No marginBottom for the last challenge card
  },
  });

export default Challanges;
