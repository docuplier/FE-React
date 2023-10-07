import { gql } from '@apollo/client';
import { CORE_EXISTING_USER_FIELDS, CORE_USER_FIELDS } from '../fragments';

export const LOGGED_IN_USER_QUERY = gql`
  ${CORE_USER_FIELDS}
  query loggedIn {
    loggedInUser {
      ...UserPart
    }
  }
`;

export const VERIFY_USER_TOKEN = gql`
  query verifyUser($token: String!) {
    verifyRegisterToken(token: $token) {
      isValid
      user {
        firstname
        lastname
        email
        roles
        institution {
          id
          name
          abbreviation
        }
        institutions {
          id
          name
          abbreviation
        }
      }
    }
  }
`;

export const GET_EXISTING_USER = gql`
  ${CORE_EXISTING_USER_FIELDS}
  query existingUser($identifier: String, $accountType: AccountTypeEnum, $institutionId: UUID) {
    existingUser(
      identifier: $identifier
      accountType: $accountType
      institutionId: $institutionId
    ) {
      ...ExistingUserPart
    }
  }
`;

export const VERIFY_EXISTING_USER_TOKEN = gql`
  ${CORE_USER_FIELDS}
  query verifyExistingUserTokenOtp($token: String) {
    verifyExistingUserTokenOtp(token: $token) {
      isValid
      existingUser {
        ...UserPart
      }
    }
  }
`;
