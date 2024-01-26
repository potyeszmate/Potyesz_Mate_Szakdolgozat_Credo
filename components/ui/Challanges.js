import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

const Challanges = () => {

  const [activeTab, setActiveTab] = useState('active');

  return (
    <ScrollView
    style={styles.rootContainer}
    contentContainerStyle={styles.scrollContentContainer}
    >

    <View style={styles.headerContainer}>
    <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'active' && styles.activeTabButtonText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'recommended' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'recommended' && styles.activeTabButtonText,
            ]}
          >
            Recommended
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'completed' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'completed' && styles.activeTabButtonText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
    </View>

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: 30
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 99,
  },
  tabButtonText: {
    color: '#1A1A2C',
    fontSize: 14,
    fontFamily: 'Inter', // Make sure you have the Inter font available
  },
  activeTabButton: {
    backgroundColor: '#1A1A2C',
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
});

export default Challanges;
