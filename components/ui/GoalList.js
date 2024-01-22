// GoalList.js
import React from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import GoalItem from './GoalItem';

const GoalList = ({ goals }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GoalItem
            name={item.Name}
            totalAmount={item.Total_Ammount}
            currentAmount={item.Current_Ammount}
            Date={item.Date}
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
export default GoalList;
