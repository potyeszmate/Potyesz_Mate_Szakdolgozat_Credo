import axios from 'axios';

const API_KEY = 'AIzaSyCevIOdziT9r8ZR-W0ILfCC8rLvqWJcAQ8';

export const getUid = async (idToken) => {
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
  } catch (error) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }
};

export const getEmail = async (idToken) => {
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
  } catch (error) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }
};

// Return with auth Token
async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password);
}