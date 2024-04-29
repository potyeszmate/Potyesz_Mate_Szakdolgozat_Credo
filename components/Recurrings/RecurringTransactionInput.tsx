import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, Image, Modal, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface RecurringTransactionInputProps {
  onAddRecurringTransaction: (newRecurringTransaction: any) => void;
  initialRecurringTransaction?: any;
  currency: string,
  conversionRate: number; 
  selectedLanguage: string;
  onDeleteRecurringTransaction?: (newRecurringTransaction: any) => void;
  onClose: () => void 

}

const iconMapping: { [key: string]: any } = {
  Twitter: require('../../assets/Recurrings/twitter.png'),
  Youtube: require('../../assets/Recurrings/FrameYoutube.png'),
  Instagram: require('../../assets/Recurrings/FrameInstagram.png'),
  LinkedIn: require('../../assets/Recurrings/linkedin.png'),
  Wordpress: require('../../assets/Recurrings/wordpress.png'),
  Pinterest: require('../../assets/Recurrings/pinterest.png'),
  Figma: require('../../assets/Recurrings/figma.png'),
  Behance: require('../../assets/Recurrings/behance.png'),
  Apple: require('../../assets/Recurrings/FrameApple.png'),
  GooglePlay: require('../../assets/Recurrings/google-play.png'),
  Google: require('../../assets/Recurrings/google.png'),
  AppStore: require('../../assets/Recurrings/app-store.png'),
  Github: require('../../assets/Recurrings/github.png'),
  Xbox: require('../../assets/Recurrings/xbox.png'),
  Discord: require('../../assets/Recurrings/discord.png'),
  Stripe: require('../../assets/Recurrings/stripe.png'),
  Spotify: require('../../assets/Recurrings/spotify.png'),
};

const providers: any = [
  { label: 'Twitter', value: 2 },
  { label: 'Instagram', value: 3 },
  { label: 'Youtube', value: 4 },
  { label: 'Spotify', value: 5 },
  { label: 'Wordpress', value: 6 },
  { label: 'Pinterest', value: 7 },
  { label: 'Figma', value: 8 },
  { label: 'Behance', value: 9 },
  { label: 'Apple', value: 10 },
  { label: 'Google', value: 11 },
  { label: 'Github', value: 12 },
  { label: 'Discord', value: 13 },
  { label: 'Xbox', value: 14 },
  { label: 'Stripe', value: 15 },
];

const selectProviderIcon = require('../../assets/Recurrings/provider.png');
const selectDate = require('../../assets/Recurrings/date.png');
const arrow = require('../../assets/angle-right.png');


import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

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
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const valueInputRef = useRef<TextInput>(null);
  const textInputRef = useRef<TextInput>(null); 

  const snapPoints = useMemo(() => {
    return textInputFocused ? ['20%', '30%', '70%'] : ['20%', '30%', '40%'];
  }, [textInputFocused]); 
  
  const snapPointsDateModal = useMemo(() => ['50%'], []);

  
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

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = providers.filter((provider: any) =>
    provider.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  }, [activeTab]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  
  const [selectedDate, setSelectedDate] = useState(tomorrow);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.modalContainer, styles.container]}>
        {openProvider === true && (
          <View style={styles.debug}>
          </View>
        )}
  
       <View style={styles.headerTitleContainer}>
          <Text style={styles.modalTitle}>
            {initialRecurringTransaction ? languages[selectedLanguage].editSubscription : languages[selectedLanguage].newSubscription}
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
                        minimumDate={tomorrow}
                      />
                      <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity
                          style={styles.bottomButton}
                          onPress={() => setModalDateVisible(false)}
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
    width: '30%',
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

});


export default RecurringTransactionInput;
