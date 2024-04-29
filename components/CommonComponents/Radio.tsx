import React from 'react';
import { View, StyleSheet } from 'react-native';

interface RadioProps {
  selected: boolean;
}

const Radio: React.FC<RadioProps> = ({ selected }) => (
  <View style={[styles.radio, selected && styles.selectedRadio]} />
);

const styles = StyleSheet.create({
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: '#000',
  },
});

export default Radio;
