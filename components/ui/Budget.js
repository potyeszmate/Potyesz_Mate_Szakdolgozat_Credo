/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const iconMapping = {
  Entertainment: require('../../assets/Entertainment.png'),
  Grocieries: require('../../assets/Grocieries.png'),
  UtilityCosts: require('../../assets/UtilityCosts.png'),
  Shopping: require('../../assets/Shopping.png'),
  Food: require('../../assets/Food.png'),
  Housing: require('../../assets/Housing.png'),
  Transport: require('../../assets/Transport.png'),
  Sport: require('../../assets/Sport.png'),
};

const Budget = ({ budget, transactions, onDelete, onEdit }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
  <Image style={styles.iconImage} source={iconMapping[budget.Category]} />
  <View>
    <Text style={styles.categoryText}>{budget.Category}</Text>
    <Text style={styles.amountText}>
      <Text style={styles.amountValueText}>
        ${transactions
          .filter((transaction) => transaction.category === budget.Category)
          .reduce((acc, transaction) => acc + transaction.value, 0)}
      </Text>{' '}
      <Text style={styles.amountOutOfText}>out of </Text>
      <Text style={styles.Total_ammountText}>${budget.Total_ammount}</Text>
    </Text>
  </View>
  {/* Move the right section inside the left section */}
  <View style={styles.rightSection}>
    <Text style={styles.leftText}>
      <Text style={styles.leftValueText}>
        ${budget.Total_ammount -
          transactions
            .filter((transaction) => transaction.category === budget.Category)
            .reduce((acc, transaction) => acc + transaction.value, 0)}
      </Text>{' '}
      <Text style={styles.leftOutOfText}>left</Text>
    </Text>
  </View>
</View>

      {/* <View style={styles.rightSection}>
        <Text style={styles.leftText}>
          <Text style={styles.leftValueText}>
            ${budget.Total_ammount -
              transactions
                .filter((transaction) => transaction.category === budget.Category)
                .reduce((acc, transaction) => acc + transaction.value, 0)}
          </Text>{' '}
          <Text style={styles.leftOutOfText}>left</Text>
        </Text>
      </View> */}
      {/* Delete and Edit buttons in a new row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => onDelete(budget)} style={styles.deleteIconContainer}>
          <Feather name="trash-2" size={20} color="#FF5733" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(budget)} style={styles.editIconContainer}>
          <AntDesign name="edit" size={20} color="#1A1A2C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    width: '90%', 
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconImage: {
      width: 35,
      height: 35,
    },
    categoryText: {
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: 10,
      marginBottom: 5,
      flexWrap: 'nowrap', // Prevent wrapping
    },
    amountText: {
      color: '#1A1A2C',
      marginLeft: 10,
      flexDirection: 'row',
    },
    amountValueText: {
      color: '#1A1A2C',
    },
    amountOutOfText: {
      color: '#7E8086',
    },
    Total_ammountText: {
     color: '#7E8086',
    },
      rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    leftText: {
      fontSize: 16,
      paddingTop: 5,
      flexDirection: 'row',
    },
    leftValueText: {
    color: '#1A1A2C',
    },
      leftOutOfText: {
      color: '#7E8086',
    },
    // New styles for Delete and Edit buttons
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    deleteIconContainer: {
      backgroundColor: '#fff',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#1A1A2C',
      marginRight: 4,
      width: '48%', 
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editIconContainer: {
      backgroundColor: '#fff',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#1A1A2C',
      marginLeft: 4,
      width: '48%', 
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    });

    export default Budget;

