import React from 'react';
import { useHistory } from 'react-router-dom';
import { PublicPaths } from 'routes';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { isAuthenticated } from 'utils/Auth';
import { navigateToDefaultRoute } from 'utils/RouteUtils';

const Redirects = () => {
  const history = useHistory();
  const { userDetails } = useAuthenticatedUser();
  !isAuthenticated() ? history.push(PublicPaths.LOGIN) : navigateToDefaultRoute(userDetails);
  return null;
};

export default React.memo(Redirects);
