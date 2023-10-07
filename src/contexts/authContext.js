import React from 'react';
import { isAuthenticatedVar, loggedInUserVar } from 'apollo/cache';

const AuthContext = React.createContext({});

const AuthProvider = (props) => {
  return (
    <AuthContext.Provider
      value={{
        user: loggedInUserVar(),
        isAuthenticated: isAuthenticatedVar(),
      }}
      {...props}
    />
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
