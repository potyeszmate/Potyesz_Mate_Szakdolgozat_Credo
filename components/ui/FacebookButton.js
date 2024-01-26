/* eslint-disable react/react-in-jsx-scope */
import { Pressable, StyleSheet, Text, View,Image} from 'react-native';

import { Colors } from '../../constants/styles';
import FacebookIcon from '../../assets/facebook.png';
function FacebookButton({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Image source={FacebookIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FacebookButton;

const styles = StyleSheet.create({
    signInButton: {
        height: 51,
        backgroundColor: '#3B5998',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: 20, 
        height: 20, 
        marginRight: 8,
      },
      pressed: {
        opacity: 0.7,
      },
});
