import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    scrollContentContainer: {
      flexGrow: 1,
      alignItems: 'center',
      paddingBottom: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 35,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 38,
      borderRadius: 99,
      borderColor: '#149E53',
      borderWidth: 0.6
    },
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
  
    },
    tabBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      paddingHorizontal: 24,
      paddingTop: 10,
      gap: 5
    },
  
    tabButtonText: {
      color: '#1A1A2C',
      fontSize: 14,
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
  
    bottomSheetBackground: {
      backgroundColor: 'white',
      flex: 1,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  });