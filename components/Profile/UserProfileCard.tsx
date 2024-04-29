import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ProgressBarAndroid, Dimensions, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';

const UserProfileCard = ({ userData }) => {
  const {
    name,
    rank,
    score,
    total,
    level,
    profilePicUrl
  } = userData;

  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

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
    <View style={styles.card}>
      <View style={styles.profileSection}>
      <Image
        source={profilePicUrl ? { uri: profilePicUrl } : require('../../assets/avatar.png')}
        style={styles.profilePic}
      />
      </View>
      <View style={styles.detailsSection}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rank}>{rank}</Text>
        <Progress.Bar
            progress={progress}
            width={Math.round(Dimensions.get('window').width * 0.59)}
            height={20}
            color={getColor(progress)}
            borderRadius={10}
            borderColor="#FFFFFF"
            unfilledColor="#F3F4F7"
        />
        <View style={styles.levelDetails}>
          <Text style={styles.level}>LEVEL {level}</Text>
          <Text style={styles.pointsNeeded}>{total - score} points needed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20
  },
  profileSection: {
    marginRight: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2
  },
  rank: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 2
  },
  progressBar: {
    height: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  levelDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  level: {
    fontWeight: 'bold',
  },
  pointsNeeded: {
    color: 'grey',
  },
});

export default UserProfileCard;
