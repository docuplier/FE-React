import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from 'utils/Auth';
import { PublicPaths } from './index';
import { useLocation } from 'react-router-dom';
import { setlastVisitedURL } from 'utils/Auth';

const PrivateRoute = ({ component: Component, shouldRedirect, path, ...rest }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      setlastVisitedURL(pathname);
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }, [pathname]);
  return (
    <Route
      {...rest}
      render={(props) => {
        const content =
          isAuthenticated() && shouldRedirect !== false ? (
            <Component />
          ) : shouldRedirect !== false ? (
            <Redirect
              to={{
                pathname:
                  PublicPaths.LOGIN /* Path to redirect to when an unauthorized user tries to access a protected route */,
                state: { from: props.location },
              }}
            />
          ) : (
            <Redirect
              to={{ pathname: { path }, state: { from: props.location } }}
            /> /* path to redirect when an authorized user hits the login endpoint*/
          );

        // null;
        return content;
      }}
    />
  );
};

export default PrivateRoute;
