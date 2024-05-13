import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioStyles } from './CommonComponentStyles';

interface RadioProps {
  selected: boolean;
}

const Radio: React.FC<RadioProps> = ({ selected }) => (
  <View style={[RadioStyles.radio, selected && RadioStyles.selectedRadio]} />
);

export default Radio;
