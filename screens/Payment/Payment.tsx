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

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const route: any = useRoute();
  const navigation = useNavigation();

  const ngrokAPI = "https://0f2a-92-249-187-97.ngrok-free.app"
  // const languages = ['English', 'German', 'Hungarian'];

  const email = route.params?.email;
  const firstName = route.params?.firstName;
  const lastName = route.params?.firstName;
  // const onGoBack  = route.params;


  const authCtx = useContext(AuthContext) as any;
  const { userId } = authCtx as any;

  const updateUserRole = async () => {
    try {
        const settingsQuery = query(collection(db, 'users'), where('uid', '==', userId));
        const querySnapshot = await getDocs(settingsQuery);

        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await updateDoc(doc.ref, { isPremiumUser: true });
                console.log('user updated successfully.');
            }
        } else {
            console.error('No user document found.');
        }
    } catch (error) {
        console.error('Error updating user currency:', error);
    }
};

  const onCheckout = async () => {
    console.log(4)

    // 4. If payment ok -> create popup and say successful payment
    console.log("Succesful payment")
    // Alert.alert("Success", "Payment successful!");
    await updateUserRole();
    setSuccessModalVisible(true);

    setLoading(false);
  }
  
  const handleModalConfirm = () => {
    // route.params?.onGoBack?.();

    //set up asyn
    AsyncStorage.setItem('profileChanged', 'true');
    console.log("fetch profile in other pages if this triggers")
    setSuccessModalVisible(false);
    // @ts-ignore
    navigation.navigate('Home');
  };
  
  const initializePaymentSheet = async () => {
    setLoading(true);
    try {
      // Create a payment intent
      const response = await axios.post(ngrokAPI+'/payments/intents', {
        amount: 10 * 100, // Convert dollars to cents
        email: email,  // Assuming 'email' is defined somewhere in your component
        name: firstName + ' ' + lastName
      });
  
      if (response.error) {
        Alert.alert('Something went wrong in first step');
        return;
      }
  
      // Initialize the Payment sheet
      const initResponse = await initPaymentSheet({
        merchantDisplayName: 'credpo',
        paymentIntentClientSecret: response.data.paymentIntent,
      });
  
      if (initResponse.error) {
        Alert.alert('Something went wrong in phase two');
        return;
      }
  
      // Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();
  
      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }
  
      // Optionally trigger any follow-up action after successful payment
      onCheckout();
  
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert("Error", error.message || "An error occurred during payment processing.");
    } finally {
      setLoading(false); // Ensure loading is set to false after all operations
    }
  };
  


//   useEffect(() => {
//     initializePaymentSheet();
//   }, []);
return (
  <View style={styles.container}>
    <Text style={styles.headerTitle}>Unlock Premium Features</Text>

    <View style={styles.featuresContainer}>
      <FeatureCard
        iconName="robot"
        featureTitle="Advisor Chatbot"
        featureDescription="Get personalized financial advice from our chatbot."
      />
      <FeatureCard
        iconName="chart-line"
        featureTitle="Stock Market"
        featureDescription="Track and analyze your stock portfolio with up-to-date information."
      />
      <FeatureCard
        iconName="bitcoin"
        featureTitle="Cryptocurrency Tracker"
        featureDescription="Manage and track your cryptocurrency investments with real-time market data."
      />
      <FeatureCard
        iconName="dollar-sign"
        featureTitle="Currency Tracker"
        featureDescription="Access real-time currency exchange rates and store your favorites for quick access."
      />
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#1CB854" />
    ) : (
      <TouchableOpacity style={styles.subscribeButton} onPress={() => initializePaymentSheet()}>

        <Text style={styles.subscribeButtonText}>Subscribe for $9.99/month</Text>
      </TouchableOpacity>
    )}

    <SuccessModal visible={successModalVisible} onConfirm={handleModalConfirm} />


  </View>
);
};

const FeatureCard = ({ iconName, featureTitle, featureDescription }) => {
return (
  <View style={styles.featureCard}>
    <FontAwesome5 name={iconName} size={24} color="#1CB854" style={styles.cardIcon} />
    <View style={styles.cardTextContainer}>
      <Text style={styles.featureCardTitle}>{featureTitle}</Text>
      <Text style={styles.featureCardDescription}>{featureDescription}</Text>
    </View>
  </View>
);
};

const SuccessModal = ({ visible, onConfirm }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Payment successful!</Text>
          <Text style={styles.modalSubText}>You now have access to premium features.</Text>
          <TouchableOpacity style={styles.okButton} onPress={onConfirm}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#F7F7F7',
  alignItems: 'center',
  justifyContent: 'center',
},
headerTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#1A1A2C',
  marginBottom: 30,

},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
featuresContainer: {
  width: '90%',
},
featureCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  padding: 20,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
cardIcon: {
  marginRight: 20,
},
cardTextContainer: {
  flex: 1,
},
featureCardTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 5,
},
featureCardDescription: {
  fontSize: 14,
  color: '#666',
},
subscribeButton: {
  backgroundColor: '#1CB854',
  paddingVertical: 15,
  paddingHorizontal: 35,
  borderRadius: 30,
  shadowColor: '#1CB854',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
  marginTop: 20
},
subscribeButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalText: {
  marginBottom: 15,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 18
},
modalSubText: {
  marginBottom: 20,
  textAlign: 'center',
  fontSize: 15
},
okButton: {
  backgroundColor: '#1CB854',
  borderRadius: 20,
  padding: 10,
  elevation: 2
},
okButtonText: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center'
},
});

export default PaymentScreen;

