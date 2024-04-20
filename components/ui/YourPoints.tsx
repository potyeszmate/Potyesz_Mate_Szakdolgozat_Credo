import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DonutChartPoints from './DonutChartPoints';
import { useNavigation } from '@react-navigation/native';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const YourPoints: React.FC<any> = ({ score, total, selectedLanguage }) => {
  const scorePoint = parseFloat(score);
  const totalPoint = parseFloat(total);
  const progressValue = total !== '0' ? scorePoint / totalPoint : 0;
  const navigation = useNavigation();

  const handleGamificationClick = () => {
    // @ts-ignore
    navigation.navigate('Gamification'); //as never
  };

  return (
    <View style={styles.cardContainer}>
      {/* Left Side */}
      <View style={styles.leftContainer}>
        <DonutChartPoints size={60} progress={progressValue} strokeWidth={12} color="#1A1A2C" />

        <View style={styles.pointsContainer}>
          <Text style={styles.yourPointsText}>{languages[selectedLanguage].yourPoints}</Text>
          <Text style={styles.pointsText}>
            <Text style={{ color: '#1A1A2C' }}>{scorePoint}</Text> / <Text style={{ color: '#7E8086' }}>{totalPoint}</Text>
          </Text>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={handleGamificationClick}>
          <FontAwesome name="chevron-right" size={20} color="#1A1A2C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    marginTop: 16,
    width: '90%',
    alignSelf: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourPointsText: {
    fontSize: 16,
    color: '#1A1A2C',
  },
  pointsContainer: {
    marginLeft: 17,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 20,
    marginVertical: 2,
  },
  rightContainer: {},
});

export default YourPoints;
