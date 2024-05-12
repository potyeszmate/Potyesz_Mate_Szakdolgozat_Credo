import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { languages } from '../../commonConstants/sharedConstants';
import { genders } from './ProfileComponentConstants';
import { ProfileInputStyles } from './ProfileComponentStyles';

const ProfileInput: React.FC<any> = ({ onEditProfile, initialProfile, selectedLanguage }) => {
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);
  const valueInputRef = useRef<TextInput>(null);

  const addOrUpdateProfileHandler = () => {
    if (!profileFirstName || !profileLastName || !selectedGender || !mobileNumber) {
      console.warn('Please fill in all fields');
      return;
    }

    const profileData: any = {
      firstName: profileFirstName,
      lastName: profileLastName,
      gender: selectedGender,
      mobile: mobileNumber,
      birthday: selectedDate,
    };

    if (initialProfile) {
      profileData.id = initialProfile.id;
    }

    onEditProfile(profileData);

    setProfileFirstName('');
    setProfileLastName('');
    setSelectedGender(null);
    setMobileNumber('');
    setSelectedDate(new Date());
  };

  useEffect(() => {
    const isValidDate = initialProfile && initialProfile.birthday && !isNaN(initialProfile.birthday.toDate());

    if (initialProfile) {

      setProfileFirstName(initialProfile.firstName || '');
      setProfileLastName(initialProfile.lastName || '');

      setSelectedGender(initialProfile.gender ? initialProfile.gender : null);
      setMobileNumber(initialProfile.mobile || '');
      setSelectedDate(isValidDate ? new Date(initialProfile.birthday.toDate()) : new Date());

    }
  }, [initialProfile]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={ProfileInputStyles.modalContainer}>
        {openProvider === true && (
          <View style={ProfileInputStyles.debug}>
          </View>
        )}

        <Text style={ProfileInputStyles.modalTitle}>Edit Profile</Text>

        {openProvider === false && (

        <View style={ProfileInputStyles.inputWrapper}>
        <Text style={ProfileInputStyles.label}>{languages[selectedLanguage].firstName}</Text>
        <TextInput
            ref={valueInputRef}
            placeholder="Enter your firstname"
            style={ProfileInputStyles.input}
            value={profileFirstName}
            onChangeText={(text) => setProfileFirstName(text)}
        />
        </View>
        )}

        {openProvider === false && (

          <View style={ProfileInputStyles.inputWrapper}>
            <Text style={ProfileInputStyles.label}>{languages[selectedLanguage].lastName}</Text>
            <TextInput
              ref={valueInputRef}
              placeholder="Enter your lastname"
              style={ProfileInputStyles.input}
              value={profileLastName}
              onChangeText={(text) => setProfileLastName(text)}
            />
          </View>
        )}

        <View style={ProfileInputStyles.inputWrapper}>
          <Text style={ProfileInputStyles.label}>{languages[selectedLanguage].selectGender}</Text>
          <DropDownPicker
            open={openProvider}
            value={selectedGender}
            items={genders}
            setOpen={setOpenProvider}
            setValue={(value) => {
              setSelectedGender(value);
              setOpenProvider(false);
            }}
            setItems={() => {}}
            style={ProfileInputStyles.pickerContainer}
            containerStyle={ProfileInputStyles.pickerContainer}
            placeholder={languages[selectedLanguage].selectGender}
    
          />
        </View>

        {openProvider === false && (

          <View style={ProfileInputStyles.inputWrapper}>
            <Text style={ProfileInputStyles.label}>{languages[selectedLanguage].mobile}</Text>
            <TextInput
              placeholder="Enter name"
              style={ProfileInputStyles.input}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text)}
            />
          </View>
        )}

        {openProvider === false && (

          <View style={ProfileInputStyles.inputWrapper}>
            <Text style={ProfileInputStyles.label}>{languages[selectedLanguage].selectBirthday}</Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"  
                onChange={(event, date) => setSelectedDate(date || selectedDate)}
                style={{ width: '100%' }}
              />
            ) : (
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={ProfileInputStyles.dateText}>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  setSelectedDate(date || selectedDate);
                }}
              />
            )}
          </View>
        )} 

        {openProvider === false && (
          <Button title={languages[selectedLanguage].updateProfile} onPress={addOrUpdateProfileHandler} color="blue" />
        )}

      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProfileInput;
