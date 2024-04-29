import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where, getFirestore } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import BottomSheet from '@gorhom/bottom-sheet';
import ProfileInput from '../../components/ui/ProfileInput';
import { Feather } from '@expo/vector-icons';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; 
import * as ImageManipulator from 'expo-image-manipulator';

const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

 //TODO: Move some methods, style, and contants out of here
const ProfilePage = () => {
 
  const [profile, setProfile] = useState<any>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const [isLoading, setIsLoading] = useState(false);

  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;

  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  const resizeImage = async (uri) => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
        );
        return result.uri;
    } catch (error) {
        console.error("Error resizing image:", error);
        return uri;
    }
  };

  const handleSelectImage = async () => {
    setIsLoading(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled) {
      setIsLoading(false);
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const uri = pickerResult.assets[0].uri;

      const resizedUri = await resizeImage(uri);
      if (resizedUri) {
        const uploadUrl = await uploadImage(resizedUri, userId);
        if (uploadUrl) {
          await updateUserProfileImage(uploadUrl);
        }
      }
    } else {
      setIsLoading(false);

      console.error("No assets found in picker result");
    }
  };

  const uploadImage = async (uri, userId) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const fileRef = ref(storage, `profile_images/${userId}.png`);

        await uploadBytes(fileRef, blob);
        const downloadUrl = await getDownloadURL(fileRef);
        return downloadUrl;
    } catch (error) {
        console.error('Error during the upload process:', error);
        return null;
    }
  };
  
  const updateUserProfileImage = async (imageUrl) => {
    setIsLoading(true); 

    const settingsQuery: any = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(settingsQuery);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data(); 
      const editableID = querySnapshot.docs[0].id; 

      const userDocRef = doc(db, "users", editableID);
      try {
        await updateDoc(userDocRef, { profilePicture: imageUrl });
        await AsyncStorage.setItem('profileChanged', 'true');
        setProfile(prev => ({ ...prev, profilePicture: imageUrl }));
      } catch (error) {
        setIsLoading(false);

        console.error("Error updating user profile:", error);
      }
      } else {
        setIsLoading(false);

        console.error('No document found for this user ID');
      }
        const userDocRef = doc(db, "users", userId);
        try {
          await updateDoc(userDocRef, { profilePicture: imageUrl });
          fetchProfile()
          setIsLoading(false);

        } catch (error) {
          setIsLoading(false);

          console.error("Error updating user profile:", error);
        }
  };
  
  const fetchProfile = async () => {
    try {
      const profileQuery = query(collection(db, 'users'),  where('uid', '==', userId));
      const querySnapshot = await getDocs(profileQuery);
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfile(fetchedProfiles);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const editProfileHandler = async (editedProfile: any) => {
    try {
      const { id, ...editedData } = editedProfile;
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, editedData);
      await AsyncStorage.setItem('profileChanged', 'true');
      fetchProfile();
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Error editing transaction:', error.message);
    }
  };


  const getSelectedLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) {
        setSelectedLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error retrieving selected language:', error);
    }
  };

  const fetchLanguage = async () => {
    const language = await getSelectedLanguage();
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchLanguage();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      console.error("userId is not available");
    }
  }, [userId]); 


    return (
      !isLoading  && profile && 
      <View style={styles.container}>
              <View>
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                  <TouchableOpacity onPress={handleSelectImage} style={styles.leftSection}>
                    <Image
                      source={profile[0]?.profilePicture ? { uri: profile[0].profilePicture } : require('../../assets/avatar.png')}
                      style={styles.avatar}
                    />
                    <Text style={styles.changePicture}>{languages[selectedLanguage].changeProfilePicture}</Text>
                  </TouchableOpacity>
                    <View style={styles.rightSection}>
                      {profile && profile.length > 0 && (
                        <View style={styles.editOption}>
                        <Text style={styles.label}>{languages[selectedLanguage].firstName}</Text>
                        <Text style={styles.value}>   {profile[0].firstName}</Text>
                      </View>
                      )}
                      {profile && profile.length > 0 && (
                        <View  style={styles.editOption}>
                          <Text style={styles.label}>{languages[selectedLanguage].lastName}</Text>
                          <Text style={styles.value}>   {profile[0].lastName}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View>
              <View style={styles.card}>
                <View style={styles.editOption}>
                {/* <FontAwesome5 name="envelope" style={styles.icon} solid /> */}
                <Text style={styles.label}>{languages[selectedLanguage].email}</Text>
                <Text style={styles.value}>   {authCtx.email}</Text>
                </View>

                {profile && profile.length > 0 && (
                <View>
                <View style={styles.editOption}>
                  <Text style={styles.label}>{languages[selectedLanguage].birthday}:</Text>
                  <Text style={styles.value}>   {profile[0].birthday.toDate().toLocaleDateString()}</Text>
                </View>
                <View style={styles.editOption}>
                  <Text style={styles.label}>{languages[selectedLanguage].gender}:</Text>
                  <Text style={styles.value}>   {profile[0].gender}</Text>
                </View>
                <View style={styles.editOption}>
                  <Text style={styles.label}>{languages[selectedLanguage].mobile}:</Text>
                  <Text style={styles.value}>   {profile[0].mobile}</Text>
                </View>
              </View>
            
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditModalVisible(true)
        }      
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
    backgroundColor: '#f4f4f7',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 16,
    alignItems: 'flex-start', 
  },
  cardContent: {
    width: '100%',
    alignItems: 'flex-start', 
  },
  profileCard: { 
    alignItems: 'center',
    marginLeft: 30
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePicture: {
    color: '#149E53',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: '#5c6bc0',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%',
    paddingVertical: 8, 
  },
  editButton: {
    backgroundColor: '#149E53',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    width: '100%', // Button takes full width
  },
  editIcon: {
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leftSection: {
    marginLeft: 100,
    marginRight: 40
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },

 bottomSheetBackground: {
    backgroundColor: 'white',
    flex: 1,
  },
  editButtonContainer: {
    padding: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});


export default ProfilePage;


