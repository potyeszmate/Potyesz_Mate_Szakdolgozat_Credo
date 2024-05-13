import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../store/auth-context';
import { languages } from '../../commonConstants/sharedConstants';

const CustomHeader: React.FC<any> = ({ authCtx, route, profile, isLoading, selectedLanguage}) => {
  const { userId } = authCtx;
  const navigation = useNavigation();

  console.log("selectedLanguage in CustomHeader: ",selectedLanguage )
  const [isProfileFetched, setIsProfileFetched] = useState(false); 

  const handleSettingsPage = () => {
    // @ts-ignore
    navigation.navigate('Settings');
  };

  const handleChatBotsPage = () => {
    // @ts-ignore
  };

  const handleProfilePage = () => {
    // @ts-ignore
    navigation.navigate('Profile');
  };

const handleNavigation = () => {
  if (profile && profile.isPremiumUser) {
    // @ts-ignore
    navigation.navigate('Chatbot', { selectedLanguage: selectedLanguage});

  } else {
    // @ts-ignore
    navigation.navigate('Payment', {
      email: authCtx.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      selectedLanguage
    });
  }
};

<TouchableOpacity onPress={handleNavigation}>
  <Image
    source={require('../../assets/chatBot.png')}
    style={[styles.settingsIcon, { marginLeft: 20, marginRight: 10 }]}
  />
</TouchableOpacity>


  if (isLoading || !profile) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if(profile){
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
        <Text style={styles.headerTextTop}>{languages[selectedLanguage].goodMorning}</Text>
          <Text style={styles.headerTextBottom}>
            {profile.firstName} {profile.lastName}
          </Text>
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  )}

<View style={[styles.rightSection, { flexDirection: 'row' }]}> 
{profile && ( 
    <TouchableOpacity onPress={handleNavigation}>
      <Image
        source={require('../../assets/chatBot.png')}
        style={[styles.settingsIcon, { marginLeft: 20, marginRight: 10}]}
      />
    </TouchableOpacity>
  )}

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
    marginRight: 3,
    marginLeft: 2
  },
});


export default CustomHeader;