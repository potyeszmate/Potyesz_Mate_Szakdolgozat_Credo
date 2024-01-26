// JoinedChallanges.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const JoinedChallanges = ({ challanges }) => {
  const navigation = useNavigation();

  const handleChallangesOnClick = () => {
    navigation.navigate('Challanges');
};

  return (
    <View style={styles.cardContainer}>
      {/* 1st Row */}
      <View style={styles.firstRow}>
        <Text style={styles.challangesText}>Challenges</Text>
        <TouchableOpacity onPress={handleChallangesOnClick}>
            <FontAwesome name="chevron-right" size={15} color="#1A1A2C" />
        </TouchableOpacity>
      </View>

      {/* 2nd Row */}
      <View style={styles.secondRow}>
        <View style={styles.leftPart}>
          <Text style={styles.challangeName}>{challanges.name}</Text>
          <Text style={styles.challangeDesc}>{challanges.desc}</Text>
        </View>
        <View style={styles.rightPart}>
          <TouchableOpacity style={styles.joinedButton}>
            <Image source={require('../../assets/check.png')} style={styles.iconImage}/>
            <Text style={styles.joinedText}>Joined</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      width: '90%',
      alignSelf: 'center',
      marginTop: 20,

    },
    firstRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    challangesText: {
      fontSize: 17,
      color: '#1A1A2C',
    },
    arrowIcon: {
      fontSize: 16,
      color: '#1A1A2C',
    },
    secondRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    leftPart: {
      flex: 2,
    },
    rightPart: {
      flex: 1,
    },
    challangeName: {
      fontSize: 15,
      color: '#1A1A2C',
      paddingBottom: 2
    },
    challangeDesc: {
      fontSize: 14,
      color: '#7E8086',
    },
    joinedButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      borderWidth: 1, 
      borderColor: '#1A1A2C', // Border color
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconImage: {
        marginRight: 15,
      },
    joinedText: {
      color: '#1A1A2C',
    },
  });
  

export default JoinedChallanges;
