import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

/**
 * RoleSpecificLoader acts as a role specific loader that returns a
 * react component based on the role that matches
 * @param {any} props
 */
const RoleSpecificLoader = (props) => {
  const { userDetails } = useAuthenticatedUser();
  return props[userDetails?.selectedRole] || (() => null);
};

export default RoleSpecificLoader;
