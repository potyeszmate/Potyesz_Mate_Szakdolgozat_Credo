/* eslint-disable react/react-in-jsx-scope */
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../constants/styles';

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
    <View style={styles.inputContainer}>
      {/* <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        // {label}
      </Text> */}
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
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

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 1,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    // 1CB854
    // E7E7E9
    borderColor: '#E7E7E9',
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
    paddingHorizontal: 5,
    
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
