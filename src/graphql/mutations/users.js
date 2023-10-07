import { gql } from '@apollo/client';
import { CORE_EXISTING_USER_FULL_FIELDS, CORE_USER_FIELDS } from 'graphql/fragments';

export const UPLOAD_USERS = gql`
  mutation uploadUser($roles: [SignupRoleEnum!], $file: Upload) {
    uploadUser(userUploadDetails: { roles: $roles, file: $file }) {
      ok
      errors {
        messages
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation registerNewUser(
    $title: TitleEnum
    $firstname: String!
    $middlename: String
    $staffId: String
    $lastname: String!
    $email: String!
    $phone: String
    $matricNumber: String
    $institution: UUID
    $department: UUID
    $program: UUID
    $level: UUID
    $faculty: UUID
    $roles: [SignupRoleEnum!]!
    $programType: AcademicProgramTypeEnumList
    $gender: GenderEnum
    $designation: String
    $institutions: [UUID!]
    $visualizations: [VisualizationOptionEnum!]
  ) {
    registerUser(
      userDetails: {
        title: $title
        firstname: $firstname
        middlename: $middlename
        lastname: $lastname
        email: $email
        staffId: $staffId
        phone: $phone
        matricNumber: $matricNumber
        institution: $institution
        department: $department
        roles: $roles
        program: $program
        faculty: $faculty
        level: $level
        programType: $programType
        gender: $gender
        designation: $designation
        institutions: $institutions
        visualizations: $visualizations
      }
    ) {
      ok
      errors {
        messages
      }
      user {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

export const UPDATE_USER = gql`
  ${CORE_USER_FIELDS}
  mutation updateUser($newUser: UserUpdateGenericType!, $id: ID!, $image: Upload) {
    updateUser(newUser: $newUser, id: $id, image: $image) {
      user {
        ...UserPart
      }
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_EXISTING_USER = gql`
  mutation updateExistingUser(
    $existingUserEmail: String
    $existingUserId: UUID!
    $existingUserPhone: String
  ) {
    updateExistingUser(
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

export const UPDATE_USER_INFORMATION = gql`
  mutation updateUserInformation($newUserinformation: UserInformationUpdateGenericType!, $id: ID!) {
    updateUserInformation(newUserinformation: $newUserinformation, id: $id) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const CREATE_USER_INFORMATION = gql`
  mutation createUserInformation($newUserinformation: UserInformationCreateGenericType!) {
    createUserInformation(newUserinformation: $newUserinformation) {
      ok
      userinformation {
        id
        about
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const DEACTIVATE_USERS = gql`
  mutation deactiveUsers($userIds: [UUID]) {
    deactivateUsers(userIds: $userIds) {
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

export const ACTIVATE_USERS = gql`
  mutation activateUsers($userIds: [UUID]) {
    activateUsers(userIds: $userIds) {
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

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      ok
      user {
        id
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const DELETE_MULTI_USER = gql`
  mutation deleteUsers($userIds: [UUID]!) {
    deleteUsers(userIds: $userIds) {
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

export const RESEND_EMAIL = gql`
  mutation resendVerification($userIds: [UUID]!) {
    resendVerification(userIds: $userIds) {
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
