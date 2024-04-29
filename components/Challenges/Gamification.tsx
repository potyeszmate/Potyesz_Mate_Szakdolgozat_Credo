import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import UserProfileCard from '../Profile/UserProfileCard';
import { db } from '../../firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../store/auth-context';
import BadgesList from '../Achievements/BadgeList';
import AchivementsList from '../Achievements/AchivementsList';

const Gamification: React.FC = () => {
  const [userSettings, setUserSettings] = useState<any>({});
  const [userGamification, setUserGamification] = useState<any>({});
  const [joinedChallanges, setJoinedChallenges] = useState<any>({});

  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const { userId } = authCtx;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUserSettings(), fetchUserGamification(), fetchJoinedChallenges()]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
    };
  }, []);

  const fetchUserSettings = async () => {
    const settingsQuery = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(settingsQuery);
    const userData = querySnapshot.docs[0]?.data();
    if (userData) {
      setUserSettings(userData);
    } else {
    }
  };

  const fetchUserGamification = async () => {
    const gamificationsQuery = query(collection(db, 'points'), where('uid', '==', userId));
    const querySnapshot = await getDocs(gamificationsQuery);
    const userData = querySnapshot.docs[0]?.data();
    if (userData) {
      setUserGamification(userData);
    } else {
    }
  };

  const fetchJoinedChallenges = async () => {
    try {
      const joinedChallengesQuery = query(collection(db, 'joinedChallenges'),  where('uid', '==', userId), where('isActive', '==', false));
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


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const fullName = `${userSettings.firstName} ${userSettings.lastName}`;
  return (
    <ScrollView>
      <UserProfileCard userData={{
        name: fullName,
        rank: userGamification.rank,
        score:  userGamification.score,
        total: userGamification.total,
        level: userGamification.level,
        profilePicUrl: userSettings.profilePicture
      }} />
      <BadgesList badges={{
        bronzeBadgeNumber: userGamification.bronzeBadgeNumber, 
        silverBadgeNumber: userGamification.silverBadgeNumber,
        goldBadgeNumber: userGamification.goldBadgeNumber,
        platinumBadgeNumber: userGamification.platinumBadgeNumber
      }} />

      <AchivementsList joinedChallenges={joinedChallanges}
       />
    </ScrollView>


  );
};

export default Gamification;
