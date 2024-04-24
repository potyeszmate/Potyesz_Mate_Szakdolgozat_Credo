/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlatButton from './FlatButton';

const Separator: React.FC<any> = ({ onPress, isLogin }) => {
  return (
    <View style={styles.separatorContainer}>
      <View style={styles.separatorTextContainer}>
        <Text style={styles.separatorText}>--------------------</Text>
        <Text style={styles.separatorOrText}>OR</Text>
        <Text style={styles.separatorText}>--------------------</Text>
      </View>
    </View>
  );
};

export default Separator;

const styles = StyleSheet.create({
  separatorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12,
  },
  forgotPasswordContainer: {
    marginBottom: 5,
    alignSelf: 'flex-end', // Align to the right
  },
  forgotPassword: {
    fontSize: 15,
    color: '#149E53',
    textAlign: 'right',
  },
  separatorTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  separatorText: {
    flex: 1,
    height: 1.3,
    backgroundColor: '#CFCFD3',
    marginHorizontal: 8,
  },
  separatorOrText: {
    color: '#CFCFD3',
  },
});
