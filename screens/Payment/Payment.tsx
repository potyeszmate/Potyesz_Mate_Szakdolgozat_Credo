import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Alert, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, Modal } from 'react-native';
import axios from 'axios';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentStyles } from './PaymentStyles';
import { languages } from '../../commonConstants/sharedConstants';

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const route: any = useRoute();
  const navigation = useNavigation();

  const ngrokApiAddress = "https://0f2a-92-249-187-97.ngrok-free.app"

  const email = route.params?.email;
  const firstName = route.params?.firstName;
  const lastName = route.params?.firstName;
  const selectedLanguage = route.params?.selectedLanguage;

  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const updateUserRole = async () => {
    try {
        const settingsQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const querySnapshot = await getDocs(settingsQuery);

        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await updateDoc(doc.ref, { isPremiumUser: true });
            }
        } else {
            console.error('No user document found.');
        }
    } catch (error) {
        console.error('Error updating user currency:', error);
    }
};

  const onCheckout = async () => {
    await updateUserRole();
    setSuccessModalVisible(true);

    setLoading(false);
  }
  
  const handleModalConfirm = () => {
    AsyncStorage.setItem('profileChanged', 'true');
    setSuccessModalVisible(false);
    // @ts-ignore
    navigation.navigate('Home');
  };
  
  const initializePaymentSheet = async () => {
    setLoading(true);
    try {
      const response = await axios.post(ngrokApiAddress+'/payments/intents', {
        amount: 10 * 100, 
        email: email,
        name: firstName + ' ' + lastName
      });
  
      if (response.error) {
        Alert.alert(`${languages[selectedLanguage].firstStepError}`);
        return;
      }
  
      const initResponse = await initPaymentSheet({
        merchantDisplayName: 'Credo', 
        paymentIntentClientSecret: response.data.paymentIntent,
      });
  
      if (initResponse.error) {
        Alert.alert('Something went wrong in phase two');
        return;
      }
  
      const paymentResponse = await presentPaymentSheet();
  
      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }
  
      onCheckout();
  
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert("Error", error.message || "An error occurred during payment processing.");
    } finally {
      setLoading(false);
    }
  };
  

return (
  <View style={PaymentStyles.container}>
    <Text style={PaymentStyles.headerTitle}>{languages[selectedLanguage].unlockPremium}</Text>

    <View style={PaymentStyles.featuresContainer}>
      <FeatureCard
        iconName="robot"
        featureTitle={languages[selectedLanguage].advisorChatbot}
        featureDescription={languages[selectedLanguage].chatbotDescPayment}
      />
      <FeatureCard
        iconName="chart-line"
        featureTitle={languages[selectedLanguage].stockMarket}
        featureDescription={languages[selectedLanguage].stockMarketDesc}
      />
      <FeatureCard
        iconName="bitcoin"
        featureTitle={languages[selectedLanguage].cryptoMarket}
        featureDescription={languages[selectedLanguage].cryptoMarketDesc}
      />
      <FeatureCard
        iconName="dollar-sign"
        featureTitle={languages[selectedLanguage].currencyTracker}
        featureDescription={languages[selectedLanguage].currencyTrackerDesc}
      />
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#1CB854" />
    ) : (
      <TouchableOpacity style={PaymentStyles.subscribeButton} onPress={() => initializePaymentSheet()}>

        <Text style={PaymentStyles.subscribeButtonText}>{languages[selectedLanguage].subscribe}</Text>
      </TouchableOpacity>
    )}

    <SuccessModal visible={successModalVisible} onConfirm={handleModalConfirm} selectedLanguage={selectedLanguage} />


  </View>
);
};

const FeatureCard = ({ iconName, featureTitle, featureDescription }) => {

return (
  <View style={PaymentStyles.featureCard}>
    <FontAwesome5 name={iconName} size={24} color="#1CB854" style={PaymentStyles.cardIcon} />
    <View style={PaymentStyles.cardTextContainer}>
      <Text style={PaymentStyles.featureCardTitle}>{featureTitle}</Text>
      <Text style={PaymentStyles.featureCardDescription}>{featureDescription}</Text>
    </View>
  </View>
);
};

const SuccessModal = ({ visible, onConfirm, selectedLanguage }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={PaymentStyles.centeredView}>
        <View style={PaymentStyles.modalView}>
          <Text style={PaymentStyles.modalText}>{languages[selectedLanguage].paymentSuccesful}</Text>
          <Text style={PaymentStyles.modalSubText}>{languages[selectedLanguage].accesToPremium}</Text>
          <TouchableOpacity style={PaymentStyles.okButton} onPress={onConfirm}>
            <Text style={PaymentStyles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentScreen;

