import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import GoalItem from './GoalItem';
import { GoalListStyles } from './GoalComponentStyles';

const GoalList: React.FC<any> = ({ goals }) => {
  return (
    <ScrollView
      contentContainerStyle={GoalListStyles.listContainer}
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

export default GoalList;
