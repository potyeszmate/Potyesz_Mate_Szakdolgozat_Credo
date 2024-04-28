import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { collection, doc, getDocs, query, updateDoc, where, getFirestore } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import BottomSheet from '@gorhom/bottom-sheet';
import ProfileInput from '../../components/ui/ProfileInput';
import { Feather } from '@expo/vector-icons';
import en from '../../languages/en.json';
import de from '../../languages/de.json';
import hu from '../../languages/hu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; // Assuming you are using Expo to handle image picking
import * as ImageManipulator from 'expo-image-manipulator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const languages: any = {
  English: en,
  German: de,
  Hungarian: hu,
};

const ProfilePage = () => {
 
  console.log("TEST")
  const [profile, setProfile] = useState<any>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  // const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
  const [isLoading, setIsLoading] = useState(false);

  const authCtx: any = useContext(AuthContext);
  const { userId } = authCtx as any;

  const snapPoints = useMemo(() => ['20%', '70%', '85%'], []);

  const resizeImage = async (uri) => {
    console.log("Resizing the image with URI:", uri); // This should log a valid string URI
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
        );
        console.log("Resized URI:", result.uri);
        return result.uri;
    } catch (error) {
        console.error("Error resizing image:", error);
        return uri; // return original URI on error to continue without resizing
    }
  };


const handleSelectImage = async () => {
  setIsLoading(true);
  console.log("Requesting media library permissions");
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("You've refused to allow this app to access your photos!");
    return;
  }

  console.log("Launching image library");
  const pickerResult = await ImagePicker.launchImageLibraryAsync();
  if (pickerResult.cancelled) {
    console.log("Image picker was cancelled");
    setIsLoading(false);
    return;
  }

  console.log("Picker result:", pickerResult);
  if (pickerResult.assets && pickerResult.assets.length > 0) {
    const uri = pickerResult.assets[0].uri;
    console.log("URI:", uri); // Make sure this prints a valid URI

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
        console.log('Attempting to fetch and upload:', uri);
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const fileRef = ref(storage, `profile_images/${userId}.png`);

        await uploadBytes(fileRef, blob);
        const downloadUrl = await getDownloadURL(fileRef);
        console.log('Image uploaded and URL fetched:', downloadUrl);
        return downloadUrl;
    } catch (error) {
        console.error('Error during the upload process:', error);
        return null;
    }
};
  
  const updateUserProfileImage = async (imageUrl) => {
    setIsLoading(true); // Set loading state to true when image upload begins

    const settingsQuery: any = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(settingsQuery);

    console.log("user querySnapshot: ", querySnapshot)

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data(); // Access the data
      const editableID = querySnapshot.docs[0].id; // Access the document ID

      console.log("editableID: ", editableID)
      // Now you have the document ID and you can proceed to update the document
      const userDocRef = doc(db, "users", editableID);
      try {
        await updateDoc(userDocRef, { profilePicture: imageUrl });
        console.log("Profile image updated successfully.");
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
          //setProfile(prev => ({ ...prev, profilePicture: imageUrl }));
          setIsLoading(false);

        } catch (error) {
          setIsLoading(false);

          console.error("Error updating user profile:", error);
        }
};
  
  // const editRecurringTransactionHandler = async (editedRecurringTransaction: any) => {
  //   try {
  //     const { id, ...editedData } = editedRecurringTransaction;
  //     const docRef = doc(db, 'bills', id);
  //     await updateDoc(docRef, editedData);
  //     fetchRecurringTransactions();
  //     setEditModalVisible(false);
  //   } catch (error: any) {
  //     console.error('Error editing transaction:', error.message);
  //   }
  // };

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

  // const fetchProfile = async () => {
  //   console.log("profile: ",profile)

  //   const profileQuery = query(collection(db, 'users'), where('uid', '==', userId));
  //   const querySnapshot = await getDocs(profileQuery);
    
  //   if (!querySnapshot.empty) {
  //     const userData = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setProfile(userData[0]); // Assuming you want to keep the first profile data
  //     console.log("profileafter setting ", profile);
  //   }
  // };

  // const fetchProfile = async () => {
  //   console.log("FETCHING PROFILE outside try block");
  //   try {
  //     const profileQuery = query(collection(db, 'users'), where('uid', '==', userId));
  //     const querySnapshot = await getDocs(profileQuery);
  //     console.log("Query executed");
  //     if (!querySnapshot.empty) {
  //       const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
  //       setProfile(userData);
  //       console.log("Profile set:", userData);
  //     } else {
  //       console.log("No profile found for this user.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   }
  // };
  
  
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

  console.log("Outside useEffect userId:", userId);

  useEffect(() => {
    console.log("Inside useEffect userId:", userId);
    if (userId) {
      fetchProfile();
    } else {
      console.log("userId is not available");
    }
  }, [userId]); // Ensure userId is listed as a dependency


  
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

  // if (!profile) {
  //   return <Text>Loading profile...</Text>; // Or some other loading indicator
  // }

    return (
      // {isLoading && (
      //   <ActivityIndicator size="large" color="#0000ff" /> // Loading indicator
      // )}
      
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
                        {/* <FontAwesome5 name="user" style={styles.icon} /> */}
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
    alignItems: 'flex-start', // Align card content to start
  },
  cardContent: {
    width: '100%',
    alignItems: 'flex-start', // Align content to start
  },
  profileCard: { // New style for profile card
    alignItems: 'center',
    // marginBottom: 16,
    // paddingVertical: 24,
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
    textAlign: 'center', // Center text below the avatar
    marginBottom: 20, // Space below the change picture text
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
    alignItems: 'center', // Align items in row
    width: '100%',
    paddingVertical: 8, // More vertical padding
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
  // ... other styles ...
});


export default ProfilePage;


