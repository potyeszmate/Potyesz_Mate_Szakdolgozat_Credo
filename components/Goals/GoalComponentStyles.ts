import { StyleSheet } from "react-native";

export const GoalCardStyles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      padding: 12,
    },
    completionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    completionText: {
      marginLeft: 10,
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    rightPart: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBarWrapper: {
      borderRadius: 20, 
      overflow: 'hidden', 
    },
    cardContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    monthlySpentRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 6
    },
    goalName: {
      fontSize: 16,
      color: '#1A1A2C',
    },
    goalDate: {
      fontSize: 16,
      color: '#7E8086',
    },
    progressBarContainer: {
      marginBottom: 8,
      marginLeft: -1,
  
    },
    remainingAmount: {
      fontSize: 16,
    },
    amountText: {
      fontSize: 16,
      color: '#1A1A2C'
    },
    amountTextCurrent: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1A1A2C',
    },
    amountTextTotal: {
      fontSize: 16,
      color: '#1A1A2C'
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 16,
    },
});
  
export const GoalDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completedContainer: {
    padding: 15,
    marginTop: 10,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
  },
});

export const GoalInputStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      elevation: 5,
      width: '80%',
      alignSelf: 'center',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
      marginTop: -50
    },
    inputWrapper: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#333',
    },
    input: {
      borderBottomWidth: 1,
      padding: 10,
      fontSize: 16,
      color: '#333',
    },
});

export const GoalItemStyles = StyleSheet.create({
    budgetContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      marginVertical: 20,
      padding: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    chart: {
      height: 20,
      backgroundColor: 'blue',
      borderRadius: 5,
    },
    amount: {
      fontSize: 16,
    },
});

export const GoalListStyles = StyleSheet.create({
    listContainer: {
      marginVertical: 20,
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxHeight: 250, 
    },
    listContentContainer: {
      alignItems: 'center',
      
    },
});