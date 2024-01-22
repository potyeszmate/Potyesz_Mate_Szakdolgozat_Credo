import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import BudgetItem from './BudgetItem';

const BudgetList = ({ budgets }) => {
  return (
    <ScrollView
      style={styles.listContainer}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BudgetItem
            name={item.name}
            totalAmount={item.totalAmount}
            spentAmount={item.spentAmount}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 20,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: 250, // Set the maximum height
  },
  listContentContainer: {
    alignItems: 'center',
  },
});

export default BudgetList;
