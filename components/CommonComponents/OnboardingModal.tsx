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
import { OnBoardingStyles } from './CommonComponentStyles';

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
      setStep(step - 1); 
    }
  };

  const renderHeader = () => (
    <View style={OnBoardingStyles.header}>
      <View style={OnBoardingStyles.textContainer}>
        <Text style={OnBoardingStyles.welcomeText}>Welcome to Credo!</Text>
        <Text style={OnBoardingStyles.instructionsText}>
          We're excited to have you on board. Please tell us about yourself.
        </Text>
      </View>


      {step === 2 && (
        <TouchableOpacity style={OnBoardingStyles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color="#35BA52" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity
      style={[
        OnBoardingStyles.button,
        { backgroundColor: isFinancialFormValid() ? '#35BA52' : '#ccc' },
      ]}
      onPress={handleSubmit}
      disabled={!isFinancialFormValid()}
    >
      <Text style={OnBoardingStyles.buttonText}>{step === 1 ? 'Next' : 'Submit'}</Text>
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
        style={OnBoardingStyles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={OnBoardingStyles.onboardingContainer}>
       
            {renderHeader()}

            {step === 1 && (
              <>
            <View style={OnBoardingStyles.formGroup}>
              <Text style={OnBoardingStyles.inputLabel}>First name</Text>
              <TextInput
                style={OnBoardingStyles.input}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />           
            </View>

            <View style={OnBoardingStyles.formGroup}>

            <Text style={OnBoardingStyles.inputLabel}>Last name</Text>
            <TextInput
              style={OnBoardingStyles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
              </View>

              <View style={OnBoardingStyles.formGroup}>

                <Text style={OnBoardingStyles.inputLabel}>Gender</Text>
                <DropDownPicker
                  open={showDatePicker}
                  value={selectedGender}
                  items={genders}
                  setOpen={setShowDatePicker}
                  setValue={setSelectedGender}
                  setItems={() => {}}
                  style={OnBoardingStyles.picker}
                  placeholder="Select gender"
                />
                  </View>


                <TouchableOpacity
                  style={[OnBoardingStyles.button, { backgroundColor: isPersonalFormValid() ? '#35BA52' : '#ccc' }]}
                  onPress={handleNext}
                  disabled={!isPersonalFormValid()}
                >
                  <Text style={OnBoardingStyles.buttonText}>Next</Text>
                </TouchableOpacity>
              </>

            )}

            {step === 2 && (
              <>
                
                <View style={OnBoardingStyles.formGroup}>

                <Text style={OnBoardingStyles.inputLabel}>Date of Birth</Text>
                {Platform.OS === 'ios' && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="spinner"
                    onChange={(event, date) =>
                      setDateOfBirth(date || dateOfBirth)
                    }
                    style={OnBoardingStyles.datePicker}
                  />

                )}
                </View>
                <View style={OnBoardingStyles.formGroup}>

                {/* Financial Details Form */}
                <Text style={OnBoardingStyles.inputLabel}>Current Estimated Balance in USD</Text>
                <TextInput
                  style={OnBoardingStyles.input}
                  placeholder="Enter current estimated balance"
                  keyboardType="numeric"
                  value={estimatedBalance}
                  onChangeText={setEstimatedBalance}
                />
                 </View>

                 <View style={OnBoardingStyles.formGroup}>

                <Text style={OnBoardingStyles.inputLabel}>Estimated Monthly Income in USD</Text>
                <TextInput
                  style={OnBoardingStyles.input}
                  placeholder="Enter estimated monthly income"
                  keyboardType="numeric"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                />
                 </View>

                 <TouchableOpacity
                    style={[
                      OnBoardingStyles.button,
                      { backgroundColor: isFinancialFormValid() ? '#35BA52' : '#ccc' },
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFinancialFormValid()}
                    activeOpacity={0.8} 
                  >
                   
                  <FontAwesome name="check" size={24} color="white" />
                  <Text style={OnBoardingStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default OnboardingModal;
