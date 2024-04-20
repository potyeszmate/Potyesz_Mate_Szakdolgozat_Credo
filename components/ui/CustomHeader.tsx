/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';

const CustomHeader: React.FC<any> = ({ authCtx, route }) => {
  const { userId } = authCtx;
  const navigation = useNavigation();

  const [profile, setProfile] = useState<any>();
  const [isProfileFetched, setIsProfileFetched] = useState(false); // State to track if profile data is fetched

  const handleSettingsPage = () => {
    // @ts-ignore
    navigation.navigate('SettingsPage');
  };

  const handleProfilePage = () => {
    // @ts-ignore
    navigation.navigate('ProfilePage');
  };

  const fetchProfile = async () => {
    try {
      const profileQuery = query(collection(db, 'users'),  where('uid', '==', userId));
      const querySnapshot = await getDocs(profileQuery);
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProfile(fetchedProfiles);
      console.log("fetchedProfiles", fetchedProfiles)
      setIsProfileFetched(true); // Update state to indicate profile data is fetched
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [userId]); // Include userId in the dependency array
  

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={handleProfilePage}>
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTextTop}>Good morning,</Text>
          {isProfileFetched && profile && profile.length > 0 && (
            <Text style={styles.headerTextBottom}>
              {profile[0].firstName} {profile[0].lastName}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={handleSettingsPage}>
          <Image
            source={require('../../assets/settings.png')}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 50, 
    height: 100,
    paddingBottom: 10,

  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 20,
    marginRight: 9,
  },
  headerTextTop: {
    color: 'gray',
    fontSize: 12,
    paddingBottom: 1
  },
  headerTextBottom: {
    color: '#1A1A2C',
    fontSize: 17,
  },
  rightSection: {},
  settingsIcon: {
    width: 24,
    height: 24,
  },
});


export default CustomHeader;
