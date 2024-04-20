import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  price: number;
  logo: string;
  percent_change_24h: number;
  description: string;
}

const CryptoDetails = () => {
  const route: any = useRoute();
  const { currency }: { currency: Crypto } = route.params;
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: currency.logo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{currency.name}</Text>
          <Text style={styles.symbol}>{currency.symbol}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${currency.price.toFixed(2)}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Change (24h):</Text>
        <Text style={[styles.value, currency.percent_change_24h < 0 ? styles.red : styles.green]}>
          {currency.percent_change_24h.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Description:</Text>
        <View style={[styles.description, expanded ? styles.expandedDescription : null]}>
          <Text>{currency.description}</Text>
          {currency.description.length > 150 && (
            <TouchableOpacity onPress={toggleDescription} style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>{expanded ? "Read Less" : "Read More"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  symbol: {
    fontSize: 20,
    color: "#666",
  },
  details: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    fontSize: 18,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    maxHeight: 100,
    overflow: "hidden",
  },
  expandedDescription: {
    maxHeight: "auto",
  },
  readMoreButton: {
    marginTop: 5,
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
});

export default CryptoDetails;
