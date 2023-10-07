import decodeJWT from 'jwt-decode';
import { client } from 'apollo';

export const isAuthenticated = () => {
  const token = getAuthToken();

  if (token) {
    const decodedToken = decodeJWT(token);
    const { exp } = decodedToken;
    const currentTime = Date.now() / 1000;

    if (exp < currentTime) {
      clearVault();
      return false;
    }

    return true;
  }

  return false;
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const setlastVisitedURL = (lastVisitedUrl) => {
  localStorage.setItem('lastVisitedUrl', lastVisitedUrl);
};

export const getAuthToken = () => {
  let token = localStorage.getItem('token');
  return token || null;
};
export const getlastVisitedURL = () => {
  let lastVisitedUrl = localStorage.getItem('lastVisitedUrl');
  return lastVisitedUrl || '';
};

export const clearVault = () => {
  //clear the localStorage, the apollo client cache and the history
  localStorage.removeItem('token');
  client.clearStore();
};
