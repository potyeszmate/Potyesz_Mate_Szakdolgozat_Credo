import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AuthInputStyles } from './AuthComponentStyles';

const Input: React.FC<any> = ({
  label,
  keyboardType,
  secureTextEntry,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  ...restProps
}) => {
  return (
    <View style={AuthInputStyles.inputContainer}>

      <TextInput
        placeholderTextColor="#8B8B8B"
        style={[AuthInputStyles.input, isInvalid && AuthInputStyles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={placeholder}
        {...restProps}
      />
    </View>
  );
};

export default Input;
