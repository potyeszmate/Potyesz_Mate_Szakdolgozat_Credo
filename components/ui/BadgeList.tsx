import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const icons = {
  bronze: require('../../assets/bronzeBadge.png'),
  silver: require('../../assets/silverBadge.png'),
  gold: require('../../assets/goldBadge.png'),
  platinum: require('../../assets/platinumBadge.png'),
};

const BadgeCard = ({ name, count, icon, color }) => {
  return (
    <View style={[styles.badgeCard, { backgroundColor: color + '20', borderColor: color }]}>
      <Image source={icon} style={styles.badgeIcon} />
      <Text style={styles.badgeName}>{name}</Text>
      <Text style={[styles.badgeCount, { color: '#000000' }]}>{count}</Text>
    </View>
  );
};

const BadgesList = ({ badges }) => {
  const { bronzeBadgeNumber, silverBadgeNumber, goldBadgeNumber, platinumBadgeNumber } = badges;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Badges ({bronzeBadgeNumber + silverBadgeNumber + goldBadgeNumber + platinumBadgeNumber})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <BadgeCard name="Bronze" count={bronzeBadgeNumber} icon={icons.bronze} color="#CD7F32" />
        <BadgeCard name="Silver" count={silverBadgeNumber} icon={icons.silver} color="#C0C0C0" />
        <BadgeCard name="Gold" count={goldBadgeNumber} icon={icons.gold} color="#FFD700" />
        <BadgeCard name="Platinum" count={platinumBadgeNumber} icon={icons.platinum} color="#00a0ff" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
    marginHorizontal: 15,
  },
  scrollView: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 18,
    color: '#808080',
    marginBottom: 10,
  },
  badgeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 2,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 17,
    marginBottom: 20,
    marginTop: 10
  },
  badgeIcon: {
    width: 50,
    height: 50,
  },
  badgeName: {
    fontSize: 16,
    color: '#000000', 
    marginBottom: 5,
  },
  badgeCount: {
    fontSize: 14,
    color: '#ffffff',
  }
});

export default BadgesList;
