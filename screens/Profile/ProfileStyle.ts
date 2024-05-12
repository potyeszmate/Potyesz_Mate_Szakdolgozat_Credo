import { StyleSheet } from "react-native";

export const ProfileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f7',
      padding: 20,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      marginBottom: 16,
      alignItems: 'flex-start', 
    },
    cardContent: {
      width: '100%',
      alignItems: 'flex-start', 
    },
    profileCard: { 
      alignItems: 'center',
      marginLeft: 30
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    changePicture: {
      color: '#149E53',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      marginRight: 14
    },
    icon: {
      marginRight: 10,
      color: '#5c6bc0',
    },
    label: {
      fontWeight: 'bold',
      color: '#333',
      fontSize: 16,
      marginBottom: 5,
    },
    value: {
      fontSize: 14,
      color: '#555',
      marginBottom: 5,
    },
    editOption: {
      flexDirection: 'row',
      alignItems: 'center', 
      width: '100%',
      paddingVertical: 8, 
    },
    editButton: {
      backgroundColor: '#149E53',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      width: '100%', 
    },
    editIcon: {
      marginRight: 10,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    leftSection: {
      marginLeft: 100,
      marginRight: 40
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  
   bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    editButtonContainer: {
      padding: 16,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  });