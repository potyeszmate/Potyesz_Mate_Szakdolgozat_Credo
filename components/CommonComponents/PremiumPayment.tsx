import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { languages } from "../../commonConstants/sharedConstants";


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
    <View style={styles.cardContainer}>
    <View style={styles.gradientTop} />
    <View style={styles.gradientBottom} />
    <Text style={styles.advisorText}>{languages[selectedLanguage].advisorChatbot}</Text>
    <Text style={styles.descriptionText}>
    {languages[selectedLanguage].chatbotDesc}
    </Text>
    <TouchableOpacity onPress={handlePress} style={styles.credoButton}>
        <Text style={styles.credoButtonText}>{languages[selectedLanguage].getCredo}</Text>
    </TouchableOpacity>
    <View style={styles.semiCircle} />
    </View>

    );
  };
  
  const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#26873B', 
        padding: 15,
        position: 'relative',
        marginTop: 20,
        marginBottom: 10, 
        marginLeft: 15,
        marginRight: 15
      },
      gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#35BA52', 
        opacity: 0.7,
      },
      gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#26873B', 
      },
    cardGradient: {
      padding: 15, 
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
    },
    advisorText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5, 
    },
    descriptionText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15, 
    },
    credoButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'flex-start', 
      borderRadius: 20,
    },
    credoButtonText: {
      color: '#1CB854', 
      fontSize: 18,
      fontWeight: 'bold',
    },
    semiCircle: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '30%', 
      height: '50%', 
      borderBottomLeftRadius: 200, 
      backgroundColor: '#72E985',
    },
  });  

  export default WelcomeCard;
  