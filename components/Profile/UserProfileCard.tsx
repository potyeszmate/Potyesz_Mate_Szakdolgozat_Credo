import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ProgressBarAndroid, Dimensions, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { ProfileCardStyles } from './ProfileComponentStyles';

const UserProfileCard = ({ userData }) => {
  const {
    name,
    rank,
    score,
    total,
    level,
    profilePicUrl
  } = userData;

  const getColor = (percentage: any) => {
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
  
  const progress = score / total;
  
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
          <Text style={ProfileCardStyles.level}>LEVEL {level}</Text>
          <Text style={ProfileCardStyles.pointsNeeded}>{total - score} points needed</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileCard;
