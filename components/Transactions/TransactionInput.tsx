import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, Image, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';

const categories: any = [
  { label: 'Entertainment', value: 2 },
  { label: 'Grocieries', value: 3 },
  { label: 'UtilityCosts', value: 4 },
  { label: 'Shopping', value: 5 },
  { label: 'Food', value: 6 },
  { label: 'Housing', value: 7 },
  { label: 'Transport', value: 8 },
];

const selectCategoryIcon = require('../../assets/categoryIcon.png');
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

const iconMapping: any = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),
  Housing: require('../../assets/Housing.png'),
  Transport: require('../../assets/Transport.png'),
  Sport: require('../../assets/Sport.png'),
};

const TransactionInput: React.FC<any> = ({ onAddTransaction, onAddIncomes, initialTransaction, selectedLanguage, onClose, currency, conversionRate, onDeleteRecurringTransaction, onDeleteIncome}) => {
  const [transactionName, setTransactionName] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null as any);
  const [transactionValue, setTransactionValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);

  const [activeTab, setActiveTab] = useState('Expense');
  const bottomSheetRef = useRef<any>(null);
  const valueInputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [modalProviderVisible, setModalProviderVisible] = useState(false);
  const [modalDateVisible, setModalDateVisible] = useState(false);
  const [modalNotesVisible, setModalNotesVisible] = useState(false);
  const [modalNameVisible, setModalNameVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const filteredCategories = categories.filter((provider: any) =>
    provider.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const snapPoints = useMemo(() => {
    return textInputFocused ? ['50%', '60%', '80%'] : ['50%', '60%', '70%'];
  }, [textInputFocused]); 
  
  const snapPointsDateModal = useMemo(() => ['50%'], []);

  useEffect(() => {
    const isValidDate = initialTransaction && initialTransaction.date && !isNaN(initialTransaction.date.toDate());

    if (initialTransaction) {

      setTransactionName(initialTransaction.name || '');
      setSelectedCategory(initialTransaction.category ? initialTransaction.category : '');
      setTransactionNotes(initialTransaction.notes || '')


      const formattedValue =
      initialTransaction.value !== undefined &&
      initialTransaction.value !== null
        ? currency === 'HUF'
          ? Math.round(parseFloat(initialTransaction.value) * conversionRate).toString()
          : (parseFloat(initialTransaction.value) * conversionRate).toFixed(2).toString()
        : '';


      setTransactionValue(formattedValue);
      setSelectedDate(isValidDate ? new Date(initialTransaction.date.toDate()) : new Date());

    }
  }, [initialTransaction]);

  const addOrUpdateTransactionHandler = () => {
    console.log("activeTab: ", activeTab)
    console.log( "In addOrUpdateTransactionHandler")
    if(activeTab == "Expense") {

      console.log( "In EXPENSE")

    if (!transactionName || !selectedCategory || !transactionValue) {
      console.warn('Please fill in all fields');
      return;
    }

    const transactionData: any = {
      name: transactionName,
      category: selectedCategory,
      value: conversionRate !== null ? (1 / conversionRate) * parseFloat(transactionValue) : parseFloat(transactionValue),
      date: selectedDate,
      notes: transactionNotes   

    };

    if (initialTransaction) {
      transactionData.id = initialTransaction.id;
    }

    onAddTransaction(transactionData);
  } else { 
    console.log( "In ELSE")

    if (!transactionName || !transactionValue) {
      console.warn('Please fill in all fields');
      return;
    }

    const transactionData: any = {
      name: transactionName,
      category: "Income",
      value: conversionRate !== null ? (1 / conversionRate) * parseFloat(transactionValue) : parseFloat(transactionValue),
      date: selectedDate,
      notes: transactionNotes   

    };

    if (initialTransaction) {
      transactionData.id = initialTransaction.id;
    }

    onAddIncomes(transactionData);
  }
    setTransactionName('');
    setTransactionNotes('')
    setSelectedCategory(null);
    setTransactionValue('');
    setSelectedDate(new Date());
  };

  const handleSheetChanges = (index: any) => {
    if (index === -1) { 
      setModalProviderVisible(false);
      textInputRef.current?.blur(); 
    }
  };

  const handleDeleteIconClick = (recurringTransactionId: string) => {
    onDeleteRecurringTransaction && onDeleteRecurringTransaction(recurringTransactionId);
  };

  const handleClose = () => {
    setModalProviderVisible(false);
    textInputRef.current?.blur(); 
  };

  const today = new Date();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.modalContainer, styles.container]}>
        {openProvider === true && (
          <View style={styles.debug}>
          </View>
        )}
  
        <View style={styles.headerTitleContainer}>
          <Text style={styles.modalTitle}>
            {initialTransaction ? languages[selectedLanguage].editTransaction : languages[selectedLanguage].newTransaction}
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
            value={transactionValue}
            onChangeText={(text) => setTransactionValue(text)}
          />

          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1A1A2C', marginLeft: 10, marginBottom: 5 }}>{currency}</Text>

          </View>
        </View>
  
        <View style={[styles.headerContainer]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab !== 'Expense' && { backgroundColor: '#F6F6F6' }, activeTab === 'Expense' && styles.activeTabButton]}
            onPress={() => setActiveTab('Expense')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Expense' && styles.activeTabButtonText]}>{languages[selectedLanguage].Expense}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[styles.tabButton, activeTab !== 'Income' && { backgroundColor: '#F6F6F6' }, activeTab === 'Income' && styles.activeTabButton]}
            onPress={() => setActiveTab('Income')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Income' && styles.activeTabButtonText]}>{languages[selectedLanguage].Income}</Text>
          </TouchableOpacity>
  
        </View>
  
        {activeTab === 'Expense' && (
          <View style={styles.divider} />
        )}
        {activeTab === 'Expense' && (

          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setModalProviderVisible(true)}>
              <View style={styles.iconContainer}>
                {/* <Image source={selectProvider} style={styles.icon} /> */}
                <Image
                  source={selectedCategory !== null ? iconMapping[selectedCategory] : selectCategoryIcon}
                  style={styles.icon}
                /> 
              </View>
              <Text style={styles.inputText}>{selectedCategory ? selectedCategory : languages[selectedLanguage].selectCategory}</Text>
              <Image source={require('../../assets/angle-right.png')} />
            </TouchableOpacity>
          </View> 
        )}
        <View style={styles.divider} />

        <View style={styles.inputWrapper} >
          <TouchableOpacity style={styles.inputContainer} onPress={() => setModalNotesVisible(true)}>
            <Image source={require('../../assets/notes.png')} style={styles.icon} />
            <Text style={styles.inputText}>{transactionNotes ? transactionNotes : languages[selectedLanguage].addNotes}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.inputWrapper} >
          <TouchableOpacity style={styles.inputContainer} onPress={() => setModalNameVisible(true)}>
            <Image source={require('../../assets/nameIcon.png')} style={styles.icon} />
            <Text style={styles.inputText}>{transactionName ? transactionName : languages[selectedLanguage].addTransactionName}</Text>
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
  
        {initialTransaction && ( 
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        )}


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
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} onPress={() => {
                  textInputRef.current?.blur(); 
                }} />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <KeyboardAvoidingView style={styles.contentContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>Select a category</Text>
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
                  {filteredCategories.map((provider: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.providerItem, styles.providerItemWithMargin]}
                      onPress={() => {
                        setSelectedCategory(provider.label);
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
                  opacity={0.5} 
                  onPress={() => {
                    textInputRef.current?.blur(); 
                  }}
                />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.modalDateTitle}>{languages[selectedLanguage].selectDate}</Text>
                  {Platform.OS === 'ios' ? (
                    <>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => setSelectedDate(date || selectedDate)}
                        style={{ width: '100%' }}
                        maximumDate={today}
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
                          maximumDate={today}
                        />
                      )}
                    </>
                  )}
                </View>
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>
  
        <Modal
          visible={modalNotesVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalNotesVisible(false)}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalNotesVisible(false)}
          >
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={() => setModalNotesVisible(false)}
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} onPress={() => setModalNotesVisible(false)} />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.modalTitle}>Add a note</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Write your note here..."
                  multiline={true}
                  onChangeText={setTransactionNotes}
                  value={transactionNotes}
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity style={styles.button} onPress={() =>setModalNotesVisible(false)}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>

        <Modal
          visible={modalNameVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalNameVisible(false)}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalNameVisible(false)}
          >
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={() => setModalNameVisible(false)}
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} onPress={() => setModalNameVisible(false)} />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, styles.bottomSheetBackground]} />
              )}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.modalTitle}>Add transactions name</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Write transaction name here..."
                  multiline={true}
                  onChangeText={setTransactionName}
                  value={transactionName}
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity style={styles.button} onPress={() =>setModalNameVisible(false)}>
                  <Text style={styles.buttonText}>Save name</Text>
                </TouchableOpacity>
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
                <TouchableOpacity onPress={() => handleDeleteIconClick(initialTransaction.id!)} style={[styles.deleteModalButton, styles.deleteModalButtonYes]}>
                  <Text style={styles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {openProvider === false && (
          <View style={styles.addButton}>
            <Button title={initialTransaction ? languages[selectedLanguage].updateTransaction : languages[selectedLanguage].create} onPress={addOrUpdateTransactionHandler}/>
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
  
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    flex: 1, 
    textAlign: 'center', 
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 20, 
    paddingLeft: 10,
  },
  closeIcon: {
    marginRight: -40, 
  },
  modalDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'grey',
  },
  inputWrapper: {
    marginBottom: 10, 
    marginTop: 10, 

  },
  contentContainer: {
    paddingTop: 20, 
    marginLeft: 40,
    marginRight: 40
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
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: -40
  },
  providerList: {
    flexGrow: 1,
  },

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
    fontSize: 32,
    color: '#333',
  },
  closeButton: {
    color: '#35BA52',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20, 
  },
  tabButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
  },
  scrollViewContent: {
    paddingBottom: 100, 
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
    overflow: 'hidden', 
    elevation: 5, 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: -3, width: 0 },
  },
  deleteButton: {
    backgroundColor: '#FF5733', 
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20

  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 1, 
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
    
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalTitleContainer: {
    alignItems: 'center', 
    marginTop: 10, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, 
    backgroundColor: '#F6F6F6', 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    marginLeft: 20,
    marginRight: 20,
    marginTop: -20
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1, 
    fontSize: 16,
    color: '#333',
    paddingVertical: 10, 
  },
  
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  providerItemWithMargin: {
    marginLeft: 30, 
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: -50, 
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, 
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
  notesInput: {
    height: 100,
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#35BA52',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 60,
    marginRight: 60


  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default TransactionInput;
