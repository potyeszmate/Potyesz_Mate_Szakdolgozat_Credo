import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ProgressCircle from 'react-native-progress-circle';
import { useNavigation } from '@react-navigation/native';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import { Feather } from '@expo/vector-icons';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const YourPoints: React.FC<any> = ({ score, total, selectedLanguage }) => {
  const scorePoint = parseFloat(score);
  const totalPoint = parseFloat(total);
  const progressPercentage = total !== '0' ? (scorePoint / totalPoint) * 100 : 0;
  const navigation = useNavigation();

  const handleGamificationClick = () => {
    // @ts-ignore
    navigation.navigate('Gamification');
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftContainer}>
        <ProgressCircle
          percent={progressPercentage}
          radius={40}
          borderWidth={16}
          color="#1CB854" 
          shadowColor="#F3F4F7" 
          bgColor="#fff"
        >
          {/* <Text style={{ fontSize: 18 }}>{`${progressPercentage.toFixed(0)}%`}</Text> */}
        </ProgressCircle>

        <View style={styles.pointsContainer}>
          <Text style={styles.yourPointsText}>{languages[selectedLanguage].yourPoints}</Text>
          <Text style={styles.pointsText}>
            <Text style={{ color: '#1A1A2C' }}>{scorePoint}</Text> / <Text style={{ color: '#7E8086' }}>{totalPoint}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={handleGamificationClick}>
          <Feather name="chevron-right" size={24} color="#888" />
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
