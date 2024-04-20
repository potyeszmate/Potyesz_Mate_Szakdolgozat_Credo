import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import BottomSheet from '@gorhom/bottom-sheet';
import ProfileInput from '../../components/ui/ProfileInput';
import { Feather } from '@expo/vector-icons';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const ProfilePage = () => {
 
  const [profile, setProfile] = useState<any>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  // const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;

  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  const fetchProfile = async () => {
    console.log("userId in Profile: ", userId)
    try {
      const profileQuery = query(collection(db, 'users'),  where('uid', '==', userId));
      const querySnapshot = await getDocs(profileQuery);
      console.log("userId", userId )
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProfile(fetchedProfiles);
      console.log('Fetched profile:', fetchedProfiles);
      console.log("fetchedProfiles", fetchedProfiles)
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const editProfileHandler = async (editedProfile: any) => {
    console.log("editedProfile", editedProfile)
    try {
      const { id, ...editedData } = editedProfile;
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, editedData);
      fetchProfile();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  
  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        console.log(selectedLanguage)
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
    // Use the retrieved language for any rendering or functionality
  };

  const isFocused = useIsFocused();

  
  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
      console.log("In useEffect")
    }
  }, [isFocused]);

  // onPress={() => console.log('Edit Profile')}

    return (
          <View style={styles.container}>
            <View>
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.leftSection}>
                      <Image
                        source={require('../../assets/avatar.png')}
                        style={styles.avatar}
                      />
                      <Text style={styles.changePicture}>{languages[selectedLanguage].changeProfilePicture}</Text>
                    </View>
                    <View style={styles.rightSection}>
                      {profile && profile.length > 0 && (
                        <View style={styles.editOption}>
                          <Text style={styles.label}>{languages[selectedLanguage].firstName}:</Text>
                          <Text style={styles.value}>{profile[0].firstName}:</Text>
                        </View>
                      )}
                      {profile && profile.length > 0 && (
                        <View  style={styles.editOption}>
                          <Text style={styles.label}>{languages[selectedLanguage].lastName}</Text>
                          <Text style={styles.value}>{profile[0].lastName}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View>
              <View style={styles.card}>
                <Text style={styles.label}>{languages[selectedLanguage].email}:</Text>
                <Text style={styles.value}>{authCtx.email}</Text>
                {profile && profile.length > 0 && (
              <View>
              <View style={styles.editOption}>
                <Text style={styles.label}>{languages[selectedLanguage].birthday}:</Text>
                <Text style={styles.value}>{profile[0].birthday.toDate().toLocaleDateString()}</Text>
              </View>
              <View style={styles.editOption}>
                <Text style={styles.label}>{languages[selectedLanguage].gender}:</Text>
                <Text style={styles.value}>{profile[0].gender}</Text>
              </View>
              <View style={styles.editOption}>
                <Text style={styles.label}>{languages[selectedLanguage].mobile}:</Text>
                <Text style={styles.value}>{profile[0].mobile}</Text>
              </View>
            </View>
          )}
          {/* Edit icon in top right corner */}
          {/* <TouchableOpacity style={styles.editIconContainer} onPress={() => console.log('Edit others')}>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditModalVisible(true)}
      >
        <Feather name="edit" size={24} color="#fff" style={styles.editIcon} />
        <Text style={styles.addButtonText}>{languages[selectedLanguage].editProfile}</Text>
      </TouchableOpacity>

      {profile && profile.length > 0 &&   ( 
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            setEditModalVisible(false);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => {
              console.log('BottomSheet closed');
              setEditModalVisible(false);
            }}
            backgroundComponent={({ style }) => (
              <View style={[style, styles.bottomSheetBackground]} />
            )}
          >
            <View style={styles.contentContainer}>
              <ProfileInput
                initialProfile={ profile[0]}
                onEditProfile={editProfileHandler}
                selectedLanguage={selectedLanguage}
              />
            </View>
          </BottomSheet>

        </Pressable>
      </Modal>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: 'row',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  editButtonContainer: {
    padding: 16,
  },
  editButton: {
    backgroundColor: '#35BA52',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePicture: {
    marginTop: 8,
    color: 'blue',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 2,
    marginLeft: 16,
  },
  nameInput: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    marginBottom: 12,
    marginLeft: 8, // Added margin to align value with label
  },
  editOption: {
    marginBottom: 12,
  },
  editIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalBackground: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
});

export default ProfilePage;
