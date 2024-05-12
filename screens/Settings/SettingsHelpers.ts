import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

  export const updateTheme = async (newTheme: boolean, userId: string) => {
  
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
  
        if (userData.uid === userId) {
          updateDoc(doc.ref, { darkMode: newTheme });
        }
      });
    } catch (error) {
      console.error('Error updating user darkMode:', error);
    }
  };
  