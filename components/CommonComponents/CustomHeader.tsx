import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { languages } from '../../commonConstants/sharedConstants';
import { CustomHeaderStyles } from './CommonComponentStyles';

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
    style={[CustomHeaderStyles.settingsIcon, { marginLeft: 20, marginRight: 10 }]}
  />
</TouchableOpacity>


  if (isLoading || !profile) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if(profile){
  }

  return (
    <View style={CustomHeaderStyles.headerContainer}>
  {profile ? (
    <View style={CustomHeaderStyles.leftSection}>
      <TouchableOpacity onPress={handleProfilePage}>
        {profile?.profilePicture ? (
          <Image
            source={{ uri: profile.profilePicture }}
            style={CustomHeaderStyles.avatar}
          />
        ) : (
          <Image
            source={require('../../assets/avatar.png')}
            style={CustomHeaderStyles.avatar}
          />
        )}
      </TouchableOpacity>
      <View> 
        <Text style={CustomHeaderStyles.headerTextTop}>{languages[selectedLanguage].goodMorning}</Text>
          <Text style={CustomHeaderStyles.headerTextBottom}>
            {profile.firstName} {profile.lastName}
          </Text>
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  )}

<View style={[CustomHeaderStyles.rightSection, { flexDirection: 'row' }]}> 
{profile && ( 
    <TouchableOpacity onPress={handleNavigation}>
      <Image
        source={require('../../assets/chatBot.png')}
        style={[CustomHeaderStyles.settingsIcon, { marginLeft: 20, marginRight: 10}]}
      />
    </TouchableOpacity>
  )}

  <TouchableOpacity onPress={handleSettingsPage}>
    <Image
      source={require('../../assets/settings.png')}
      style={CustomHeaderStyles.settingsIcon}
    />
  </TouchableOpacity>

 
</View>

</View>


  );
  
};

export default CustomHeader;
