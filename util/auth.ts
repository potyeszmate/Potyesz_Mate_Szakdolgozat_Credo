import axios from 'axios';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';

const API_KEY = 'AIzaSyCevIOdziT9r8ZR-W0ILfCC8rLvqWJcAQ8';

export const getUid = async (idToken: any): Promise<string | null> => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        idToken: idToken,
      }
    );
    if (
      response.data &&
      response.data.users &&
      response.data.users.length > 0 &&
      response.data.users[0].localId
    ) {
      return response.data.users[0].localId;
    } else {
      console.error('Invalid response format or missing localId.');
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching user ID in getUid:', error.message);

    return null;
  }
};

export const getEmail = async (idToken: any) => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        idToken: idToken,
      }
    );
    if (
      response.data &&
      response.data.users &&
      response.data.users.length > 0 &&
      response.data.users[0].email
    ) {
      return response.data.users[0].email;
    } else {
      console.error('Invalid response format or missing localId.');
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }
};


async function authenticate(mode: any, email: any, password: any) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}

export function createUser(email: any, password: any) {
  return authenticate('signUp', email, password);
}

export function login(email: any, password: any) {
  return authenticate('signInWithPassword', email, password);
}
