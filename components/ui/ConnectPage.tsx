import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConnectPage = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.followText}>Follow us on our socials:</Text>

      <TouchableOpacity style={styles.platformCard}>
        <Ionicons name="logo-facebook" size={24} color="#3b5998" />
        <Text style={styles.platformText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.platformCard}>
        <Ionicons name="logo-instagram" size={24} color="#c13584" />
        <Text style={styles.platformText}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.platformCard}>
        <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
        <Text style={styles.platformText}>Twitter</Text>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.iconContent}>
            <Ionicons name="mail-outline" size={24} color="#1CB854" />
          </View>
          <View style={styles.textContent}>
            <Text style={styles.emailTitle}>Send us your feedback:</Text>
            <Text style={styles.email}>contact@example.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  followText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    borderColor: '#1CB854',
    marginTop: 20,
    borderWidth: 1,

  },
  platformText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1CB854',
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
  },
  iconContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  textContent: {
    flex: 1,
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  email: {
    fontSize: 16,
    color: '#1CB854',
  },
});

export default ConnectPage;
