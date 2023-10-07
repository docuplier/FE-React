import { UserRoles } from './constants';
let hostname = window.location.hostname.toLowerCase();

export const getNameInitials = (firstName = null, lastName = null) => {
  const firstNameLetter = firstName ? firstName[0] : 'A';
  const lastNameLetter = lastName ? lastName[0] : 'Z';

  return `${firstNameLetter}${lastNameLetter}`.toUpperCase();
};

export const formatUserNameWithMiddleName = (firstName, middleName, lastName) => {
  return Boolean(middleName)
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;
};

export const getSelectedRole = (role) => {
  // Change user role to that of a SCHOOL_ADMIN when a GLOBAL_ADMIN logs into a school url.
  if (role === UserRoles.GLOBAL_ADMIN && hostname.includes('admin') === false) {
    return UserRoles.SCHOOL_ADMIN;
  }

  if (role === UserRoles.DFA_ADMIN && hostname.includes('admin') === false) {
    return UserRoles.DFA_ADMIN;
  }
  return role;
};
