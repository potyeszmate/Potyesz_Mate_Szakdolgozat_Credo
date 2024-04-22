import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";


const WelcomeCard = ({ email, firstName, lastName}) => {
  const navigation = useNavigation();

    const handlePress = () => {
      // @ts-ignore
      navigation.navigate('Payment', {
        email: email,
        firstName: firstName,
        lastName: lastName
      });
    };
  
    return (
    <View style={styles.cardContainer}>
    <View style={styles.gradientTop} />
    <View style={styles.gradientBottom} />
    <Text style={styles.advisorText}>Advisor chatbot</Text>
    <Text style={styles.descriptionText}>
        Credo+ gives you tailored financial advices
    </Text>
    <TouchableOpacity onPress={handlePress} style={styles.credoButton}>
        <Text style={styles.credoButtonText}>Get Credo+</Text>
    </TouchableOpacity>
    <View style={styles.semiCircle} />
    </View>

    );
  };
  
  const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#26873B', // The darker color
        padding: 15,
        position: 'relative',
        marginTop: 20,
        marginBottom: 10 
      },
      gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#35BA52', // The lighter color
        // Blend the color by adjusting opacity
        opacity: 0.7,
      },
      gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#26873B', // The darker color
        // You don't necessarily need to set opacity here if it's the solid color
      },
    cardGradient: {
      padding: 15, // Adjust based on your spacing needs
      justifyContent: 'space-between', // Distributes children evenly
      alignItems: 'flex-start', // Align children to the start of the cross axis
    },
    advisorText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5, // Adjust the spacing based on your design
    },
    descriptionText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15, // Adjust the spacing based on your design
    },
    credoButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'flex-start', // Aligns the button to the start of the main axis
      borderRadius: 20,
    },
    credoButtonText: {
      color: '#1CB854', // The text color you specified
      fontSize: 18,
      fontWeight: 'bold',
    },
    semiCircle: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '30%', // Adjust size accordingly
      height: '50%', // Adjust size accordingly
      borderBottomLeftRadius: 200, // Use a large radius to create the semi-circle effect
      backgroundColor: '#72E985',
    },
  });  

  export default WelcomeCard;
  