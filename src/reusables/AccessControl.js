import React from 'react';
import PropTypes from 'prop-types';

import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';

/**
 * AccessControl either renders or hide its child based on the allowedRoles prop
 * If the child is a function i.e render props, it renders the child either ways but passes an [allowed] boolean
 * to the child function
 * @see https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/.
 * Very similar api as the tutorial above. We only just manage our roles using a custom hook
 */
const AccessControl = (props) => {
  const { allowedRoles, children } = props;
  const { userDetails } = useAuthenticatedUser();
  const allowed = allowedRoles?.includes(userDetails?.selectedRole);

  if (typeof children === 'function') {
    return children(allowed);
  } else if (allowed) {
    return children;
  }
  return null;
};

AccessControl.propTypes = {
  allowedRoles: PropTypes.oneOf(Object.values(UserRoles)),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

export default React.memo(AccessControl);
