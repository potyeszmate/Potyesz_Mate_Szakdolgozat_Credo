import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'react-native-svg';

const OnboardingModal = ({ isVisible, onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [estimatedBalance, setEstimatedBalance] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const isPersonalFormValid = () => {
    return firstName && lastName && selectedGender;
  };

  const isFinancialFormValid = () => {
    return estimatedBalance && monthlyIncome && dateOfBirth;
  };

  const handleNext = () => {
    if (step === 1 && isPersonalFormValid()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(step - 1); // Go back to personal details
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to Credo!</Text>
        <Text style={styles.instructionsText}>
          We're excited to have you on board. Please tell us about yourself.
        </Text>
      </View>


      {step === 2 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color="#35BA52" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isFinancialFormValid() ? '#35BA52' : '#ccc' },
      ]}
      onPress={handleSubmit}
      disabled={!isFinancialFormValid()}
    >
      <Text style={styles.buttonText}>{step === 1 ? 'Next' : 'Submit'}</Text>
      {step === 2 && isFinancialFormValid() && (
        <FontAwesome name="check" size={24} color="white" />
      )}
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    if (isFinancialFormValid()) {
      Keyboard.dismiss();
      onComplete({
        firstName,
        lastName,
        gender: selectedGender,
        dateOfBirth,
        estimatedBalance: Number(estimatedBalance),
        monthlyIncome: Number(monthlyIncome),
      });
    } else {
      alert('Please fill all the fields');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.onboardingContainer}>
            {/* <Text style={styles.welcomeText}>Welcome to Credo!</Text>
            <Text style={styles.instructionsText}>
              Let's add some information about you.
            </Text> */}
            {renderHeader()}
            {/* {renderSubmitButton()} */}

            {step === 1 && (
              <>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />           
            </View>

            <View style={styles.formGroup}>

            <Text style={styles.inputLabel}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
              </View>

              <View style={styles.formGroup}>

                <Text style={styles.inputLabel}>Gender</Text>
                <DropDownPicker
                  open={showDatePicker}
                  value={selectedGender}
                  items={genders}
                  setOpen={setShowDatePicker}
                  setValue={setSelectedGender}
                  setItems={() => {}}
                  style={styles.picker}
                  placeholder="Select gender"
                />
                  </View>


                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isPersonalFormValid() ? '#35BA52' : '#ccc' }]}
                  onPress={handleNext}
                  disabled={!isPersonalFormValid()}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </>

            )}

            {step === 2 && (
              <>
                
                <View style={styles.formGroup}>

                <Text style={styles.inputLabel}>Date of Birth</Text>
                {Platform.OS === 'ios' && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="spinner"
                    onChange={(event, date) =>
                      setDateOfBirth(date || dateOfBirth)
                    }
                    style={styles.datePicker}
                  />

                )}
                </View>
                <View style={styles.formGroup}>

                {/* Financial Details Form */}
                <Text style={styles.inputLabel}>Current Estimated Balance in USD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current estimated balance"
                  keyboardType="numeric"
                  value={estimatedBalance}
                  onChangeText={setEstimatedBalance}
                />
                 </View>

                 <View style={styles.formGroup}>

                <Text style={styles.inputLabel}>Estimated Monthly Income in USD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter estimated monthly income"
                  keyboardType="numeric"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                />
                 </View>

                 <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: isFinancialFormValid() ? '#35BA52' : '#ccc' },
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFinancialFormValid()}
                    activeOpacity={0.8} // Slight opacity feedback on touch
                  >
                   
                  <FontAwesome name="check" size={24} color="white" />
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// styles remain the same as provided previously


const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20, // Added margins for the overall modal container
    backgroundColor: 'white',
    borderRadius: 25, // Smoothed corners for modal popup
    padding: 20, // Internal padding for modal content
    shadowColor: '#000', // Shadow for a slight depth effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    width: '100%', // Take the full width of the container
    marginBottom: 16, // Add some space before the first input field
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#35BA52',
    // marginTop: -50,
    marginBottom: 15, // Add space between the welcome text and instructions text
    textAlign: 'center', // Center text
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center', // Center text
  },
  formGroup: {
    width: '100%',
    alignItems: 'center', // Center align form group contents
    marginBottom: 16,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555', // A darker shade of grey for subtlety
    marginBottom: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd', // Lighter border color
    borderRadius: 10, // Rounded corners
    padding: 15, // Larger padding for a touch-friendly interface
    marginBottom: 20, // More space between inputs
    backgroundColor: '#f7f7f7',
    // height: '2%'
    },
    picker: {
      width: '90%',
      alignSelf: 'center',
      backgroundColor: '#f7f7f7',
      borderColor: '#ddd',
      borderRadius: 10,
      // marginBottom: 20,
      paddingHorizontal: 10,
      marginBottom: 70,
      zIndex: 1000, // Ensure the dropdown appears on top of all other components
    },
    datePicker: {
      width: '90%',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f7f7f7',
      // height: '20%'
    },
    backButton: {
      position: 'absolute',
      left: 0,
      top: 0,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    // Modify the button style to accommodate the icon next to the text
    button: {
      flexDirection: 'row',
      justifyContent: 'center', // Center button contents horizontally
      alignItems: 'center', // Center button contents vertically
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.1,
      elevation: 5,
      width: '90%', // Set width according to your design preference
      alignSelf: 'center', // Center button in the parent view
    },
    buttonIcon: {
      marginRight: 8, // Add space between the icon and text
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center', // Ensure text is centered if there's no icon
      flex: 1, // Take available space to push the text to center
    },
});

export default OnboardingModal;