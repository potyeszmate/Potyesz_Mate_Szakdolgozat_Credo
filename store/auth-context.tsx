import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { getEmail, getUid } from '../util/auth'; 
// import { FIREBASE_APP, FIREBASE_AUTH } from '../firebaseConfig';

export const AuthContext: any = createContext({
  token: '',
  userId: '', 
  email: '',
  isAuthenticated: false,
  authenticate: (token: any) => {},
  logout: () => {},
});

function AuthContextProvider({ children }: any) {
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState(''); // State for user ID
  const [email, setEmail] = useState(''); // State for user ID


  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);

        // Fetch the user ID when the token is available
        const uid: any = await getUid(storedToken);
        // console.log(uid);
        setUserId(uid);

        const email = await getEmail(storedToken);
        // console.log(uid);
        setEmail(email);
      }
    };

    initializeAuth();
  }, []);

  function authenticate(token: any) {
    setAuthToken(token);

    // 3rd party package to store stuff in storage (store token - key value)
    // After 1 hour the token needs a refresh

    // TODO:  https://firebase.google.com/docs/reference/rest/auth#section-refresh-token - refreshToken
    // send tis token to here: https://firebase.google.com/docs/reference/rest/auth#section-refresh-token
    // every time it expires
    AsyncStorage.setItem('token', token);

    // Fetch and set the user ID
    const fetchUserId = async () => {
      const uid: any = await getUid(token);
      setUserId(uid);
    };

    fetchUserId();

    const fetchEmail = async () => {
      const email = await getEmail(token);
      setEmail(email);
    };

    fetchEmail();
  }

  // function authenticate(token: AnyCnameRecord) {
  //   setAuthToken(token);
  //   AsyncStorage.setItem('token', token);
  // }

  // useEffect(() => {
  //   const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
  //     if (user) {
  //       // User is signed in
  //       const newToken = user.refreshToken; // Assuming you're storing the refresh token
  //       AsyncStorage.setItem('token', newToken);
  //       setAuthToken(newToken);
  //       setUserId(user.uid);
  //       setEmail(user.email as any);
  //     } else {
  //       // User is signed out
  //       AsyncStorage.removeItem('token');
  //       setAuthToken(null);
  //       setUserId('');
  //       setEmail('');
  //     }
  //   });

  //   return () => unsubscribe(); // Clean up the subscription on unmount
  // }, []);

  function logout() {
    setAuthToken(null as any);
    setUserId(''); // Clear the user ID
    setEmail('');
    AsyncStorage.removeItem('token');
  }

  const value = {
    token: authToken,
    userId: userId,
    email: email,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
