import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../commonConstants/styles';

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

      <TextInput
        placeholderTextColor="#8B8B8B"
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


const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: '#f0f0f0',
    marginBottom: 1,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 16,
    fontSize: 16, 
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});

export default Input;
