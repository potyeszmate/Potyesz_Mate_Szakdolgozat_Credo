import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { languages } from '../../commonConstants/sharedConstants';
import { JoinedChallengesStyles } from './ChallengesComponentStyles';

const JoinedChallanges: React.FC<any> = ({ challanges, selectedLanguage }) => {
  const navigation = useNavigation();

  const handleChallangesOnClick = () => {
    // @ts-ignore
    navigation.navigate('Challenges');
  };

  const maxLength = 50; 
  let truncatedText = challanges.desc;

  if (truncatedText.length > maxLength) {
    truncatedText = truncatedText.substring(0, maxLength) + "...";
  }

  return (
    <View style={JoinedChallengesStyles.cardContainer}>
      <View style={JoinedChallengesStyles.firstRow}>
        <Text style={JoinedChallengesStyles.challangesText}>{languages[selectedLanguage].challenges}</Text>
        <TouchableOpacity onPress={handleChallangesOnClick}>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={JoinedChallengesStyles.secondRow}>
        <View style={JoinedChallengesStyles.leftPart}>
          <Text style={JoinedChallengesStyles.challangeName}>{challanges.name}</Text>
          <Text style={JoinedChallengesStyles.challangeDesc}>{truncatedText}</Text>
        </View>
        <View style={JoinedChallengesStyles.rightPart}>
          <TouchableOpacity style={JoinedChallengesStyles.joinedButton}>
            <Text style={JoinedChallengesStyles.joinedText}>{languages[selectedLanguage].joined}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



export default JoinedChallanges;
