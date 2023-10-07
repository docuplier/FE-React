import { gql } from '@apollo/client/core';
import { CORE_USER_FIELDS } from 'graphql/fragments';

export const LOGIN_USER = gql`
  ${CORE_USER_FIELDS}
  mutation login($email: String, $password: String!, $institutionId: UUID) {
    login(email: $email, password: $password, institutionId: $institutionId) {
      ok
      token
      user {
        ...UserPart
      }
      payload
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation Logout {
    logout {
      ok
      success {
        messages
      }
    }
  }
`;

export const REGISTER_USER = gql`
  ${CORE_USER_FIELDS}
  mutation registerUser(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $phone: String!
    $roles: [SignupRoleEnum!]!
  ) {
    registerUser(
      userDetails: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        phone: $phone
        roles: $roles
      }
    ) {
      ok
      errors {
        messages
      }
      user {
        ...UserPart
      }
    }
  }
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($deliveryMode: DeliveryModeEnum!, $identifier: String!) {
    forgotPassword(deliveryMode: $deliveryMode, identifier: $identifier) {
      ok
      success {
        messages
      }
      errors {
        messages
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      ok
      success {
        messages
      }
      errors {
        messages
      }
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation userVerifyEmail($email: String!, $phone: String!, $role: SignupRoleEnum) {
    userVerifyEmail(email: $email, phone: $phone, role: $role) {
      ok
      success {
        messages
      }
      errors {
        messages
      }
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const RESET_EXISTING_USER_PASSWORD = gql`
  mutation existingUserResetPassword(
    $existingUserEmail: String
    $existingUserId: UUID!
    $existingUserPhone: String
  ) {
    existingUserResetPassword(
      existingUserEmail: $existingUserEmail
      existingUserId: $existingUserId
      existingUserPhone: $existingUserPhone
    ) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const EXISTING_USER_CREATE_PASSWORD = gql`
  mutation existingUserCreatePassword(
    $email: String!
    $existingUserId: UUID!
    $newPassword: String!
    $token: String!
    $phone: String
  ) {
    existingUserCreatePassword(
      email: $email
      existingUserId: $existingUserId
      newPassword: $newPassword
      token: $token
      phone: $phone
    ) {
      ok
      success {
        messages
      }
      errors {
        messages
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;
