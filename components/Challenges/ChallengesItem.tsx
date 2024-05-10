import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const challengeImageMap: any = {
  'Comprehensive Budgeting': require('../../assets/challenges/budgetBootcamp1.png'),
  'Expense Reduction Challenge': require('../../assets/challenges/cashFlowEarn3more.png'),
  'chatbot': require('../../assets/challenges/chatbotAsk.jpg'),
  'Debt Demolition': require('../../assets/challenges/debtDemolish.png'),
  'Financial Goal Setting': require('../../assets/challenges/financialGoal2.jpg'),
  'Establish 3 financial goals': require('../../assets/challenges/financialGoalsChall.jpg'),
  'First huge income': require('../../assets/challenges/incoemmoreThen2000.jpg'),
  '"Financial Goal Setting': require('../../assets/challenges/moneySaving.jpg'),
  'Buy Credo+': require('../../assets/challenges/premium.png'),
  'Recurring Mastery': require('../../assets/challenges/recurringPamynet.jpg'),
  'Savings Sprint': require('../../assets/challenges/savingSprint.png'),
  'stocks': require('../../assets/challenges/stocksImage.jpg'),
  'Transaction Master': require('../../assets/challenges/transaction1Image.jpg'),
  'Start transactions': require('../../assets/challenges/transactions2Image.jpg'),
  'First big spending': require('../../assets/challenges/transation4.jpg'),
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
      toggleModal(); 
    }
  };

  const handleJoinConfirmed = () => {
    toggleModal(); 
    onJoin && onJoin(); 
  };

  return (
    <View style={styles.card}>
      <View style={styles.badgeContainer}>
        <Image source={iconMapping[challenge.badge]} style={styles.badge} />
      </View>

      <View style={styles.imageContainer}>
      <Image source={challengeImageMap[challenge.name]} style={styles.image} />
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
    width: 300,
    
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
    zIndex: 1, 
  },
  imageContainer: {
    height: '40%',
    backgroundColor: 'gray', 
    zIndex: 0, 
    width: '100%',  
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  badgeText: {
    fontSize: 16,
    color: 'white',
  },
  image: {
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
    width: '110%',  
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
    width: 70, 
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
    alignItems: 'center', 
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
    marginBottom: 5, 
  },
  joinButton: {
    width: '25%', 
    height: 33,
    backgroundColor: '#35BA52',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10, 
    flexDirection: 'row',
  },
  activeJoinButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#35BA52',
    borderWidth: 1,
  },
  completedButton: {
    width: '25%', 
    height: 33, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10, 
    flexDirection: 'row',
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  completedButtonText: {
    fontSize: 14,
    color: '#CCCCCC', 
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
    backgroundColor: '#FF5733',
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
