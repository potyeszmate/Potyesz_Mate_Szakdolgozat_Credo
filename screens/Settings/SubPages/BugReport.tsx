import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { bugReportStyles } from '../SettingsStyles';
import { languages } from '../../../commonConstants/sharedConstants';
import { useRoute } from '@react-navigation/native';

const BugReportPage = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const route: any = useRoute();
  const selectedLanguage = route.params?.selectedLanguage ?? 'English';
  
  const handleReportBug = () => {
  };

  return (
    <View style={bugReportStyles.container}>
      <Text style={bugReportStyles.label}>{languages[selectedLanguage].subject}:</Text>
      <TextInput
        style={bugReportStyles.input}
        placeholder={languages[selectedLanguage].enterSubject}
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={bugReportStyles.label}>{languages[selectedLanguage].description}:</Text>
      <TextInput
        style={[bugReportStyles.input, bugReportStyles.descriptionInput]}
        placeholder={languages[selectedLanguage].enterDescription}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={bugReportStyles.reportButton} onPress={handleReportBug}>
        <Text style={bugReportStyles.reportButtonText}>{languages[selectedLanguage].reportbug}</Text>
      </TouchableOpacity>
    </View>
  );
};



export default BugReportPage;
