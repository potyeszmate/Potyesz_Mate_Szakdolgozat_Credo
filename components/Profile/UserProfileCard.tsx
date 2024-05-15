import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { ProfileCardStyles } from './ProfileComponentStyles';

const UserProfileCard = ({ userData }) => {
  const {
    name,
    rank,
    score,
    profilePicUrl
  } = userData;

  const pointsPerLevel = 300;
  const currentLevel = Math.floor(score / pointsPerLevel) + 1;
  const pointsCurrentLevel = score % pointsPerLevel;
  const pointsNeeded = pointsPerLevel - pointsCurrentLevel;
  const progress = pointsCurrentLevel / pointsPerLevel;

  const getColor = (percentage) => {
    if (percentage < 0.25) {
      return '#FF0000'; 
    } else if (percentage < 0.50) {
      return '#FFA500'; 
    } else if (percentage < 0.75) {
      return '#FFFF00'; 
    } else {
      return '#008000'; 
    }
  };

  return (
    <View style={ProfileCardStyles.card}>
      <View style={ProfileCardStyles.profileSection}>
        <Image
          source={profilePicUrl ? { uri: profilePicUrl } : require('../../assets/avatar.png')}
          style={ProfileCardStyles.profilePic}
        />
      </View>
      <View style={ProfileCardStyles.detailsSection}>
        <Text style={ProfileCardStyles.name}>{name}</Text>
        <Text style={ProfileCardStyles.rank}>{rank}</Text>
        <Progress.Bar
            progress={progress}
            width={Math.round(Dimensions.get('window').width * 0.59)}
            height={20}
            color={getColor(progress)}
            borderRadius={10}
            borderColor="#FFFFFF"
            unfilledColor="#F3F4F7"
        />
        <View style={ProfileCardStyles.levelDetails}>
          <Text style={ProfileCardStyles.level}>LEVEL {currentLevel}</Text>
          <Text style={ProfileCardStyles.pointsNeeded}>{pointsNeeded} points needed</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileCard;
