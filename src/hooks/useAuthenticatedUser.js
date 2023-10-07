import { useQuery } from '@apollo/client';

import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';
import { isAuthenticated } from 'utils/Auth';
import { getSelectedRole } from 'utils/UserUtils';
import { getNameInitials } from 'utils/UserUtils';
import useSubdomain from 'hooks/useSubDomain';

export const useAuthenticatedUser = () => {
  const { domainObject } = useSubdomain();
  const { data, loading } = useQuery(LOGGED_IN_USER_QUERY, {
    skip: !isAuthenticated(),
    fetchPolicy: 'cache-first',
  });
  const firstName = data?.loggedInUser?.firstname;
  const lastName = data?.loggedInUser?.lastname;

  return {
    loading,
    userDetails: data
      ? {
          ...data.loggedInUser,
          initials: getNameInitials(firstName, lastName),
          selectedRole: getSelectedRole(data?.loggedInUser?.roles[0]),
          institution: {
            ...domainObject,
          },
        }
      : null,
  };
};
