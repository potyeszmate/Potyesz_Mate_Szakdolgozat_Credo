import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConnectStyles } from '../SettingsStyles';
import { languages } from '../../../commonConstants/sharedConstants';
import { useRoute } from '@react-navigation/native';

const ConnectPage = () => {
  const route: any = useRoute();
  const selectedLanguage = route.params?.selectedLanguage ?? 'English';
  
  return (
    <View style={ConnectStyles.container}>
      <Text style={ConnectStyles.followText}>{languages[selectedLanguage].followUs}:</Text>

      <TouchableOpacity style={ConnectStyles.platformCard}>
        <Ionicons name="logo-facebook" size={24} color="#3b5998" />
        <Text style={ConnectStyles.platformText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={ConnectStyles.platformCard}>
        <Ionicons name="logo-instagram" size={24} color="#c13584" />
        <Text style={ConnectStyles.platformText}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity style={ConnectStyles.platformCard}>
        <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
        <Text style={ConnectStyles.platformText}>Twitter</Text>
      </TouchableOpacity>

      <View style={ConnectStyles.cardContainer}>
        <View style={ConnectStyles.card}>
          <View style={ConnectStyles.iconContent}>
            <Ionicons name="mail-outline" size={24} color="#1CB854" />
          </View>
          <View style={ConnectStyles.textContent}>
            <Text style={ConnectStyles.emailTitle}>{languages[selectedLanguage].sendFeedback}:</Text>
            <Text style={ConnectStyles.email}>contact@credo.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
};


export default ConnectPage;
