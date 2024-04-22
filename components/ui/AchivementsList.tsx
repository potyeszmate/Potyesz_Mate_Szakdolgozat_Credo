import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const icons = {
  bronze: require('../../assets/bronzeBadge.png'),
  silver: require('../../assets/silverBadge.png'),
  gold: require('../../assets/goldBadge.png'),
  platinum: require('../../assets/platinumBadge.png'),
};

const ChallengeCard = ({ challenge }) => {
  const shortDescription = challenge.desc.length > 100 ? `${challenge.desc.substring(0, 100)}...` : challenge.desc;
  return (
    <View style={styles.challengeCard}>
      <Image source={icons[challenge.badge.toLowerCase()]} style={styles.challengeIcon} />
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeName}>{challenge.name}</Text>
        <Text style={styles.challengeDetail}>{shortDescription}</Text>
      </View>
    </View>
  );
};

const AchievementsList = ({ joinedChallenges }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Achievements ({joinedChallenges.length})</Text>
      <ScrollView style={styles.challengesContainer} showsVerticalScrollIndicator={false}>
        {joinedChallenges.map(challenge => (
          <View key={challenge.id} style={styles.separator}>
            <ChallengeCard challenge={challenge} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  challengesContainer: {
    maxHeight: 500, // Reduced maxHeight for better scrolling experience
  },
  header: {
    fontSize: 18,
    color: '#808080',
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent', // Removing card background
  },
  challengeIcon: {
    width: 55,
    height: 55,
    marginRight: 15,
    backgroundColor: '#e0e0e0', // Light grey background for icons
    borderRadius: 30, // Circular background
    padding: 5,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeDetail: {
    fontSize: 14,
    color: '#666',
  }
});

export default AchievementsList;
