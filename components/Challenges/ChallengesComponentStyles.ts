import { StyleSheet } from "react-native";

export const ChallengesStyles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    scrollContentContainer: {
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 24,
      paddingTop: 30
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 38,
      borderRadius: 99,
      borderColor: '#149E53',
      borderWidth: 0.8,
      marginRight: 5
    },
    tabButtonText: {
      color: '#1A1A2C',
      fontSize: 14,
    },
    tabBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      paddingHorizontal: 30,
      paddingTop: 10,
      gap: 10
    },
    activeTabButton: {
      backgroundColor: '#35BA52',
    },
    activeTabButtonText: {
      color: '#FFFFFF',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 18,
      marginTop: 18,
    },
    text: {
      marginBottom: 8,
    },
    listContainer: {
      width: '100%',
    },
    challengesContainer: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    challengeItemContainer: {
      marginBottom: 12, 
    },
    challengeItemSpacing: {
      marginBottom: 0,
    },
});

export const ChallengesitemStyles = StyleSheet.create({
    card: {
      height: 220,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      overflow: 'hidden',
      backgroundColor: '#fff',
      marginBottom: 12,
      width: 340,
    
    },
    badgeContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, 
    },
    imageContainer: {
      height: '40%',
      backgroundColor: 'gray', 
      zIndex: 0, 
      width: '100%',  
      alignItems: 'center', 
      justifyContent: 'center', 
    },
    badgeText: {
      fontSize: 16,
      color: 'white',
    },
    image: {
      flex: 1,
      height: '100%',
      resizeMode: 'cover',
      width: '110%',  
    },
    detailsContainer: {
      flex: 1,
      padding: 10,
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    detailCard: {
      width: 70, 
      marginRight: 5,
      backgroundColor: '#F5F7F9',
      height: 27,
      justifyContent: 'center',
      alignItems: 'center',
    },
    detailText: {
      fontSize: 14,
      color: '#1A1A2C',
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center', 
    },
    leftDescription: {
      flex: 3,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1A1A2C',
      marginBottom: 5,
    },
    desc: {
      fontSize: 14,
      color: '#7E8086',
      marginBottom: 5, 
    },
    joinButton: {
      width: '25%', 
      height: 33,
      backgroundColor: '#35BA52',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginLeft: 10, 
      flexDirection: 'row',
    },
    activeJoinButton: {
      backgroundColor: '#FFFFFF',
      borderColor: '#35BA52',
      borderWidth: 1,
    },
    completedButton: {
      width: '25%', 
      height: 33, 
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginLeft: 10, 
      flexDirection: 'row',
      borderColor: '#CCCCCC',
      borderWidth: 1,
    },
    completedButtonText: {
      fontSize: 14,
      color: '#CCCCCC', 
    },
    checkmarkIcon: {
      marginRight: 5,
    },
    joinButtonText: {
      fontSize: 14,
      color: '#FFFFFF',
    },
    activeJoinButtonText: {
      color: '#35BA52',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      backgroundColor: '#35BA52',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    yesButton: {
      backgroundColor: '#35BA52',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    yesButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: '#FF5733',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    
    
});

export const JoinedChallengesStyles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      elevation: 2,
 
      width: '90%',
      alignSelf: 'center',
      marginTop: 20,
      
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 

    },
    firstRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    challangesText: {
      fontSize: 18,
      color: '#1A1A2C',
    },

    secondRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    leftPart: {
      flex: 2,
    },
    rightPart: {
      flex: 1,
    },
    challangeName: {
      fontSize: 15,
      color: '#1A1A2C',
      paddingBottom: 5
    },
    challangeDesc: {
      fontSize: 14,
      color: '#7E8086',
      paddingRight: 35
    },
    joinedButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      borderWidth: 1, 
      borderColor: '#149E53', 
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      marginTop: 12,
      marginLeft: 20
    },

    joinedText: {
      color: '#149E53',
    },
  });
  