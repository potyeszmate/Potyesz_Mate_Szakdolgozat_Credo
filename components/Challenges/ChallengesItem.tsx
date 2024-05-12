import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { languages } from '../../commonConstants/sharedConstants';
import { ChallengesitemStyles } from './ChallengesComponentStyles';
import { ChallengesIconMapping, challengeImageMap } from './ChallengesComponentConstants';
import { Challenge } from './ChallengeComponentTypes';

const ChallengeItem: React.FC<{ challenge: Challenge, showActive?: boolean, onJoin?: () => void, showCompleted?: boolean, selectedLanguage: string}> = ({ challenge, showActive, onJoin, showCompleted, selectedLanguage}) => {
  
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
    <View style={ChallengesitemStyles.card}>
      <View style={ChallengesitemStyles.badgeContainer}>
        <Image source={ChallengesIconMapping[challenge.badge]} style={ChallengesitemStyles.badge} />
      </View>

      <View style={ChallengesitemStyles.imageContainer}>
      <Image source={challengeImageMap[challenge.name]} style={ChallengesitemStyles.image} />
      </View>
      <View style={ChallengesitemStyles.detailsContainer}>
        <View style={ChallengesitemStyles.detailRow}>
          <View style={ChallengesitemStyles.detailCard}>
            <Text style={ChallengesitemStyles.detailText}>{languages[selectedLanguage][challenge.difficulty]}</Text>
          </View>
          <View style={ChallengesitemStyles.detailCard}>
            <Text style={ChallengesitemStyles.detailText}>{challenge.durationInWeek} {languages[selectedLanguage].weeks}</Text>
          </View>
        </View>
        <View style={ChallengesitemStyles.descriptionContainer}>
          <View style={ChallengesitemStyles.leftDescription}>
            <Text style={ChallengesitemStyles.name}>{challenge.name}</Text>
            <Text style={ChallengesitemStyles.desc}>{challenge.desc}</Text>
          </View>
          { showCompleted ? ( 
            <View style={[ChallengesitemStyles.completedButton]}>
              <Text style={[ChallengesitemStyles.completedButtonText]}>
                Completed
              </Text>
            </View>
          ) : 
            <TouchableOpacity style={[ChallengesitemStyles.joinButton, showActive && ChallengesitemStyles.activeJoinButton]} onPress={handleJoin}  disabled={showActive}>
              {showActive ? (
                <FontAwesome name="check" size={16} color="#35BA52" style={ChallengesitemStyles.checkmarkIcon} />
              ) : null}
                <Text style={[ChallengesitemStyles.joinButtonText, showActive && ChallengesitemStyles.activeJoinButtonText]}>
                  {showActive ? 'Joined' : 'Join'}
                </Text>
            </TouchableOpacity>
          }
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={ChallengesitemStyles.modalContainer}>
          <View style={ChallengesitemStyles.modalContent}>
            <Text style={ChallengesitemStyles.modalText}>Are you sure you want to join this challenge?</Text>
            <View style={ChallengesitemStyles.modalButtons}>
              <TouchableOpacity style={ChallengesitemStyles.yesButton} onPress={handleJoinConfirmed}>
                <Text style={ChallengesitemStyles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ChallengesitemStyles.cancelButton} onPress={toggleModal}>
                <Text style={ChallengesitemStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ChallengeItem;
