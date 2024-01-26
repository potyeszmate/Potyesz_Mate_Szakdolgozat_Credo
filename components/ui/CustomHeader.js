/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import IconButton from './IconButton';

const CustomHeader = ({ navigation, route, authCtx }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/avatar.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.headerTextTop}>Good morning,</Text>
          <Text style={styles.headerTextBottom}>{authCtx.email}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <IconButton
          icon="exit"
          color="black"
          size={24}
          // eslint-disable-next-line react/prop-types
          onPress={authCtx.logout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent', // Make the background transparent
    paddingHorizontal: 16,
    paddingTop: 50, 
    height: 90,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  headerTextTop: {
    color: 'gray',
    fontSize: 12,
  },
  headerTextBottom: {
    color: 'black',
    fontSize: 16,
  },
  rightSection: {},
});


export default CustomHeader;
