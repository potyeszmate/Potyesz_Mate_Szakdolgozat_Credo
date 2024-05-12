import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { AchivementBadgeIcons } from './AchievementsComponentConstants';
import { AchivementListStyles } from './AchievementsComponentStyles';

const ChallengeCard = ({ challenge }) => {
  const shortDescription = challenge.desc.length > 100 ? `${challenge.desc.substring(0, 100)}...` : challenge.desc;
  return (
    <View style={AchivementListStyles.challengeCard}>
      <Image source={AchivementBadgeIcons[challenge.badge.toLowerCase()]} style={AchivementListStyles.challengeIcon} />
      <View style={AchivementListStyles.challengeInfo}>
        <Text style={AchivementListStyles.challengeName}>{challenge.name}</Text>
        <Text style={AchivementListStyles.challengeDetail}>{shortDescription}</Text>
      </View>
    </View>
  );
};

const AchievementsList = ({ joinedChallenges }) => {
  return (
    <View style={AchivementListStyles.container}>
      <Text style={AchivementListStyles.header}>Achievements ({joinedChallenges.length})</Text>
      <ScrollView style={AchivementListStyles.challengesContainer} showsVerticalScrollIndicator={false}>
        {joinedChallenges.map(challenge => (
          <View key={challenge.id} style={AchivementListStyles.separator}>
            <ChallengeCard challenge={challenge} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AchievementsList;
