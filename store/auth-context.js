import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { getUid } from '../util/auth'; // Import the getUid function

export const AuthContext = createContext({
  token: '',
  userId: '', // Add userId to the context
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState(''); // State for user ID

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);

        // Fetch the user ID when the token is available
        const uid = await getUid(storedToken);
        console.log(uid);
        setUserId(uid);
      }
    };

    initializeAuth();
  }, []);

  function authenticate(token) {
    setAuthToken(token);

    // 3rd party package to store stuff in storage (store token - key value)
    // After 1 hour the token needs a refresh

    // TODO:  https://firebase.google.com/docs/reference/rest/auth#section-refresh-token - refreshToken
    // send tis token to here: https://firebase.google.com/docs/reference/rest/auth#section-refresh-token
    // every time it expires
    AsyncStorage.setItem('token', token);

    // Fetch and set the user ID
    const fetchUserId = async () => {
      const uid = await getUid(token);
      setUserId(uid);
    };

    fetchUserId();
  }

  function logout() {
    setAuthToken(null);
    setUserId(''); // Clear the user ID
    AsyncStorage.removeItem('token');
  }

  const value = {
    token: authToken,
    userId: userId,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
