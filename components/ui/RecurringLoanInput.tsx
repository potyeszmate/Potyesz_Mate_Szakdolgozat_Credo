/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, Image, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';

interface RecurringTransactionInputProps {
  onAddRecurringTransaction: (newRecurringTransaction: any) => void;
  initialRecurringTransaction?: any;
  currency: string,
  conversionRate: number; // Add the conversionRate prop here,
  selectedLanguage: string;
  onDeleteRecurringTransaction?: (newRecurringTransaction: any) => void;
  onClose: () => void  // This function should handle closing the modal

}

const iconMapping: { [key: string]: any } = {
  'Credit card' : require('../../assets/Recurrings/Credit_card.png'),
  'Mortgage' : require('../../assets/Recurrings/Mortgage.png'),
  'Bank loan': require('../../assets/Recurrings/Bank_loan.png'),
  'Personal loan': require('../../assets/Recurrings/Personal_loan.png'),
  'Student loan': require('../../assets/Recurrings/Student_loan.png'),
  'Car loan': require('../../assets/Recurrings/Car_loan.png'),
};

const providers: any = [
  // { label: 'Select a provider', value: null },
  { label: 'Credit card', value: 2 },
  { label: 'Mortgage', value: 3 },
  { label: 'Bank loan', value: 4 },
  { label: 'Student loan', value: 5 },
  { label: 'Car loan', value: 6 },
  { label: 'Hospitality', value: 7 },
];

const selectProviderIcon = require('../../assets/Recurrings/provider.png');
const selectDate = require('../../assets/Recurrings/date.png');
const arrow = require('../../assets/angle-right.png');

import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import Icon from 'react-native-vector-icons/MaterialIcons';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const RecurringLoanInput: React.FC<RecurringTransactionInputProps> = ({ onAddRecurringTransaction, initialRecurringTransaction, conversionRate, currency, selectedLanguage, onDeleteRecurringTransaction, onClose }) => {
  const [recurringTransactionName, setRecurringTransactionName] = useState('');
  const [recurringTransactionValue, setRecurringTransactionValue] = useState('');

  const [selectedProvider, setSelectedProvider] = useState(null as any);
  const [activeTab, setActiveTab] = useState('Monthly');
  const bottomSheetRef = useRef<any>(null);

  const [openProvider, setOpenProvider] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalProviderVisible, setModalProviderVisible] = useState(false);
  const [modalDateVisible, setModalDateVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);
  // const textInputRef = useRef(null);
  const valueInputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null); // Explicitly type the ref as a TextInput ref

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['20%', '30%', '70%'] : ['20%', '30%', '40%'];
  }, [textInputFocused]); 
  
  const snapPointsDateModal = useMemo(() => ['50%'], []);

  
  const handleSheetChanges = (index: any) => {
    if (index === -1) { // -1 when bottomSheet is fully closed
      setModalProviderVisible(false);
      textInputRef.current?.blur(); // Ensure TextInput is blurred when BottomSheet is closed
    }
  };

  const handleClose = () => {
    setModalProviderVisible(false);
    textInputRef.current?.blur(); // Ensure TextInput is blurred
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = providers.filter((provider: any) =>
    provider.label.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    const isValidDate = initialRecurringTransaction && initialRecurringTransaction.Date && !isNaN(initialRecurringTransaction.Date.toDate());

    if (initialRecurringTransaction) {
      setRecurringTransactionName(initialRecurringTransaction.name || '');
      // setSelectedProvider(providers.findIndex((prov: any) => prov.label === initialRecurringTransaction.name) + 1);
      setSelectedProvider(initialRecurringTransaction.name); // Set directly to the name

      const formattedValue =
      initialRecurringTransaction.value !== undefined &&
      initialRecurringTransaction.value !== null
        ? currency === 'HUF'
          ? Math.round(parseFloat(initialRecurringTransaction.value) * conversionRate).toString()
          : (parseFloat(initialRecurringTransaction.value) * conversionRate).toFixed(2).toString()
        : '';

      setRecurringTransactionValue(formattedValue);
      setSelectedDate(isValidDate ? new Date(initialRecurringTransaction.Date.toDate()) : new Date());
      setActiveTab(initialRecurringTransaction.Usage_frequency || 'Monthly');
    }
  }, [initialRecurringTransaction]);

  const addOrUpdateRecurringTransactionHandler = () => {
    if (!recurringTransactionValue || selectedProvider === null || selectedProvider === 1 || !activeTab) {
      console.warn('Please fill in all fields');
      return;
    }
  
    const categoryToUse = activeTab;
  
    // const selectedProviderLabel = selectedProvider && providers[selectedProvider - 1]?.label;
  
    const recurringTransactionData: any = {
      name: selectedProvider || '',
      category: categoryToUse,
      value: conversionRate !== null ? (1 / conversionRate) * parseFloat(recurringTransactionValue) : parseFloat(recurringTransactionValue),
      Date: selectedDate,
      Usage_frequency: activeTab,
      Acceptance: '',
    };
  
    if (initialRecurringTransaction && initialRecurringTransaction.id) {
      recurringTransactionData.id = initialRecurringTransaction.id;
    }
  
    onAddRecurringTransaction(recurringTransactionData);
  
    setRecurringTransactionName('');
    setRecurringTransactionValue('');
    setSelectedProvider('');
    setActiveTab('Monthly');
    setSelectedDate(new Date());
  };
  
  const handleDeleteIconClick = (recurringTransactionId: string) => {
    // setSelectedRecurringTransactionId(recurringTransactionId);
    onDeleteRecurringTransaction && onDeleteRecurringTransaction(recurringTransactionId);
  };

  useEffect(() => {
    console.log('Current Category:', activeTab);
  }, [activeTab]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.modalContainer, styles.container]}>
        {openProvider === true && (
          <View style={styles.debug}>
          </View>
        )}
  
        {/* <Text style={styles.modalTitle}>
          {initialRecurringTransaction ? languages[selectedLanguage].editSubscription : languages[selectedLanguage].newSubscription}
        </Text> */}
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.modalTitle}>
            {initialRecurringTransaction ? languages[selectedLanguage].editLoan : languages[selectedLanguage].newLoan}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.inputWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
          <TextInput
            ref={valueInputRef}
            placeholder={`0`}
            placeholderTextColor="#1A1A2C"
            style={[styles.input, { fontWeight: 'bold', fontSize: 32, textAlign: 'center', color: 'black', borderBottomWidth: 0 }]}
            keyboardType="numeric"
            value={recurringTransactionValue}
            onChangeText={(text) => setRecurringTransactionValue(text)}
          />

          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1A1A2C', marginLeft: 10, marginBottom: 5 }}>{currency}</Text>

          </View>
        </View>
  
        <View style={[styles.headerContainer]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab !== 'Weekly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Weekly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Weekly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Weekly' && styles.activeTabButtonText]}>{languages[selectedLanguage].Weekly}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[styles.tabButton, activeTab !== 'Monthly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Monthly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Monthly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Monthly' && styles.activeTabButtonText]}>{languages[selectedLanguage].Monthly}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[styles.tabButton, activeTab !== 'Yearly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Yearly' && styles.activeTabButton]}
            onPress={() => setActiveTab('Yearly')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Yearly' && styles.activeTabButtonText, activeTab === 'Yearly' && { color: '#FFFFFF' }]}>{languages[selectedLanguage].Yearly}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.divider} />
  
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setModalProviderVisible(true)}>
            <View style={styles.iconContainer}>
              {/* <Image source={selectProvider} style={styles.icon} /> */}
              <Image
                source={selectedProvider !== null ? iconMapping[selectedProvider] : selectProviderIcon}
                style={styles.icon}
              />

            </View>
            <Text style={styles.inputText}>{selectedProvider ? selectedProvider : languages[selectedLanguage].selectProvider}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />
        

        <View style={styles.inputWrapper} >
          <TouchableOpacity style={styles.inputContainer} onPress={() => setModalDateVisible(true)}>
            <Image source={selectDate} style={styles.icon} />
            <Text style={styles.inputText}>{selectedDate ? selectedDate.toDateString() : languages[selectedLanguage].selectDate}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.divider} />
  
        {initialRecurringTransaction && ( 
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        )}

        {/* <View style={styles.divider} /> */}

        {/* provider Modal */}
        <Modal
          visible={modalProviderVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalProviderVisible(false)}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalProviderVisible(false)}
          >
           <BottomSheet
              ref={bottomSheetRef}
              index={2}
              snapPoints={snapPoints}
              enablePanDownToClose
              onClose={handleClose}
              onChange={handleSheetChanges}
              // backgroundComponent={RenderBackground}
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} onPress={() => {
                  textInputRef.current?.blur(); // Blur text input when tapping outside the bottom sheet
                }} />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <KeyboardAvoidingView style={styles.contentContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>Select a provider</Text>
                </View>
                <View style={styles.searchContainer}>
                  <Feather name="search" size={24} color="#999" style={styles.searchIcon} />
                  <TextInput
                    ref={textInputRef}
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setTextInputFocused(true)}
                    onBlur={() => setTextInputFocused(false)}
                  />
                </View>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {filteredProviders.map((provider: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.providerItem, styles.providerItemWithMargin]}
                      onPress={() => {
                        setSelectedProvider(provider.label);
                        setModalProviderVisible(false);
                      }}
                    >
                      <Image source={iconMapping[provider.label]} style={styles.providerIcon} />
                      <Text style={styles.providerText}>{provider.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </KeyboardAvoidingView>
            </BottomSheet>

          </Pressable>
        </Modal>

        {/* date Modal */}
        <Modal
          visible={modalDateVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalDateVisible(false)}
           >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalDateVisible(false)}
          >
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPointsDateModal}
              enablePanDownToClose
              onClose={() => {
                setModalDateVisible(false);
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop 
                  {...props}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                  opacity={0.5} // Adjust the opacity to your liking
                  onPress={() => {
                    textInputRef.current?.blur(); // Blur text input when tapping outside the bottom sheet
                  }}
                />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <View style={styles.inputWrapper}>
                {/* <Text >Select a provider</Text> */}

                  <Text style={styles.modalDateTitle}>{languages[selectedLanguage].selectDate}</Text>
                  {Platform.OS === 'ios' ? (
                    <>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => setSelectedDate(date || selectedDate)}
                        style={{ width: '100%' }}
                      />
                      <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity
                          style={styles.bottomButton}
                          onPress={() => {
                            setModalDateVisible(false);
                          }}
                        >
                          <Text style={styles.bottomButtonText}>Select</Text>
                        </TouchableOpacity>
                      </View>

                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
                      </TouchableOpacity>
                      {showDatePicker && Platform.OS === 'android' && (
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="default"
                          onChange={(event, date) => {
                            setShowDatePicker(false);
                            setSelectedDate(date || selectedDate);
                            setModalDateVisible(false);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>
              </View>
            </BottomSheet>

          </Pressable>
        </Modal>
  
        {/* Delete Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalText}>{languages[selectedLanguage].deleteModalText}</Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.deleteModalButton}>
                  <Text style={styles.deleteModalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteIconClick(initialRecurringTransaction.id!)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                  <Text style={styles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {openProvider === false && (
          <View style={styles.addButton}>
            <Button title={initialRecurringTransaction ? languages[selectedLanguage].updateSubscription : languages[selectedLanguage].create} onPress={addOrUpdateRecurringTransactionHandler} color="#FFFFFF"/>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
  },
  container: {
    // flex: 1,
    // justifyContent: 'space-between',
    // paddingBottom: 20, // Add padding at the bottom to separate button from content
  },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 40,
  //   textAlign: 'center',
  //   color: 'grey',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    flex: 1, // Allow text to take as much space as it can
    textAlign: 'center', // Center text in the available space
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 20, // Increase right padding to push the close icon further right
    paddingLeft: 10,
  },
  closeIcon: {
    // If additional positioning is needed
    marginRight: -40, // Optional: Adjust if you want to move the icon even closer to the edge
  },
  modalDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'grey',
  },
  inputWrapper: {
    marginBottom: 10, // Reduce margin for smaller gap
    marginTop: 10, // Reduce margin for smaller gap

  },
  contentContainer: {
    // flex: 1,
    // alignItems: 'center',
    paddingTop: 20, // Adjust as needed

  },
  iconContainer: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 14,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: -20,
  },
  addButton: {
    backgroundColor: '#35BA52',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 10
    // marginTop: 300
  },
  providerList: {
    flexGrow: 1,
  },
  // searchInput: {
  //   marginBottom: 16,
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 8,
  // },
  // providerItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 8,
  // },
  deleteModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  deleteModalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteModalButton: {
    marginLeft: 16,
    padding: 8,
  },
  deleteModalButtonYes: {
    backgroundColor: '#FF5733',
    borderRadius: 8,
  },
  deleteModalButtonText: {
    fontSize: 16,
    color: '#1A1A2C',
  },
  providerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  providerText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    // paddingTop: 20,
    fontSize: 32,
    color: '#333',
  },
  closeButton: {
    color: '#35BA52',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20, // Reduce padding for smaller gap
  },
  tabButton: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
    // paddingHorizontal: 16,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
    // fontFamily: 'Inter',
  },
  scrollViewContent: {
    paddingBottom: 100, // Adjust as needed
  },
  activeTabButton: {
    backgroundColor: '#1A1A2C',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Expanding the container's size slightly might help
    overflow: 'hidden', // Ensure that children do not overlap the rounded corners
    elevation: 5, // Add elevation for Android
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: -3, width: 0 },
  },
  deleteButton: {
    backgroundColor: '#FF5733', // Red color
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20

  },
  deleteButtonText: {
    color: '#FFFFFF', // White color
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 1, // Reduce margin for smaller gap
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  dateText: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  debug: {
    // marginTop: -240
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A2C',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#F0F0F0',
    width: '110%',
    marginLeft: -20,
    marginTop: 5,
    marginBottom: 5
    // marginVertical: 5, // Smaller vertical margin
    // marginHorizontal: 10, // Smaller horizontal margin
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  // bottomSheetBackground: {
  //   backgroundColor: 'white',
  //   flex: 1,
  // },
  modalTitleContainer: {
    alignItems: 'center', // Center the text horizontally
    marginTop: 10, // Add top margin
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, // Rounded corners
    backgroundColor: '#F6F6F6', // Background color
    paddingHorizontal: 15, // Horizontal padding
    marginBottom: 15, // Add bottom margin
    marginLeft: 20,
    marginRight: 20,
    marginTop: -20
  },
  searchIcon: {
    marginRight: 10, // Add right margin to the search icon
  },
  searchInput: {
    flex: 1, // Take remaining space
    fontSize: 16,
    color: '#333',
    paddingVertical: 10, // Vertical padding
  },
  
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20, // Increase vertical padding
  },
  providerItemWithMargin: {
    marginLeft: 30, // Add left margin
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: -50, // Position the button at 20 pixels from the bottom of the BottomSheet
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure button is above other content
  },
  bottomButton: {
    backgroundColor: '#35BA52',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // providerIcon: {
  //   width: 24,
  //   height: 24,
  //   marginRight: 8,
  // },
  // providerText: {
  //   fontSize: 16,
  //   color: '#333',
  // },
});

export default RecurringLoanInput;
