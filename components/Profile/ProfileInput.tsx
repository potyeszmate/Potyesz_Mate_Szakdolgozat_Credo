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
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const genders: any = [
  { label: 'Select gender', value: null },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const ProfileInput: React.FC<any> = ({ onEditProfile, initialProfile, selectedLanguage }) => {
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);
  const valueInputRef = useRef<TextInput>(null);

  console.log(initialProfile)
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.modalContainer}>
        {/* ... */}
        {openProvider === true && (
          <View style={styles.debug}>
          </View>
        )}

        <Text style={styles.modalTitle}>Edit Profile</Text>

        {openProvider === false && (

        <View style={styles.inputWrapper}>
        <Text style={styles.label}>{languages[selectedLanguage].firstName}</Text>
        <TextInput
            ref={valueInputRef}
            placeholder="Enter your firstname"
            style={styles.input}
            value={profileFirstName}
            onChangeText={(text) => setProfileFirstName(text)}
        />
        </View>
        )}

        {openProvider === false && (

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>{languages[selectedLanguage].lastName}</Text>
            <TextInput
              ref={valueInputRef}
              placeholder="Enter your lastname"
              style={styles.input}
              value={profileLastName}
              onChangeText={(text) => setProfileLastName(text)}
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{languages[selectedLanguage].selectGender}</Text>
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
            style={styles.pickerContainer}
            containerStyle={styles.pickerContainer}
            placeholder={languages[selectedLanguage].selectGender}
    
          />
        </View>

        {openProvider === false && (

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>{languages[selectedLanguage].mobile}</Text>
            <TextInput
              placeholder="Enter name"
              style={styles.input}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text)}
            />
          </View>
        )}

        {openProvider === false && (

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>{languages[selectedLanguage].selectBirthday}</Text>
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
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
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

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  dateText: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
    marginTop: -60
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
  },
  debug: {
    marginTop: -272.5
  },

});

export default ProfileInput;
