import { gql } from '@apollo/client';

export const GET_COURSE_LIST = gql`
  query courses($search: String, $offset: Int, $limit: Int, $ordering: String) {
    courses(search: $search, offset: $offset, limit: $limit, ordering: $ordering) {
      results {
        title
      }
    }
  }
`;

export const GET_EDUCATION_HISTORY = gql`
  query edcations($userId: UUID, $search: String, $offset: Int, $limit: Int, $ordering: String) {
    educations(
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      userId: $userId
    ) {
      results {
        fieldOfStudy
        startYear
        endYear
        id
        school
        degree
      }
    }
  }
`;

export const VERIFY_REG_TOKEN_QUERY = gql`
  query verifyRegisterToken($token: String!) {
    verifyRegisterToken(token: $token) {
      user {
        firstname
        department {
          name
        }
        email
        roles
        institution {
          abbreviation
          name
        }
      }
      isValid
    }
  }
`;

export const LOGGED_IN_USER = gql`
  query {
    loggedInUser {
      id
      lastname
      firstname
      middlename
      email
      department {
        abbreviation
        description
        id
      }
      level {
        id
        name
        program {
          id
          levelProgram {
            name
            program {
              id
            }
          }
        }
      }
      userinformation {
        id
      }
    }
  }
`;
