import { gql } from '@apollo/client';

export const REGISTER_INSTRUCTOR = gql`
  mutation newUserinformation(
    $interest: String
    $about: String
    $address: String
    $city: String
    $dateOfBirth: CustomDate
    $gender: UserInformationGenderEnumCreate
    $lgaOfOrigin: String
    $nationality: String
    $nin: String
    $postalCode: String
    $state: String
    $stateOfOrigin: String
    $phone: String
  ) {
    createUserInformation(
      newUserinformation: {
        interest: $interest
        about: $about
        address: $address
        city: $city
        dateOfBirth: $dateOfBirth
        gender: $gender
        lgaOfOrigin: $lgaOfOrigin
        nationality: $nationality
        phone: $phone
        nin: $nin
        postalCode: $postalCode
        state: $state
        stateOfOrigin: $stateOfOrigin
      }
    ) {
      ok
      errors {
        messages
      }
      userinformation {
        about
        address
        interest
        city
        createdAt
        dateOfBirth
        gender
        id
        lgaOfOrigin
        nationality
        nin
        postalCode
        phone
        state
        stateOfOrigin
        updatedAt
      }
    }
  }
`;

export const ADD_PUBLICATION = gql`
  mutation newPublication($journalName: String!, $name: String!, $url: String!, $year: String!) {
    createUserPublication(
      newPublication: { journalName: $journalName, name: $name, url: $url, year: $year }
    ) {
      ok
      errors {
        messages
      }
      publication {
        createdAt
        id
        journalName
        name
        updatedAt
        url
        year
      }
    }
  }
`;

export const ADD_EDUCATION = gql`
  mutation newEducation(
    $endYear: String!
    $fieldOfStudy: String!
    $school: String!
    $startYear: String!
    $degree: String
  ) {
    createUserEducation(
      newEducation: {
        endYear: $endYear
        fieldOfStudy: $fieldOfStudy
        school: $school
        startYear: $startYear
        degree: $degree
      }
    ) {
      ok
      errors {
        messages
      }
      education {
        createdAt
        degree
        endYear
        fieldOfStudy
        school
        startYear
        updatedAt
      }
    }
  }
`;

export const CREATE_USER_DOCUMENT = gql`
  mutation createUserDocument($newDocument: DocumentCreateGenericType!, $file: Upload) {
    createUserDocument(newDocument: $newDocument, file: $file) {
      document {
        id
        file
        type
        createdAt
        updatedAt
      }
      ok
      errors {
        messages
      }
    }
  }
`;

export const UPDATE_USER_INFORMATION = gql`
  mutation updateUserInformation($newUserInformation: UserInformationUpdateGenericType!, $id: ID!) {
    updateUserInformation(newUserinformation: $newUserInformation, id: $id) {
      ok
      errors {
        messages
      }
      userinformation {
        about
        address
        interest
        city
        createdAt
        dateOfBirth
        gender
        id
        lgaOfOrigin
        nationality
        nin
        postalCode
        phone
        state
        stateOfOrigin
        updatedAt
      }
    }
  }
`;
