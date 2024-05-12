import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { AchivementBadgeIcons } from './AchievementsComponentConstants';
import { BadgeListStyles } from './AchievementsComponentStyles';

const BadgeCard = ({ name, count, icon, color }) => {
  return (
    <View style={[BadgeListStyles.badgeCard, { backgroundColor: color + '20', borderColor: color }]}>
      <Image source={icon} style={BadgeListStyles.badgeIcon} />
      <Text style={BadgeListStyles.badgeName}>{name}</Text>
      <Text style={[BadgeListStyles.badgeCount, { color: '#000000' }]}>{count}</Text>
    </View>
  );
};

const BadgesList = ({ badges }) => {
  const { bronzeBadgeNumber, silverBadgeNumber, goldBadgeNumber, platinumBadgeNumber } = badges;
  return (
    <View style={BadgeListStyles.container}>
      <Text style={BadgeListStyles.header}>Badges ({bronzeBadgeNumber + silverBadgeNumber + goldBadgeNumber + platinumBadgeNumber})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={BadgeListStyles.scrollView}>
        <BadgeCard name="Bronze" count={bronzeBadgeNumber} icon={AchivementBadgeIcons.bronze} color="#CD7F32" />
        <BadgeCard name="Silver" count={silverBadgeNumber} icon={AchivementBadgeIcons.silver} color="#C0C0C0" />
        <BadgeCard name="Gold" count={goldBadgeNumber} icon={AchivementBadgeIcons.gold} color="#FFD700" />
        <BadgeCard name="Platinum" count={platinumBadgeNumber} icon={AchivementBadgeIcons.platinum} color="#00a0ff" />
      </ScrollView>
    </View>
  );
};

export default BadgesList;
