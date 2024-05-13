import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { languages } from "../../commonConstants/sharedConstants";
import { PremiumPaymentStyles } from "./CommonComponentStyles";


const WelcomeCard = ({ email, firstName, lastName, selectedLanguage}) => {
  const navigation = useNavigation();

    const handlePress = () => {
      // @ts-ignore
      navigation.navigate('Payment', {
        email: email,
        firstName: firstName,
        lastName: lastName,
        selectedLanguage
      });
    };
  
    return (
    <View style={PremiumPaymentStyles.cardContainer}>
    <View style={PremiumPaymentStyles.gradientTop} />
    <View style={PremiumPaymentStyles.gradientBottom} />
    <Text style={PremiumPaymentStyles.advisorText}>{languages[selectedLanguage].advisorChatbot}</Text>
    <Text style={PremiumPaymentStyles.descriptionText}>
    {languages[selectedLanguage].chatbotDesc}
    </Text>
    <TouchableOpacity onPress={handlePress} style={PremiumPaymentStyles.credoButton}>
        <Text style={PremiumPaymentStyles.credoButtonText}>{languages[selectedLanguage].getCredo}</Text>
    </TouchableOpacity>
    <View style={PremiumPaymentStyles.semiCircle} />
    </View>

    );
  };
  
  export default WelcomeCard;
  