import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../commonConstants/styles';
import { FlatButtonStyles } from './CommonComponentStyles';

const FlatButton: React.FC<any> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [FlatButtonStyles.button, pressed && FlatButtonStyles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={FlatButtonStyles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FlatButton;

