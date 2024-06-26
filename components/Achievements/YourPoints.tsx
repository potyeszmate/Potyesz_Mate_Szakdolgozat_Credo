import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { languages } from '../../commonConstants/sharedConstants';
import { YourPointsStyles } from './AchievementsComponentStyles';

const YourPoints: React.FC<any> = ({ score, selectedLanguage }) => {

  const scorePoint = parseFloat(score);
  
  const pointsPerLevel = 300;
  const pointsCurrentLevel = score % pointsPerLevel; 
  
  const progressPercentage = Math.round((pointsCurrentLevel / pointsPerLevel * 100) / 5) * 5;

  const navigation = useNavigation();

  console.log(progressPercentage)
  
  const handleGamificationClick = () => {
    // @ts-ignore
    navigation.navigate('Gamification');
  };

  return (
    <View style={YourPointsStyles.cardContainer}>
      <View style={YourPointsStyles.leftContainer}>
        <ProgressCircle
          percent={progressPercentage}
          radius={40}
          borderWidth={16}
          color="#1CB854" 
          shadowColor="#F3F4F7" 
          bgColor="#fff"
        >
        </ProgressCircle>

        <View style={YourPointsStyles.pointsContainer}>
          <Text style={YourPointsStyles.yourPointsText}>{languages[selectedLanguage].yourPoints}</Text>
          <Text style={YourPointsStyles.pointsText}>
            <Text style={{ color: '#1A1A2C', fontWeight: 'bold' }}>{pointsCurrentLevel}</Text> / <Text style={{ color: '#7E8086', fontWeight: 'bold' }}>{pointsPerLevel}</Text>
          </Text>
        </View>
      </View>

      <View style={YourPointsStyles.rightContainer}>
        <TouchableOpacity onPress={handleGamificationClick}>
          <Feather name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default YourPoints;
