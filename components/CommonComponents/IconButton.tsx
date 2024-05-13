import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButtonStyles } from './CommonComponentStyles';

const IconButton: React.FC<any> = ({ icon, color, size, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [IconButtonStyles.button, pressed && IconButtonStyles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
};

export default IconButton;


