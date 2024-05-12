import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where, getFirestore } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import BottomSheet from '@gorhom/bottom-sheet';
import ProfileInput from '../../components/Profile/ProfileInput';
import { Feather } from '@expo/vector-icons';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; 
import * as ImageManipulator from 'expo-image-manipulator';
import { ProfileStyles } from './ProfileStyle';
import { resizeImage } from './ProfileHelpers';
import { Profile } from './ProfileTypes';
import { languages } from '../../commonConstants/sharedConstants';

const ProfilePage = () => {
 
  const [profile, setProfile] = useState<Profile>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 
  const [isLoading, setIsLoading] = useState(false);
  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;
  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  // TODO - szakdogaba belerakni
  const handleSelectImage = async () => {
    setIsLoading(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult: any = await ImagePicker.launchImageLibraryAsync();
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

  const uploadImage = async (uri: string, userId: string) => {
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
  
  const updateUserProfileImage = async (imageUrl: string) => {
    setIsLoading(true); 

    const settingsQuery: any = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot: any = await getDocs(settingsQuery);

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

      const fetchedProfiles: any = querySnapshot.docs[0]
      ? {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        }
      : null;

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
    !isLoading && profile && (
      <View style={ProfileStyles.container}>
        <View>
          <View style={ProfileStyles.card}>
            <View style={ProfileStyles.cardContent}>
              <TouchableOpacity onPress={handleSelectImage} style={ProfileStyles.leftSection}>
                <Image
                  source={profile?.profilePicture ? { uri: profile.profilePicture } : require('../../assets/avatar.png')}
                  style={ProfileStyles.avatar}
                />
                <Text style={ProfileStyles.changePicture}>{languages[selectedLanguage].changeProfilePicture}</Text>
              </TouchableOpacity>
              <View>
                {profile && (
                  <View style={ProfileStyles.editOption}>
                    <Text style={ProfileStyles.label}>{languages[selectedLanguage].firstName}</Text>
                    <Text style={ProfileStyles.value}>   {profile.firstName}</Text>
                  </View>
                )}
                {profile && (
                  <View style={ProfileStyles.editOption}>
                    <Text style={ProfileStyles.label}>{languages[selectedLanguage].lastName}</Text>
                    <Text style={ProfileStyles.value}>   {profile.lastName}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View>
          <View style={ProfileStyles.card}>
            <View style={ProfileStyles.editOption}>
              <Text style={ProfileStyles.label}>{languages[selectedLanguage].email}</Text>
              <Text style={ProfileStyles.value}>   {authCtx.email}</Text>
            </View>
  
            {profile && (
              <View>
                <View style={ProfileStyles.editOption}>
                  <Text style={ProfileStyles.label}>{languages[selectedLanguage].birthday}:</Text>
                  <Text style={ProfileStyles.value}>   {profile?.birthday.toDate().toLocaleDateString()}</Text>
                </View>
                <View style={ProfileStyles.editOption}>
                  <Text style={ProfileStyles.label}>{languages[selectedLanguage].gender}:</Text>
                  <Text style={ProfileStyles.value}>{profile.gender === 'Male' ?  `   ${languages[selectedLanguage].genderMale}` :  `   ${languages[selectedLanguage].genderFemale}` }</Text>
                </View>
                <View style={ProfileStyles.editOption}>
                  <Text style={ProfileStyles.label}>{languages[selectedLanguage].mobile}:</Text>
                  <Text style={ProfileStyles.value}>   {profile.mobile}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
  
        <TouchableOpacity
          style={ProfileStyles.editButton}
          onPress={() => setEditModalVisible(true)}
        >
          <Feather name="edit" size={24} color="#fff" style={ProfileStyles.editIcon} />
          <Text style={ProfileStyles.addButtonText}>{languages[selectedLanguage].editProfile}</Text>
        </TouchableOpacity>
  
        {profile && (
          <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <Pressable
              style={ProfileStyles.modalBackground}
              onPress={() => setEditModalVisible(false)}
            >
              <BottomSheet
                ref={bottomSheetRef}
                index={2}
                snapPoints={snapPoints}
                enablePanDownToClose
                onClose={() => setEditModalVisible(false)}
                backgroundComponent={({ style }) => (
                  <View style={[style, ProfileStyles.bottomSheetBackground]} />
                )}
              >
                <View style={ProfileStyles.contentContainer}>
                  <ProfileInput
                    initialProfile={profile}
                    onEditProfile={editProfileHandler}
                    selectedLanguage={selectedLanguage}
                  />
                </View>
              </BottomSheet>
            </Pressable>
          </Modal>
        )}
      </View>
    )
  );
  
};

export default ProfilePage;


