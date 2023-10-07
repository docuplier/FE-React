import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { loggedInUserSelectedRoleVar } from 'apollo/cache';
import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';
import NotFoundPage from 'pages/NotFoundPage';
import useSubdomain from 'hooks/useSubDomain';
import LoadingAnimation from './LoadingAnimation';

/**
 *
 * @component
 * This component controls all logic needed to render an healthy app.
 * The component currently handles domain verification/customization and determining "who the logged in user is"
 *
 ** Domain Verification and Customization **
 * => We first of all determine if the url entered in the address bar is a valid admin or sub-domain via the useSubdomain hook
 * => There are 4 outcomes
 * => If the domain is invalid: The app displays a 404 page.
 * => If the domain is the admin domain(e.g admin.deltalms.com): No domainObject is returned from the hook and the app uses the default app themes, logos, etc.
 * => If the domain has a name called "select": Behaves same as admin domain.
 * => If the domian is a sub-domian(e.g majoku.deltalms.com): A domainObject is returned from the hook, which we use to customize the application.
 *
 *
 ** Determining "who the logged in user is **
 * => We determine if we know "who the logged in user is" using the useAuthenticated hook
 * => We also perform logic coupled to changing the role of the currently logged in user
 *
 * All Private routes will fail to mount if we cannot decipher who the current logged in user is
 */
const Splashscreen = ({ children }) => {
  const { loading: isDomainLoading, domainObject, isDomainInvalid } = useSubdomain();
  const { loading } = useAuthenticatedUser();
  const loggedInUserSelectedRole = useReactiveVar(loggedInUserSelectedRoleVar);
  const client = useApolloClient();

  useEffect(() => {
    if (Boolean(domainObject)) {
      // Performs site customizations for sub-domains
      let siteFavicon = document?.querySelector("link[rel*='icon']");

      if (Boolean(siteFavicon)) {
        siteFavicon.href = domainObject?.favicon;
      }
    }
  }, [domainObject]);

  useEffect(() => {
    if (loggedInUserSelectedRole) {
      //@todo:
      //perform a mutation to change the selected role of the currently logged in user
      //load the view afterwards
      resetStore();
    }
    // eslint-disable-next-line
  }, [loggedInUserSelectedRole]);

  const resetStore = () => {
    let loggedInUser = client.cache.readQuery({
      query: LOGGED_IN_USER_QUERY,
    });
    client.clearStore();
    client.cache.writeQuery({
      query: LOGGED_IN_USER_QUERY,
      data: {
        loggedInUser,
      },
    });
  };

  const renderLoading = () => {
    return <LoadingAnimation />;
  };

  if (isDomainLoading || loading) {
    return renderLoading();
  }

  if (isDomainInvalid) {
    return <NotFoundPage />;
  }

  return children;
};

Splashscreen.propTypes = {
  children: PropTypes.node,
};

export default React.memo(Splashscreen);
