import { StyleSheet } from "react-native";

export const AchivementListStyles = StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      paddingTop: 10,
      backgroundColor: '#FFFFFF',
      marginBottom: 15,
      borderRadius: 10,
      margin: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      elevation: 3,
    },
    challengesContainer: {
      maxHeight: 500,
    },
    header: {
      fontSize: 18,
      color: '#808080',
      marginBottom: 10,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 10,
    },
    challengeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: 'transparent', 
    },
    challengeIcon: {
      width: 55,
      height: 55,
      marginRight: 15,
      backgroundColor: '#e0e0e0',
      borderRadius: 30, 
      padding: 5,
    },
    challengeInfo: {
      flex: 1,
    },
    challengeName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    challengeDetail: {
      fontSize: 14,
      color: '#666',
    }
  });

  export const BadgeListStyles = StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      paddingTop: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      elevation: 3,
      marginHorizontal: 15,
    },
    scrollView: {
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    header: {
      fontSize: 18,
      color: '#808080',
      marginBottom: 10,
    },
    badgeCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      marginHorizontal: 8,
      borderRadius: 20,
      borderWidth: 2,
      width: 120,
      marginBottom: 20,
      marginTop: 10
    },
    badgeIcon: {
      width: 50,
      height: 50,
    },
    badgeName: {
      fontSize: 16,
      color: '#000000', 
      marginBottom: 5,
    },
    badgeCount: {
      fontSize: 14,
      color: '#ffffff',
    }
  });
  
  export const YourPointsStyles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      marginTop: 16,
      width: '90%',
      alignSelf: 'center',
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      borderColor: '#E0E0E0', 
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    yourPointsText: {
      fontSize: 17,
      color: '#1A1A2C',
    },
    pointsContainer: {
      marginLeft: 17,
      alignItems: 'center',
  
    },
    pointsText: {
      fontSize: 20,
      marginVertical: 2,
      marginLeft: -10
    },
    rightContainer: {},
  });
  