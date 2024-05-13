import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ButtonStyles } from './CommonComponentStyles';

const Button: React.FC<any> = ({ children, onPress, isFilled }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        ButtonStyles.signInButton,
        !isFilled && ButtonStyles.inactiveButton,
        pressed && ButtonStyles.pressed
      ]}
      onPress={onPress}
      disabled={!isFilled}
    >
      <View>
        <Text style={ButtonStyles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default Button;
