import { StyleSheet } from "react-native";

export const ProfileInputStyles = StyleSheet.create({
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
  dateText: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
    marginTop: -60
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
  },
  debug: {
    marginTop: -272.5
  },

});

export const ProfileCardStyles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 20,
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 20
    },
    profileSection: {
      marginRight: 20,
    },
    profilePic: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    detailsSection: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 2
    },
    rank: {
      fontSize: 16,
      color: 'grey',
      marginBottom: 2
    },
    progressBar: {
      height: 20,
      marginTop: 10,
      marginBottom: 10,
    },
    levelDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5
    },
    level: {
      fontWeight: 'bold',
    },
    pointsNeeded: {
      color: 'grey',
    },
  });