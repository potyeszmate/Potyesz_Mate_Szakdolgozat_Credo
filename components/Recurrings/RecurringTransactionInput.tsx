import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, Image, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { SubscriptionIconMapping, SubscriptionProviders } from './RecurringComponentConstants';
import { RecurringTransactionInputProps } from './RecurringComponentTypes';
import { languages } from '../../commonConstants/sharedConstants';
import { RecurringInputStyles } from './RecurringComponentStyles';


const RecurringTransactionInput: React.FC<RecurringTransactionInputProps> = ({ onAddRecurringTransaction, initialRecurringTransaction, conversionRate, currency, selectedLanguage, onDeleteRecurringTransaction, onClose}) => {
  const [recurringTransactionName, setRecurringTransactionName] = useState('');
  const [recurringTransactionValue, setRecurringTransactionValue] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null as any);
  const [activeTab, setActiveTab] = useState('Monthly');
  const bottomSheetRef = useRef<any>(null);
  const [openProvider, setOpenProvider] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalProviderVisible, setModalProviderVisible] = useState(false);
  const [modalDateVisible, setModalDateVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const valueInputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null); 

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['20%', '30%', '70%'] : ['20%', '30%', '40%'];
  }, [textInputFocused]); 
  
  const snapPointsDateModal = useMemo(() => ['50%'], []);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);  
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const selectProviderIcon = require('../../assets/Recurrings/provider.png');
  const selectDate = require('../../assets/Recurrings/date.png');
  const arrow = require('../../assets/angle-right.png');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = SubscriptionProviders.filter((provider: any) =>
    provider.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSheetChanges = (index: any) => {
    if (index === -1) { 
      setModalProviderVisible(false);
      textInputRef.current?.blur();
    }
  };

  const handleClose = () => {
    setModalProviderVisible(false);
    textInputRef.current?.blur(); 
  };

  const addOrUpdateRecurringTransactionHandler = () => {
    if (!recurringTransactionValue || selectedProvider === null || selectedProvider === 1 || !activeTab) {
      console.warn('Please fill in all fields');
      return;
    }
  
    const categoryToUse = activeTab;
  
    const recurringTransactionData: any = {
      name: selectedProvider || '',
      category: categoryToUse,
      value: conversionRate !== null ? (1 / conversionRate) * parseFloat(recurringTransactionValue) : parseFloat(recurringTransactionValue),
      Date: selectedDate,
      Usage_frequency: activeTab,
      Importance: '',  
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
    onDeleteRecurringTransaction && onDeleteRecurringTransaction(recurringTransactionId);
  };

  useEffect(() => {
    const isValidDate = initialRecurringTransaction && initialRecurringTransaction.Date && !isNaN(initialRecurringTransaction.Date.toDate());

    if (initialRecurringTransaction) {
      setRecurringTransactionName(initialRecurringTransaction.name || '');
      
      setSelectedProvider(initialRecurringTransaction.name); 

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

  useEffect(() => {
  }, [activeTab]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[RecurringInputStyles.modalContainer, RecurringInputStyles.container]}>
        {openProvider === true && (
          <View style={RecurringInputStyles.debug}>
          </View>
        )}
  
       <View style={RecurringInputStyles.headerTitleContainer}>
          <Text style={RecurringInputStyles.modalTitle}>
            {initialRecurringTransaction ? languages[selectedLanguage].editSubscription : languages[selectedLanguage].newSubscription}
          </Text>
          <TouchableOpacity onPress={onClose} style={RecurringInputStyles.closeIcon}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
  
        <View style={RecurringInputStyles.inputWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
          <TextInput
            ref={valueInputRef}
            placeholder={`0`}
            placeholderTextColor="#1A1A2C"
            style={[RecurringInputStyles.input, { fontWeight: 'bold', fontSize: 32, textAlign: 'center', color: 'black', borderBottomWidth: 0 }]}
            keyboardType="numeric"
            value={recurringTransactionValue}
            onChangeText={(text) => setRecurringTransactionValue(text)}
          />

          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1A1A2C', marginLeft: 10, marginBottom: 5 }}>{currency}</Text>

          </View>
        </View>
  
        <View style={[RecurringInputStyles.headerContainer]}>
          <TouchableOpacity
            style={[RecurringInputStyles.tabButton, activeTab !== 'Weekly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Weekly' && RecurringInputStyles.activeTabButton]}
            onPress={() => setActiveTab('Weekly')}
          >
            <Text style={[RecurringInputStyles.tabButtonText, activeTab === 'Weekly' && RecurringInputStyles.activeTabButtonText]}>{languages[selectedLanguage].Weekly}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[RecurringInputStyles.tabButton, activeTab !== 'Monthly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Monthly' && RecurringInputStyles.activeTabButton]}
            onPress={() => setActiveTab('Monthly')}
          >
            <Text style={[RecurringInputStyles.tabButtonText, activeTab === 'Monthly' && RecurringInputStyles.activeTabButtonText]}>{languages[selectedLanguage].Monthly}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[RecurringInputStyles.tabButton, activeTab !== 'Yearly' && { backgroundColor: '#F6F6F6' }, activeTab === 'Yearly' && RecurringInputStyles.activeTabButton]}
            onPress={() => setActiveTab('Yearly')}
          >
            <Text style={[RecurringInputStyles.tabButtonText, activeTab === 'Yearly' && RecurringInputStyles.activeTabButtonText, activeTab === 'Yearly' && { color: '#FFFFFF' }]}>{languages[selectedLanguage].Yearly}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={RecurringInputStyles.divider} />
  
        <View style={RecurringInputStyles.inputWrapper}>
          <TouchableOpacity style={RecurringInputStyles.inputContainer} onPress={() => setModalProviderVisible(true)}>
            <View style={RecurringInputStyles.iconContainer}>
              <Image
                source={selectedProvider !== null ? SubscriptionIconMapping[selectedProvider] : selectProviderIcon}
                style={RecurringInputStyles.icon}
              />

            </View>
            <Text style={RecurringInputStyles.inputText}>{selectedProvider ? selectedProvider : languages[selectedLanguage].selectProvider}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>
        
        <View style={RecurringInputStyles.divider} />
        

        <View style={RecurringInputStyles.inputWrapper} >
          <TouchableOpacity style={RecurringInputStyles.inputContainer} onPress={() => setModalDateVisible(true)}>
            <Image source={selectDate} style={RecurringInputStyles.icon} />
            <Text style={RecurringInputStyles.inputText}>{selectedDate ? selectedDate.toDateString() : languages[selectedLanguage].selectDate}</Text>
            <Image source={require('../../assets/angle-right.png')} />
          </TouchableOpacity>
        </View>
  
        <View style={RecurringInputStyles.divider} />
  
        {initialRecurringTransaction && ( 
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={RecurringInputStyles.deleteButton}>
          <Text style={RecurringInputStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        )}

        <Modal
          visible={modalProviderVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalProviderVisible(false)}
        >
          <Pressable
            style={RecurringInputStyles.modalBackground}
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
                <View style={[style, RecurringInputStyles.bottomSheetBackground]} />
              )}
            >
              <KeyboardAvoidingView style={RecurringInputStyles.contentContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={RecurringInputStyles.modalTitleContainer}>
                  <Text style={RecurringInputStyles.modalTitle}>Select a provider</Text>
                </View>
                <View style={RecurringInputStyles.searchContainer}>
                  <Feather name="search" size={24} color="#999" style={RecurringInputStyles.searchIcon} />
                  <TextInput
                    ref={textInputRef}
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={RecurringInputStyles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setTextInputFocused(true)}
                    onBlur={() => setTextInputFocused(false)}
                  />
                </View>
                <ScrollView contentContainerStyle={RecurringInputStyles.scrollViewContent}>
                  {filteredProviders.map((provider: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={[RecurringInputStyles.providerItem, RecurringInputStyles.providerItemWithMargin]}
                      onPress={() => {
                        setSelectedProvider(provider.label);
                        setModalProviderVisible(false);
                      }}
                    >
                      <Image source={SubscriptionIconMapping[provider.label]} style={RecurringInputStyles.providerIcon} />
                      <Text style={RecurringInputStyles.providerText}>{provider.label}</Text>
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
            style={RecurringInputStyles.modalBackground}
            onPress={() => setModalDateVisible(false)}
          >
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPointsDateModal}
              enablePanDownToClose
              onClose={() => setModalDateVisible(false)}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                  opacity={0.5} 
                  onPress={() => textInputRef.current?.blur()} 
                />
              )}
              backgroundComponent={({ style }) => (
                <View style={[style, RecurringInputStyles.bottomSheetBackground]} />
              )}
            >
              <View style={RecurringInputStyles.contentContainer}>
                <View style={RecurringInputStyles.inputWrapper}>
                  <Text style={RecurringInputStyles.modalDateTitle}>{languages[selectedLanguage].selectDate}</Text>
                  {Platform.OS === 'ios' ? (
                    <>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => setSelectedDate(date || selectedDate)}
                        style={{ width: '100%' }}
                        minimumDate={tomorrow}
                      />
                      <View style={RecurringInputStyles.bottomButtonContainer}>
                        <TouchableOpacity
                          style={RecurringInputStyles.bottomButton}
                          onPress={() => setModalDateVisible(false)}
                        >
                          <Text style={RecurringInputStyles.bottomButtonText}>Select</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={RecurringInputStyles.dateText}>{selectedDate.toDateString()}</Text>
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
                          minimumDate={tomorrow}
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
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={RecurringInputStyles.deleteModalContainer}>
            <View style={RecurringInputStyles.deleteModalContent}>
              <Text style={RecurringInputStyles.deleteModalText}>{languages[selectedLanguage].deleteModalText}</Text>
              <View style={RecurringInputStyles.deleteModalButtons}>
                <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={RecurringInputStyles.deleteModalButton}>
                  <Text style={RecurringInputStyles.deleteModalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteIconClick(initialRecurringTransaction.id!)} style={[RecurringInputStyles.deleteModalButton, RecurringInputStyles.deleteModalButtonYes]}>
                  <Text style={RecurringInputStyles.deleteModalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {openProvider === false && (
          <View style={RecurringInputStyles.addButton}>
            <Button title={initialRecurringTransaction ? languages[selectedLanguage].updateSubscription : languages[selectedLanguage].create} onPress={addOrUpdateRecurringTransactionHandler} color="#FFFFFF"/>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
  
};

export default RecurringTransactionInput;
