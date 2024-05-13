import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, Image, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { transactionInputCategories, transactionInputIconMapping } from './TransactionComponentConstants';
import { languages } from '../../commonConstants/sharedConstants';
import { TransactionInputStyles } from './TransactionComponentStyles';

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
  const filteredCategories = transactionInputCategories.filter((provider: any) =>
    provider.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const today = new Date();
  const selectCategoryIcon = require('../../assets/categoryIcon.png');
  const selectDate = require('../../assets/Recurrings/date.png');
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
    if(activeTab == "Expense") {

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[TransactionInputStyles.modalContainer, TransactionInputStyles.container]}>
        {openProvider === true && (
          <View style={TransactionInputStyles.debug}>
          </View>
        )}
  
        <View style={TransactionInputStyles.headerTitleContainer}>
          <Text style={TransactionInputStyles.modalTitle}>
            {initialTransaction ? languages[selectedLanguage].editTransaction : languages[selectedLanguage].newTransaction}
          </Text>
          <TouchableOpacity onPress={onClose} style={TransactionInputStyles.closeIcon}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
  
        <View style={TransactionInputStyles.inputWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
          <TextInput
            ref={valueInputRef}
            placeholder={`0`}
            placeholderTextColor="#1A1A2C"
            style={[TransactionInputStyles.input, { fontWeight: 'bold', fontSize: 32, textAlign: 'center', color: 'black', borderBottomWidth: 0 ,  padding: 0, margin: 0}]}
            keyboardType="numeric"
            value={transactionValue}
            onChangeText={(text) => setTransactionValue(text)}
          />

          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1A1A2C', marginLeft: 10, marginBottom: 2, alignSelf: 'center' }}>{currency}</Text>

          </View>
        </View>
  
        <View style={[TransactionInputStyles.headerContainer]}>
          <TouchableOpacity
            style={[TransactionInputStyles.tabButton, activeTab !== 'Expense' && { backgroundColor: '#F6F6F6' }, activeTab === 'Expense' && TransactionInputStyles.activeTabButton]}
            onPress={() => setActiveTab('Expense')}
          >
            <Text style={[TransactionInputStyles.tabButtonText, activeTab === 'Expense' && TransactionInputStyles.activeTabButtonText]}>{languages[selectedLanguage].Expense}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[TransactionInputStyles.tabButton, activeTab !== 'Income' && { backgroundColor: '#F6F6F6' }, activeTab === 'Income' && TransactionInputStyles.activeTabButton]}
            onPress={() => setActiveTab('Income')}
          >
            <Text style={[TransactionInputStyles.tabButtonText, activeTab === 'Income' && TransactionInputStyles.activeTabButtonText]}>{languages[selectedLanguage].Income}</Text>
          </TouchableOpacity>
  
        </View>
  
        {activeTab === 'Expense' && (
          <View style={TransactionInputStyles.divider} />
        )}
        {activeTab === 'Expense' && (

          <View style={TransactionInputStyles.inputWrapper}>
            <TouchableOpacity style={TransactionInputStyles.inputContainer} onPress={() => setModalProviderVisible(true)}>
              <View style={TransactionInputStyles.iconContainer}>
                <Image
                  source={selectedCategory !== null ? transactionInputIconMapping[selectedCategory] : selectCategoryIcon}
                  style={TransactionInputStyles.icon}
                /> 
              </View>
              <Text style={TransactionInputStyles.inputText}>{selectedCategory ? selectedCategory : languages[selectedLanguage].selectCategory}</Text>
              <Image source={require('../../assets/angle-right.png')} />
            </TouchableOpacity>
          </View> 
        )}
        <View style={TransactionInputStyles.divider} />

        <View style={TransactionInputStyles.inputWrapper} >
          <TouchableOpacity style={TransactionInputStyles.inputContainer} onPress={() => setModalNotesVisible(true)}>
            <Image source={require('../../assets/notes.png')} style={TransactionInputStyles.icon} />
            <Text style={TransactionInputStyles.inputText}>{transactionNotes ? transactionNotes : languages[selectedLanguage].addNotes}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>

        <View style={TransactionInputStyles.divider} />

        <View style={TransactionInputStyles.inputWrapper} >
          <TouchableOpacity style={TransactionInputStyles.inputContainer} onPress={() => setModalNameVisible(true)}>
            <Image source={require('../../assets/nameIcon.png')} style={TransactionInputStyles.icon} />
            <Text style={TransactionInputStyles.inputText}>{transactionName ? transactionName : languages[selectedLanguage].addTransactionName}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>

        <View style={TransactionInputStyles.divider} />


        <View style={TransactionInputStyles.inputWrapper} >
          <TouchableOpacity style={TransactionInputStyles.inputContainer} onPress={() => setModalDateVisible(true)}>
            <Image source={selectDate} style={TransactionInputStyles.icon} />
            <Text style={TransactionInputStyles.inputText}>{selectedDate ? selectedDate.toDateString() : languages[selectedLanguage].selectDate}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>
  
        <View style={TransactionInputStyles.divider} />
  
        {initialTransaction && ( 
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={TransactionInputStyles.deleteButton}>
          <Text style={TransactionInputStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        )}


        <Modal
          visible={modalProviderVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalProviderVisible(false)}
        >
          <Pressable
            style={TransactionInputStyles.modalBackground}
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
                <View style={[style, TransactionInputStyles.bottomSheetBackground]} />
              )}
            >
              <KeyboardAvoidingView style={TransactionInputStyles.contentContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={TransactionInputStyles.modalTitleContainer}>
                  <Text style={TransactionInputStyles.modalTitle}>Select a category</Text>
                </View>
                <View style={TransactionInputStyles.searchContainer}>
                  <Feather name="search" size={24} color="#999" style={TransactionInputStyles.searchIcon} />
                  <TextInput
                    ref={textInputRef}
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={TransactionInputStyles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setTextInputFocused(true)}
                    onBlur={() => setTextInputFocused(false)}
                  />
                </View>
                <ScrollView contentContainerStyle={TransactionInputStyles.scrollViewContent}>
                  {filteredCategories.map((provider: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={[TransactionInputStyles.providerItem, TransactionInputStyles.providerItemWithMargin]}
                      onPress={() => {
                        setSelectedCategory(provider.label);
                        setModalProviderVisible(false);
                      }}
                    >
                      <Image source={transactionInputIconMapping[provider.label]} style={TransactionInputStyles.providerIcon} />
                      <Text style={TransactionInputStyles.providerText}>{provider.label}</Text>
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
            style={TransactionInputStyles.modalBackground}
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
                <View style={[style, TransactionInputStyles.bottomSheetBackground]} />
              )}
            >
              <View style={TransactionInputStyles.contentContainer}>
                <View style={TransactionInputStyles.inputWrapper}>
                  <Text style={TransactionInputStyles.modalDateTitle}>{languages[selectedLanguage].selectDate}</Text>
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
                      <View style={TransactionInputStyles.bottomButtonContainer}>
                        <TouchableOpacity
                          style={TransactionInputStyles.bottomButton}
                          onPress={() => {
                            setModalDateVisible(false);
                          }}
                        >
                          <Text style={TransactionInputStyles.bottomButtonText}>Select</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={TransactionInputStyles.dateText}>{selectedDate.toDateString()}</Text>
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
            style={TransactionInputStyles.modalBackground}
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
                <View style={[style, TransactionInputStyles.bottomSheetBackground]} />
              )}
            >
              <View style={TransactionInputStyles.contentContainer}>
                <Text style={TransactionInputStyles.modalTitle}>Add a note</Text>
                <TextInput
                  style={TransactionInputStyles.notesInput}
                  placeholder="Write your note here..."
                  multiline={true}
                  onChangeText={setTransactionNotes}
                  value={transactionNotes}
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity style={TransactionInputStyles.button} onPress={() =>setModalNotesVisible(false)}>
                  <Text style={TransactionInputStyles.buttonText}>Save</Text>
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
            style={TransactionInputStyles.modalBackground}
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
                <View style={[style, TransactionInputStyles.bottomSheetBackground]} />
              )}
            >
              <View style={TransactionInputStyles.contentContainer}>
                <Text style={TransactionInputStyles.modalTitle}>Add transactions name</Text>
                <TextInput
                  style={TransactionInputStyles.notesInput}
                  placeholder="Write transaction name here..."
                  multiline={true}
                  onChangeText={setTransactionName}
                  value={transactionName}
                  onFocus={() => setTextInputFocused(true)}
                  onBlur={() => setTextInputFocused(false)}
                />
                <TouchableOpacity style={TransactionInputStyles.button} onPress={() =>setModalNameVisible(false)}>
                  <Text style={TransactionInputStyles.buttonText}>Save name</Text>
                </TouchableOpacity>
              </View>
            </BottomSheet>
          </Pressable>
        </Modal>
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={TransactionInputStyles.deleteModalContainer}>
            <View style={TransactionInputStyles.deleteModalContent}>
              <Text style={TransactionInputStyles.deleteModalText}>{languages[selectedLanguage].deleteModalText}</Text>
              <View style={TransactionInputStyles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={TransactionInputStyles.deleteModalButton}>
                  <Text style={TransactionInputStyles.deleteModalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteIconClick(initialTransaction.id!)} style={[TransactionInputStyles.deleteModalButton, TransactionInputStyles.deleteModalButtonYes]}>
                  <Text style={TransactionInputStyles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {openProvider === false && (
          <View style={TransactionInputStyles.addButton}>
          <TouchableOpacity 
            style={TransactionInputStyles.addButton} 
            onPress={addOrUpdateTransactionHandler}
            activeOpacity={0.7} 
          >
            <Text style={{ color: 'white', fontSize: 16 }}> 
              {initialTransaction ? languages[selectedLanguage].updateTransaction : languages[selectedLanguage].create}
            </Text>
          </TouchableOpacity>
        </View>
        
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TransactionInput;
