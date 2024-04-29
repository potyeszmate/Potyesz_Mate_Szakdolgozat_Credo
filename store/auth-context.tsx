import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { getEmail, getUid } from '../util/auth'; 

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
  const [userId, setUserId] = useState(''); 
  const [email, setEmail] = useState(''); 


  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);

        const uid: any = await getUid(storedToken);
        setUserId(uid);

        const email = await getEmail(storedToken);
        setEmail(email);
      }
    };

    initializeAuth();
  }, []);

  function authenticate(token: any) {
    setAuthToken(token);

    AsyncStorage.setItem('token', token);

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

  function logout() {
    setAuthToken(null as any);
    setUserId(''); 
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
