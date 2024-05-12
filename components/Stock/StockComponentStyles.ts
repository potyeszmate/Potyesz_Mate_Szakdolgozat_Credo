import { StyleSheet } from "react-native";

export const StockChartStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },
    timeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 4,
      borderRadius: 20,
    },
    activeButton: {
      backgroundColor: '#35BA52',
    },
    inactiveButton: {
      backgroundColor: '#ddd',
    },
    timeButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '600',
    },
    timeframeButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    timeframeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 4,
      borderRadius: 20,
      backgroundColor: '#ddd', 
    },
    activeTimeframe: {
      backgroundColor: '#35BA52', 
    },
    timeframeButtonText: {
      color: '#000', 
    },
    activeText: {
      color: 'white', 
    },
  });

  export const StockDetailsStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    header: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 40, 
    },
    headerText: {
      alignItems: "center",
      marginTop: 10,
    },
    sellButton: {
      backgroundColor: '#FF4136',
      marginTop: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
    },
    symbol: {
      fontSize: 18,
      color: "#666",
    },
    details: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#666',
      marginBottom: 5,
    },
    value: {
      fontSize: 18,
    },
    descriptionContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
    },
    description: {
      backgroundColor: "#f2f2f2",
      borderRadius: 10,
      padding: 15,
      height: 80, 
      overflow: "hidden",
    },
    expandedDescription: {
      maxHeight: "auto",
    },
    readMoreButton: {
      alignItems: "center",
      marginTop: 10,
    },
    readMoreText: {
      color: "#007bff",
    },
    red: {
      color: "red",
    },
    green: {
      color: "green",
    },
    removeButton: {
      backgroundColor: '#FF4136',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    chartPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200, 
      borderRadius: 10,
      marginTop: 50,
      marginBottom: 40
    },
    chartPlaceholderText: {
      color: '#888',
      fontSize: 18,
    },
    detailsSection: {
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingVertical: 8, 
      paddingHorizontal: 16, 
      borderRadius: 20, 
      marginBottom: 10, 
      width: '100%', 
      alignSelf: 'center', 
      shadowOpacity: 0.1,
      elevation: 3,
    },
    buttonIcon: {
      marginRight: 10,
    },
    watchlistButton: {
      backgroundColor: '#35BA52',
    },
    portfolioButton: {
      backgroundColor: '#35BA52',
    },
    buttonText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
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
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%', 
      maxWidth: 350, 
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 15,
    },
    iconButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 25,
      marginVertical: 5,
      width: '90%', 
      alignSelf: 'center', 
      elevation: 3,
    },

    input: {
    },
    modalButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'center', 
      width: '100%', 
    },
    modalButton: {
      flex: 1, 
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginHorizontal: 5, 
      borderRadius: 25,
      backgroundColor: '#35BA52', 
    },
    modalCancelButton: {
      backgroundColor: '#ccc',
    },
    modalInput: {
      width: '100%', 
      borderWidth: 1,
      borderColor: '#ddd', 
      borderRadius: 10,
      padding: 15, 
      fontSize: 16, 
      color: '#000', 
      backgroundColor: '#fff', 
      marginBottom: 20, 
      paddingVertical: 15,

    },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', 
  },
    changeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
    positiveChange: {
      backgroundColor: '#21BA45',
    },
    negativeChange: {
      backgroundColor: '#FF4136',
    },
    changeText: {
      marginLeft: 5,
      color: 'white',
      fontSize: 16,
    },

    descriptionText: {
      fontSize: 16,
      color: '#666',
    },
   
  });
