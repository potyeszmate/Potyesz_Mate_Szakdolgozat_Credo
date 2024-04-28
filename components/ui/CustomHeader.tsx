/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';

const CustomHeader: React.FC<any> = ({ authCtx, route, profile}) => {
  const { userId } = authCtx;
  const navigation = useNavigation();

  // const [profile, setProfile] = useState<any>();
  const [isProfileFetched, setIsProfileFetched] = useState(false); // State to track if profile data is fetched

  const handleSettingsPage = () => {
    // @ts-ignore
    navigation.navigate('Settings');
  };

  const handleChatBotsPage = () => {
    // @ts-ignore
    // navigation.navigate('ChatBot');
  };

  const handleProfilePage = () => {
    // @ts-ignore
    navigation.navigate('Profile');
  };

  const handleChatbot = () => {
    // @ts-ignore
    navigation.navigate('Chatbot');
  };


  console.log("profile: ", profile)// const fetchProfile = async () => {

  if(profile){
    console.log("profile: ", profile)// const fetchProfile = async () => {
  //   console.log("userId: ", userId)
  //   try {
  //     const profileQuery = query(collection(db, 'users'),  where('uid', '==', userId));
  //     const querySnapshot = await getDocs(profileQuery);
  //     const fetchedProfiles = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     setProfile(fetchedProfiles);
  //     console.log("fetchedProfiles", fetchedProfiles)
  //     setIsProfileFetched(true); // Update state to indicate profile data is fetched
  //   } catch (error: any) {
  //     console.error('Error fetching profile:', error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  // useEffect(() => {
  //   // fetchProfile();
  // }, [userId]); // Include userId in the dependency array
  }

  return (
    <View style={styles.headerContainer}>
  {profile ? (
    <View style={styles.leftSection}>
      <TouchableOpacity onPress={handleProfilePage}>
        {profile?.profilePicture ? (
          <Image
            source={{ uri: profile.profilePicture }}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
          />
        )}
      </TouchableOpacity>
      <View>
        <Text style={styles.headerTextTop}>Good morning,</Text>
        {profile && (
          <Text style={styles.headerTextBottom}>
            {profile.firstName} {profile.lastName}
          </Text>
        )}
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  )}

<View style={[styles.rightSection, { flexDirection: 'row' }]}> 
  <TouchableOpacity onPress={handleSettingsPage}>
    <Image
      source={require('../../assets/settings.png')}
      style={styles.settingsIcon}
    />
  </TouchableOpacity>

  {profile && profile.isPremiumUser && ( // Corrected syntax
    <TouchableOpacity onPress={handleChatbot}>
      <Image
        source={require('../../assets/chatBot.png')}
        style={[styles.settingsIcon, { marginLeft: 20, marginRight: 10}]}
      />
    </TouchableOpacity>
  )}
</View>

</View>


  );
  
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 50, 
    height: 100,
    paddingBottom: 10,
    backgroundColor: '#F5F6F5',
    borderRadius: 7
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 100,
    marginRight: 9,
    marginLeft: 5
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
    width: 26,
    height: 26,
  },
});


export default CustomHeader;
