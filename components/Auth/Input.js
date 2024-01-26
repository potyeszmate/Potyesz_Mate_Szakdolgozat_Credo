/* eslint-disable react/react-in-jsx-scope */
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../constants/styles';

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      {/* <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        // {label}
      </Text> */}
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize={false}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={label}  

      />
      
    </View>
  );
}

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
