import axios from 'axios';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
// import { auth } from './firebaseConfig';
// import { auth, db } from '../../../services/config';

const API_KEY = 'AIzaSyCevIOdziT9r8ZR-W0ILfCC8rLvqWJcAQ8';


//   const user: any = auth.currentUser;


export const getUid = async (idToken: any): Promise<string | null> => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        idToken: idToken,
      }
    );

    // Check if the response contains users and the first user has localId
    if (
      response.data &&
      response.data.users &&
      response.data.users.length > 0 &&
      response.data.users[0].localId
    ) {
      // console.log('Logged in uId: ', response.data.users[0].localId);

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

    // Check if the response contains users and the first user has localId
    if (
      response.data &&
      response.data.users &&
      response.data.users.length > 0 &&
      response.data.users[0].email
    ) {
      // console.log('Logged in uId: ', response.data.users[0].email);

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

// export const getUid = async (idToken: any): Promise<string | null> => {
//   try {
//       const user: any = FIREBASE_AUTH.currentUser;
//       console.log("logged in user: ", user)

//       return user.uid;
//   } catch (error: any) {
//     console.error('Error fetching user ID in getUid:', error.message);
    
//     return null;
//   }
// };

// export const getEmail = async (idToken: any) => {
//   try {
//     const user: any = FIREBASE_AUTH.currentUser;
//     console.log("logged in user: ", user)

//     return user.email;
//   } catch (error: any) {
//     console.error('Error fetching user ID:', error.message);
//     return null;
//   }
// };



// Return with auth Token
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

// export const createUser = async (email: string, password: string) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
//     return userCredential.user;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const login = async (email: string, password: string) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
//     return userCredential.user;  // Assuming userCredential.user includes everything needed.
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
