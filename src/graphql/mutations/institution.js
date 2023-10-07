import { gql } from '@apollo/client';
import {
  CORE_INSTITUTION_FIELDS,
  CORE_FACULTY_FIELDS,
  CORE_DEPARTMENT_FIELDS,
  CORE_PROGRAM_TYPE_FIELDS,
  CORE_SESSION_FIELDS,
  CORE_LEVEL_FIELDS,
  CORE_SEMESTER_FIELDS,
} from 'graphql/fragments';

export const CREATE_INSTITUTION = gql`
  ${CORE_INSTITUTION_FIELDS}
  mutation createInstititution(
    $name: String!
    $type: InstitutionTypeEnumList!
    $url: String!
    $abbreviation: String!
    $description: String
    $logo: Upload
    $favicon: Upload
    $status: InstitutionStatusEnumList
    $subdomain: String!
  ) {
    createInstitution(
      newInstitution: {
        name: $name
        url: $url
        description: $description
        abbreviation: $abbreviation
        type: $type
        favicon: $favicon
        status: $status
        logo: $logo
        subdomain: $subdomain
      }
    ) {
      institution {
        ...InstitutionPart
      }
    }
  }
`;

export const UPDATE_INSTITUTION = gql`
  ${CORE_INSTITUTION_FIELDS}
  mutation updateInstitution(
    $institutionId: UUID!
    $name: String!
    $type: InstitutionTypeEnumList!
    $url: String!
    $abbreviation: String!
    $description: String
    $status: InstitutionStatusEnumList
    $address: String
    $city: String
    $zipCode: String
    $state: String
    $lga: String
    $email: String
    $phone: String
    $logo: Upload
    $favicon: Upload
    $subdomain: String
  ) {
    updateInstitution(
      institutionId: $institutionId
      data: {
        name: $name
        url: $url
        description: $description
        abbreviation: $abbreviation
        type: $type
        status: $status
        address: $address
        city: $city
        zipCode: $zipCode
        state: $state
        lga: $lga
        email: $email
        phone: $phone
        logo: $logo
        favicon: $favicon
        subdomain: $subdomain
      }
    ) {
      ok
      errors {
        messages
      }
      institution {
        ...InstitutionPart
      }
    }
  }
`;

export const CREATE_FACULTY = gql`
  ${CORE_FACULTY_FIELDS}
  mutation createFaculty($newFaculty: FacultyInputType!) {
    createFaculty(newFaculty: $newFaculty) {
      ok
      errors {
        field
        messages
      }
      faculty {
        ...FacultyPart
      }
    }
  }
`;

export const UPDATE_FACULTY = gql`
  ${CORE_FACULTY_FIELDS}
  mutation updateFaculty($newFaculty: FacultyUpdateGenericType!) {
    updateFaculty(newFaculty: $newFaculty) {
      ok
      errors {
        field
        messages
      }
      faculty {
        ...FacultyPart
      }
    }
  }
`;

export const CREATE_INSTITUTION_ADMIN = gql`
  ${CORE_INSTITUTION_FIELDS}
  mutation createAdmin(
    $institutionId: UUID!
    $firstname: String!
    $lastname: String!
    $email: String!
  ) {
    createInstitutionAdmin(
      institutionId: $institutionId
      adminDetails: { firstname: $firstname, lastname: $lastname, email: $email }
    ) {
      institution {
        ...InstitutionPart
      }
      errors {
        messages
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  ${CORE_DEPARTMENT_FIELDS}
  mutation createDepartment($newDepartment: DepartmentInputType!) {
    createDepartment(newDepartment: $newDepartment) {
      ok
      errors {
        field
        messages
      }
      department {
        ...DepartmentPart
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  ${CORE_DEPARTMENT_FIELDS}
  mutation updateDepartment($newDepartment: DepartmentUpdateGenericType!) {
    updateDepartment(newDepartment: $newDepartment) {
      ok
      errors {
        field
        messages
      }
      department {
        ...DepartmentPart
      }
    }
  }
`;

export const CREATE_INSTITUTION_PROGRAM = gql`
  ${CORE_PROGRAM_TYPE_FIELDS}
  mutation createProgram($newProgram: ProgramCreateGenericType!) {
    createProgram(newProgram: $newProgram) {
      ok
      errors {
        field
        messages
      }
      program {
        ...ProgramTypePart
      }
    }
  }
`;

export const UPDATE_INSTITUTION_PROGRAM = gql`
  ${CORE_PROGRAM_TYPE_FIELDS}
  mutation updateProgram($newProgram: ProgramUpdateGenericType!, $id: ID!) {
    updateProgram(newProgram: $newProgram, id: $id) {
      ok
      errors {
        field
        messages
      }
      program {
        ...ProgramTypePart
      }
    }
  }
`;

export const CREATE_SESSION = gql`
  ${CORE_SESSION_FIELDS}
  mutation createSession($newInstitutionsession: CreateSessionInputType!) {
    createSession(newInstitutionsession: $newInstitutionsession) {
      ok
      errors {
        field
        messages
      }
      institutionsession {
        ...SessionPart
      }
    }
  }
`;

export const UPDATE_SESSION = gql`
  ${CORE_SESSION_FIELDS}
  mutation updateSession($id: ID!, $newInstitutionsession: UpdateSessionInputType!) {
    updateSession(id: $id, newInstitutionsession: $newInstitutionsession) {
      ok
      errors {
        field
        messages
      }
      institutionsession {
        ...SessionPart
      }
    }
  }
`;

export const CREATE_LEVEL = gql`
  ${CORE_LEVEL_FIELDS}
  mutation createLevel($newLevel: LevelCreateGenericType!) {
    createLevel(newLevel: $newLevel) {
      ok
      errors {
        field
        messages
      }
      level {
        ...LevelPart
      }
    }
  }
`;

export const UPDATE_LEVEL = gql`
  ${CORE_LEVEL_FIELDS}
  mutation updateLevel($newLevel: LevelUpdateGenericType!, $id: ID!) {
    updateLevel(newLevel: $newLevel, id: $id) {
      ok
      errors {
        field
        messages
      }
      level {
        ...LevelPart
      }
    }
  }
`;

export const CREATE_SEMESTER = gql`
  ${CORE_SEMESTER_FIELDS}
  mutation createSemester($newSessionsemester: SessionSemesterCreateGenericType!) {
    createSemester(newSessionsemester: $newSessionsemester) {
      ok
      error {
        field
        messages
      }
      sessionsemester {
        ...SemesterPart
      }
    }
  }
`;

export const UPDATE_SEMESTER = gql`
  ${CORE_SEMESTER_FIELDS}
  mutation updateSemester($newSessionsemester: SessionSemesterUpdateGenericType!, $id: ID!) {
    updateSemester(newSessionsemester: $newSessionsemester, id: $id) {
      ok
      error {
        field
        messages
      }
      sessionsemester {
        ...SemesterPart
      }
    }
  }
`;
