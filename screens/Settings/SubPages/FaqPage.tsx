import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FAQstyles } from '../SettingsStyles';
import { faqData } from '../SettingsConstants';
import { ExpandedState } from '../SettingsTypes';
import { languages } from '../../../commonConstants/sharedConstants';
import { useRoute } from '@react-navigation/native';

const FAQPage = () => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const route: any = useRoute();
  const selectedLanguage = route.params?.selectedLanguage ?? 'English';
  
  const toggleAccordion = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ScrollView contentContainerStyle={FAQstyles.container}>
      <Text style={FAQstyles.title}>{languages[selectedLanguage].faqDesc}</Text>
      {languages[selectedLanguage].faqs.map((faq: any, index: any) => (
        <TouchableOpacity key={index} onPress={() => toggleAccordion(index)} style={FAQstyles.faqItem}>
          <View style={FAQstyles.questionContainer}>
            <Ionicons name="help-circle-outline" size={24} color="#333" style={FAQstyles.questionIcon} />
            <Text style={FAQstyles.question}>{faq.question}</Text>
            <Ionicons
              name={expanded[index] ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="#333"
            />
          </View>
          {expanded[index] && <Text style={FAQstyles.answer}>{faq.answer}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};


export default FAQPage;
