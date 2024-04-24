import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

interface Challenge {
  badge: string;
  desc: string;
  difficulty: string;
  durationInWeek: number;
  name: string;
  joined: boolean;
  selectedLanguage: string
}

const iconMapping: any = {
  Silver: require('../../assets/silverBadge.png'),
  Platinum: require('../../assets/platinumBadge.png'),
  Bronze: require('../../assets/bronzeBadge.png'),
};

const ChallengeItem: React.FC<{ challenge: Challenge, showActive?: boolean, onJoin?: () => void, showCompleted?: boolean }> = ({ challenge, showActive, onJoin, showCompleted, selectedLanguage}) => {
  
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleJoin = () => {
    if (!showActive && onJoin) {
      console.log("Add challenge")
      toggleModal(); // Open the modal when Join button is clicked
    }
  };

  const handleJoinConfirmed = () => {
    toggleModal(); // Close the modal
    onJoin && onJoin(); // Join the challenge
  };

  return (
    <View style={styles.card}>
      <View style={styles.badgeContainer}>
        <Image source={iconMapping[challenge.badge]} style={styles.badge} />
      </View>

      <View style={styles.imageContainer}>
        {/* Replace the image source with your actual image */}
        <Image source={require('../../assets/challengeBackground.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailCard}>
            <Text style={styles.detailText}>{languages[selectedLanguage][challenge.difficulty]}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailText}>{challenge.durationInWeek} {languages[selectedLanguage].weeks}</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.leftDescription}>
            <Text style={styles.name}>{challenge.name}</Text>
            <Text style={styles.desc}>{challenge.desc}</Text>
          </View>
          { showCompleted ? ( 
            <View style={[styles.completedButton]}>
              <Text style={[styles.completedButtonText]}>
                Completed
              </Text>
            </View>
          ) : 
            <TouchableOpacity style={[styles.joinButton, showActive && styles.activeJoinButton]} onPress={handleJoin}  disabled={showActive}>
              {showActive ? (
                <FontAwesome name="check" size={16} color="#35BA52" style={styles.checkmarkIcon} />
              ) : null}
                <Text style={[styles.joinButtonText, showActive && styles.activeJoinButtonText]}>
                  {showActive ? 'Joined' : 'Join'}
                </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to join this challenge?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.yesButton} onPress={handleJoinConfirmed}>
                <Text style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 230,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the badge appears above other elements
  },
  imageContainer: {
    height: '40%',
    backgroundColor: 'gray', // Replace with your image's background color
    zIndex: 0, // Lower the zIndex to ensure the badge appears above the image
  },
  badgeText: {
    fontSize: 16,
    color: 'white',
  },
  image: {
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailCard: {
    width: 70, // Adjust the width here
    marginRight: 5,
    backgroundColor: '#F5F7F9',
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A2C',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
  },
  leftDescription: {
    flex: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2C',
    marginBottom: 5,
  },
  desc: {
    fontSize: 14,
    color: '#7E8086',
    marginBottom: 5, // Add marginBottom to create space between name and description
  },
  joinButton: {
    width: '25%', // Adjust the width here
    height: 33, // Adjust the height here
    backgroundColor: '#35BA52',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10, // Add marginLeft to create space between description and button
    flexDirection: 'row',
  },
  activeJoinButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#35BA52',
    borderWidth: 1,
  },
  completedButton: {
    width: '25%', // Adjust the width here
    height: 33, // Adjust the height here
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10, // Add marginLeft to create space between description and button
    flexDirection: 'row',
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  completedButtonText: {
    fontSize: 14,
    color: '#CCCCCC', // Gray text color
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  joinButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  activeJoinButtonText: {
    color: '#35BA52',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#35BA52',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  yesButton: {
    backgroundColor: '#35BA52',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF5733', // Different color for cancel button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  
});

export default ChallengeItem;