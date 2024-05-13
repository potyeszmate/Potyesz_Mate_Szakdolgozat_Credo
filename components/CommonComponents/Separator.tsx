
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlatButton from './FlatButton';
import { SeparatorStyles } from './CommonComponentStyles';

const Separator: React.FC<any> = ({ onPress, isLogin }) => {
  return (
    <View style={SeparatorStyles.separatorContainer}>
      <View style={SeparatorStyles.separatorTextContainer}>
        <Text style={SeparatorStyles.separatorText}>--------------------</Text>
        <Text style={SeparatorStyles.separatorOrText}>OR</Text>
        <Text style={SeparatorStyles.separatorText}>--------------------</Text>
      </View>
    </View>
  );
};

export default Separator;
